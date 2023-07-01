const { createMessage, getMessage } = require('../services/message');
const { getGroup } = require('../services/group');

async function getLastestMessagesController(req, res) {
    const { offset, limit } = req.query;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Missing group id' });
    }

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
