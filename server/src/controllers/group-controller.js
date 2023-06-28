function getLastestMessagesController(req, res) {
    const { offset, limit } = req.query;
    const { id } = req.params;

    // response some fake messgaes with different contents
    res.staus(200).json([
        {
            _id: '0',
            sender_id: '0',
            group_id: '0',
            content: 'Hello',
        },
        {
            _id: '1',
            sender_id: '1',
            group_id: '0',
            content: 'lo cc',
        },
        {
            _id: '2',
            sender_id: '0',
            group_id: '0',
            content: '? bro',
        },
        {
            _id: '3',
            sender_id: '2',
            group_id: '1',
            content: 'abcxyz',
        },
    ]);
}

module.exports = { getLastestMessagesController };
