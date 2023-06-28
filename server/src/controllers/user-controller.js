const fakeUsers = [
    {
        _id: '0',
        username: 'qninh',
        password: '123456', // Just for testing, don't do this in production
        display_name: 'Quang Ninh',
        friend_ids: ['1', '2'],
        group_ids: ['0', '1'],
    },
    {
        _id: '1',
        username: 'bardabez',
        password: '123456',
        display_name: 'Bardabez',
        friend_ids: ['0'],
        group_ids: ['0'],
    },
    {
        _id: '2',
        username: 'lmao',
        password: '123456',
        display_name: 'Lmao',
        friend_ids: ['0'],
        group_ids: ['1'],
    },
];

function getUsersController(req, res) {
    res.status(200).json(fakeUsers);
}

function getUserController(req, res) {
    const user = fakeUsers.find((user) => user._id === req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json();
}

module.exports = { fakeUsers, getUsersController, getUserController };
