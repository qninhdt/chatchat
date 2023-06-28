const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const socketMap = new Map();

function getSocketServer(server) {
    const io = socketIO(server);

    io.on('connection', (socket) => {
        const auth = socket.handshake.headers.authorization;

        if (!auth) {
            console.log('A client has connected but not sent a token');
            return socket.disconnect();
        }

        const token = auth.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                console.log('A client has connected with an invalid token');
                return socket.disconnect();
            }

            socketMap.set(decoded.username, socket);
            socket.username = decoded.username;

            console.log(`${socket.username} has connected`);

            setUpEventHandlers(io, socket);
        });
    });

    return io;
}

function setUpEventHandlers(io, socket) {
    socket.on('disconnect', () => {
        socketMap.delete(socket.username);
        console.log(`${socket.username} has disconnected`);
    });
}

module.exports = { getSocketServer, socketMap };
