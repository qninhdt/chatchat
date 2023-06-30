const { createMessage, getMessage } = require('../services/message');
const { getGroup } = require('../services/group');

async function getLastestMessagesController(req, res) {
    const { offset, limit } = req.query;
    const { id } = req.params;

    // TODO: add logic to check if user is a member of the group later

    const messages = await getMessage(id, Number(offset), Number(limit));

    res.status(200).json({
        messages,
    });
}

async function getGroupController(req, res) {
    const { id } = req.params;

    const group = await getGroup(id);

    res.status(200).json({
        group,
    });
}

module.exports = { getLastestMessagesController, getGroupController };
