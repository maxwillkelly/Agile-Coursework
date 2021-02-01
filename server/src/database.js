// From https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module
const MongoClient = require('mongodb').MongoClient;

// Import .env file if not in production (Duplicate to index to support test suite)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const url = process.env.DBSTRING;

// Variables for the client and db
var _client;
var _db;

/**
 * Start the connection to the mongoDB server 
 */
async function connectToServer() {
  _client = await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  _db = await _client.db('dev')
}

/**
 * Get the DB object
 * @returns {MongoClient._db}
 */
function getDb() {
  return _db;
}

/**
 * close the connection to the database
 */
function closeDb(){
  _client.close();
}

module.exports = {
  connectToServer: connectToServer,
  getDb: getDb,
  closeDb: closeDb
};