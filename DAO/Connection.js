var MongoClient = require('mongodb').MongoClient;
var callback = () => (toto), toto;
const dbName = 'soundwave';
// Connection url
var url = 'mongodb://localhost:27017/'+dbName;
// Connect using MongoClient
MongoClient.connect(url,{ useNewUrlParser: true } , function(err, db) {
    // Get an additional db
    if (err) throw err;
    console.log("connecté");
    toto = db.db(dbName);
    callback(toto);

});

module.exports = function (callbackParam) {
    if (typeof toto != 'undefined') {
        callbackParam(toto);
    }
    else {
        callback = callbackParam;
    }

};