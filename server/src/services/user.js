const database = require('./database');
let mongoose = require('mongoose');
let group = require('./group');

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
    display_name: {
        type: String,
        required: true,
    },
    friend_ids: {
        type: Array,
    },
    group_ids: {
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
     * @param {String} userName username
     * @param {String} passWord md5 code of password
     * @param {String} displayName user's display name
     * @returns null if account is unsuccessful created, otherwise the informations about that's user
     */
    createUser: async function (userName, passWord, displayName) {
        let newUser = new userModel({
            username: userName,
            password: passWord,
            display_name: displayName,
        });

        let userDocs = null;

        await newUser
            .save()
            .then((docs) => {
                userDocs = docs;
            })
            .catch((err) => {
                userDocs = null;
                console.log(err);
            });

        return userDocs;
    },

    /**
     *
     * @param {ObjectId} idA index of first user
     * @param {ObjectId} idB index of second user
     * @returns True if relation is acceptable, False otherwise
     */
    addFriend: async function (idA, idB) {
        let groupId = await group.createGroup([idA, idB]);

        let acceptable = groupId == null ? false : true;

        await userModel.findOneAndUpdate(
            {
                _id: idA,
            },
            {
                $push: {
                    friend_ids: idB,
                    group_ids: groupId,
                },
            },
            // Error: "Model.findOneAndUpdate() no longer accepts a callback"
            // function (error, success) {
            //     if (error) {
            //         acceptable = false;
            //         console.log(error);
            //     }
            // },
        );

        await userModel.findOneAndUpdate(
            {
                _id: idB,
            },
            {
                $push: {
                    friend_ids: idA,
                    group_ids: groupId,
                },
            },
            // function (error, success) {
            //     if (error) {
            //         acceptable = false;
            //         console.log(error);
            //     }
            // },
        );

        return acceptable;
    },
};

/*--- This code is to delete all user ---*/
// userModel.deleteMany({}).then(() => {
//     console.log("done");
// }).catch((err) => {
//     console.log(err);
// });
