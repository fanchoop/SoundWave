var Mongo = require("./Connection");
var MusiqueDAO = function () {

    this.insertOne = function (option,callback) {
        Mongo((db) => {
            db.collection('Musique').insertOne(option,{},callback);
        });
    };
    this.updateOne = function (option, newvalues,callback) {
        Mongo((db) => {
            db.collection('Musique').updateOne(option, {$set:newvalues},{},callback);
        });
    };
    this.deleteOne = function (option,callback) {
        Mongo((db) => {
            db.collection('Musique').deleteOne(option,{},callback);

        });
    };
    this.findAll = function (callback) {
        Mongo((db) => {
            db.collection("Musique").find({}).toArray(callback);
        });
    };
    this.findByOption = function (option,callback) {
        Mongo((db) => {
            console.log(option);
            db.collection('Musique').find(option).toArray(callback);
        });

    };
};
var musique_dao = new MusiqueDAO();
module.exports = musique_dao;

