// From https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module
const MongoClient = require('mongodb').MongoClient;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const url = process.env.DBSTRING;

var _client;
var _db;

async function connectToServer() {
  _client = await MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  _db = await _client.db('dev')
}

function getDb() {
  return _db;
}

function closeDb(){
  _client.close();
}

module.exports = {
  connectToServer: connectToServer,
  getDb: getDb,
  closeDb: closeDb
};