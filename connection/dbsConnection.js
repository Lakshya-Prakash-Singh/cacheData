const MongoClient = require( 'mongodb' ).MongoClient;
const globals = require("../globals.json");
require('dotenv').config();

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( process.env.dbsURL,  { useUnifiedTopology: true, useNewUrlParser: true }, function( err, client ) {
        if (!err) {
            _db  = client.db(process.env.dbsName);
            globals._dbs = _db;
            return callback( false );
        }
        else {
            console.log(err);
            var logStream = fs.createWriteStream('logs.txt', {flags: 'a'});
            logStream.write("\r\n" + (new Date()).toISOString() + " ----- " + err);
            logStream.end();
            return callback( err );
        };
    } );
  },

  getDb: function() {
    return _db;
  }
};