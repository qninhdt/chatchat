const database = require('./database');
let mongoose = require('mongoose');
let users = require('./user');

let groupSchema = mongoose.Schema({
    members: {
        type: Array,
    },
});

let groupModel = mongoose.model('Groups', groupSchema);

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
    * @param {id} id of group
    * @returns document of group that is searched if group is founded, no otherwise
    */
    getGroup: async function (id) {
        let group = null;

        await groupModel
            .findById(id)
            .then((resp) => {
                group = resp;
            })
            .catch((err) => {
                group = null;
                console.log(err);
            });

        return group;
    },
    /**
     *
     * @param {list} list_members list of member in new group
     * @returns id of new group after creating
     */
    createGroup: async function (list_members) {
        let newGroup = new groupModel({
            members: list_members,
        });

        let groupId = null;

        await newGroup
            .save()
            .then((resp) => {
                groupId = newGroup._id;
            })
            .catch((err) => {
                groupId = null;
                console.log(err);
            });

        return groupId;
    },
};
