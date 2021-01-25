// From https://stackoverflow.com/questions/24621940/how-to-properly-reuse-connection-to-mongodb-across-nodejs-application-and-module
const MongoClient = require( 'mongodb' ).MongoClient;
const url = process.env.DBSTRING;

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('dev');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};