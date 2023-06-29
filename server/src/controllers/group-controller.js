const { createMessage, getMessage } = require('../services/message');

async function getLastestMessagesController(req, res) {
    const { offset, limit } = req.query;
    const { id } = req.params;

    // TODO: add logic to check if user is a member of the group later

    const messages = await getMessage(id, offset, limit);

    res.status(200).json({
        messages,
    });
}

module.exports = { getLastestMessagesController };
