const database = require('./database');
let mongoose = require('mongoose');
let groups = require('./groupChat');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    friendLists: {
        type: Array,
    },
    groupLists: {
        type: Array,
    },
});

let userModel = mongoose.model('User', userSchema);

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
     * @param {String} userName
     * @returns user with username: userName or null if there's no user fits
     */
    getUserByUsername: async function (userName) {
        return await userModel.findOne({
            username: userName,
        });
    },

    /**
     *
     * @param {ObjectId} id
     * @returns user with _id: id or null if there's no user fits
     */
    getUserById: async function (id) {
        return await userModel.findById(id);
    },

    /**
     *
     * @param {String} userName - username
     * @param {String} passWord - md5 code of password
     * @returns True if account is successful created
     */
    createUser: async function (userName, passWord) {
        let newUser = new userModel({
            username: userName,
            password: passWord,
        });

        let successCreatedUser = false;

        newUser
            .save()
            .then((success) => {
                successCreatedUser = true;
            })
            .catch((err) => {
                console.log(err);
                successCreatedUser = false;
            });

        return successCreatedUser;
    },

    /**
     *
     * @param {ObjectId} idA index of first user
     * @param {ObjectId} idB index of second user
     * @returns True if relation is acceptable, False otherwise
     */
    addFriend: async function (idA, idB) {
        let groupId = await groups.createGroup([idA, idB]);

        let acceptable = groupId == null ? false : true;

        userModel.findOneAndUpdate(
            {
                _id: idA,
            },
            {
                $push: {
                    friendLists: idB,
                    groupLists: groupId,
                },
            },
            function (error, success) {
                if (error) {
                    acceptable = false;
                    console.log(error);
                }
            },
        );

        userModel.findOneAndUpdate(
            {
                _id: idB,
            },
            {
                $push: {
                    friendLists: idA,
                    groupLists: groupId,
                },
            },
            function (error, success) {
                if (error) {
                    acceptable = false;
                    console.log(error);
                }
            },
        );

        return acceptable;
    },
};
