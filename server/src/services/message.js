const database = require('./database');
let mongoose = require('mongoose');
let group = require('./group');

let messageSchema = mongoose.Schema(
    {
        groupId: {
            type: mongoose.ObjectId,
            required: true,
        },
        senderId: {
            type: mongoose.ObjectId,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

let messageModel = mongoose.model('Message', messageSchema);

// We export many functions, so use format:
/*
  module.exports ={
    function1,
    function2,
    ...
  };    
*/
module.exports = {
    /**
     *
     * @param {ObjectId} senderId _id of the sender
     * @param {ObjectId} groupId _id of group that include this message
     * @param {string} content
     * @return True if message is sent successfully, False otherwise
     */
    createMessage: async function (_senderId, _groupId, _content) {
        let newMessage = new messageModel({
            groupId: _groupId,
            senderId: _senderId,
            content: _content,
        });

        let isSent = false;

        await newMessage
            .save()
            .then(() => {
                isSent = true;
            })
            .catch((err) => {
                isSent = false;
                console.log(err);
            });

        return isSent;
    },

    /**
     *
     * @param {ObjectId} _groupId _id of group that we are quering
     * @param {Number} _offset the number of skipped messages
     * @param {Number} _limit the number of messages need
     * @returns List of message model
     */
    getMessage: async function (_groupId, _offset, _limit) {
        return await messageModel
            .find({
                groupId: _groupId,
            })
            .skip(_offset)
            .limit(_limit)
            .sort({
                createdAt: 'desc',
            });
    },
};
