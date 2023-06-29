let mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const dbName = 'chatchatDB';
const username = 'chatchatTeam';
const password = 'passchatchat';

// const dbUrl = `mongodb://${server}/${dbName}`;
const dbUrl = `mongodb+srv://${username}:${password}@cluster0.brvdas3.mongodb.net/?retryWrites=true&w=majority`;

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose
            .connect(dbUrl)
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(() => {
                console.error('Database connection error');
            });
    }
}

module.exports = new Database();
