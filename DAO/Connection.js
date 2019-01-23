var MongoClient = require('mongodb').MongoClient;
var callback = () => (monDbName), monDbName;
const dbName = 'soundwave';
// Connection url
var url = 'mongodb://localhost:27017/'+dbName;
// Connect using MongoClient
MongoClient.connect(url,{ useNewUrlParser: true } , function(err, db) {
    // Get an additional db
    if (err) throw err;
    monDbName = db.db(dbName);
    callback(monDbName);

});

module.exports = function (callbackParam) {
    if (typeof monDbName != 'undefined') {
        callbackParam(monDbName);
    }
    else {
        callback = callbackParam;
    }

};