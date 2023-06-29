const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const { getUserById } = require('./services/user');
const { createMessage } = require('./services/message');

const socketMap = new Map();
const groupMap = new Map();

let io = null;

function createSocketServer(server) {
    io = socketIO(server);

    io.on('connection', (socket) => {
        const auth = socket.handshake.headers.authorization;

        if (!auth) {
            console.log('A client has connected but not sent a token');
            return socket.disconnect();
        }

        const token = auth.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.log('A client has connected with an invalid token');
                return socket.disconnect();
            }

            socket._id = decoded._id;
            socket.username = decoded.username;

            await onConnected(socket);
            setUpEventHandlers(socket);
        });
    });
}

async function emitEventToGroup(group_id, event, data) {
    const users = groupMap.get(group_id);

    for (const user_id of users) {
        const sockets = socketMap.get(user_id);
        sockets.forEach((socket) => {
            socket.emit(event, data);
        });
    }
}

async function emitEventToFriends(user_id, event, data) {
    const { friend_ids } = await getUserById(user_id);

    for (const friend_id of friend_ids) {
        if (socketMap.has(friend_id)) {
            const sockets = socketMap.get(friend_id);
            sockets.forEach((socket) => {
                socket.emit(event, data);
            });
        }
    }
}

// handle event when a client connects
async function onConnected(socket) {
    const groups = (await getUserById(socket._id)).group_ids;

    // add socket to socketMap
    if (!socketMap.has(socket._id)) {
        socketMap.set(socket._id, []);
    }

    socketMap.get(socket._id).push(socket);

    // add user to groupMap if not already in it
    groups.forEach((_group_id) => {
        const group_id = _group_id.toString();

        if (!groupMap.has(group_id)) {
            groupMap.set(group_id, []);
        }
        groupMap.get(group_id).push(socket._id);
    });

    await emitEventToFriends(socket._id, 'online', {
        user_id: socket._id,
    });

    console.log(`${socket.username} has connected`);
}

async function onDisconnected(socket) {
    // remove socket from socketMap
    const sockets = socketMap.get(socket._id);
    const index = sockets.indexOf(socket);
    sockets.splice(index, 1);

    if (sockets.length === 0) {
        socketMap.delete(socket._id);
    }

    // remove user from groupMap
    const groups = (await getUserById(socket._id)).group_ids;

    groups.forEach((_group_id) => {
        const group_id = _group_id.toString();

        const users = groupMap.get(group_id);
        const index = users.indexOf(socket._id);
        users.splice(index, 1);

        if (users.length === 0) {
            groupMap.delete(group_id);
        }
    });

    await emitEventToFriends(socket._id, 'offline', {
        user_id: socket._id,
    });

    console.log(`${socket.username} has disconnected`);
}

function setUpEventHandlers(socket) {
    socket.on('new_message', async ({ group_id, content }) => {
        if (!groupMap.has(group_id)) {
            return;
        }

        if (!content) {
            return;
        }

        const users = groupMap.get(group_id);

        // check if user is in group
        if (!users.includes(socket._id)) {
            return;
        }

        // save message to database
        createMessage(socket._id, group_id, content);

        await emitEventToGroup(group_id, 'new_message', {
            group_id,
            content,
            sender_id: socket._id,
        });
    });

    socket.on('disconnect', async () => {
        await onDisconnected(socket);
    });
}

module.exports = { createSocketServer, socketMap, io };
