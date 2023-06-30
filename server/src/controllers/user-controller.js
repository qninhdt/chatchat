const { socketMap } = require('../socket');
const {
    addFriend,
    getUserById,
    getUserByUsername,
    getAllUsers,
} = require('../services/user');

// GET /api/users
async function getUsersController(req, res) {
    res.status(200).json({
        users: await getAllUsers(),
    });
}

// GET /api/users/:id
async function getUserController(req, res) {
    const user = await getUserById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    delete user._doc.password;

    res.status(200).json(user);
}

// GET /api/users/:id/friends
async function getFriendsController(req, res) {
    const friends = [];

    const user = await getUserById(req.params.id);

    for (const friend_id of user.friend_ids) {
        const friend = await getUserById(friend_id);
        delete friend._doc.password;
        delete friend._doc.group_ids;
        delete friend._doc.friend_ids;
        friends.push(friend);
    }

    res.status(200).json({
        friends,
    });
}

// POST /api/friends
async function addFriendController(req, res) {
    if (req.user._id == req.body.friend_id) {
        return res.status(400).json({ message: 'Cannot add yourself' });
    }

    // update in database
    let ok = await addFriend(req.user._id, req.body.friend_id);

    if (!ok) {
        return res.status(400).json({ message: 'Cannot add friend' });
    }

    // emit event to 2 users
    const users = [req.user._id, req.body.friend_id];

    users.forEach((user, idx) => {
        const sockets = socketMap.get(user);
        if (!sockets) {
            return;
        }
        sockets.forEach((socket) => {
            socket.emit('new_friend', { friend_id: users[1 - idx] });
        });
    });

    res.status(201).json({
        message: `Friend added successfully`,
    });
}

module.exports = {
    getUsersController,
    getUserController,
    addFriendController,
    getFriendsController,
};
