var db_connection = require('./Connection');
var musique_dao = require('./MusiqueDAO');
module.exports = {db: db_connection, musique: musique_dao};