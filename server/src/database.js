const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
// (ToDo, move to .env before production deployment)
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'agileDev';
// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
    assert.strictEqual(null, err);
    console.log('Connected successfully to server');
});

module.exports = {
    database: client.db(dbName)
};
