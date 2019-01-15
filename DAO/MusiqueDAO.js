var Mongo = require("./Connection");
var MusiqueDAO = function () {

    this.insertOne = function (option,callback) {
        Mongo((db) => {
            db.collection('musique').insertOne(option,{},callback);
        });
    };
    this.updateOne = function (option, newvalues,callback) {
        Mongo((db) => {
            db.collection('musique').updateOne(option, {$set:newvalues},{},callback);
        });
    };
    this.deleteOne = function (option,callback) {
        Mongo((db) => {
            db.collection('musique').deleteOne(option,{},callback);

        });
    };
    this.findAll = function (callback) {
        Mongo((db) => {
            db.collection("musique").find({}).toArray(callback);
        });
    };
    this.findByOption = function (option,callback) {
        Mongo((db) => {
            console.log(option);
            db.collection('musique').find(option).toArray(callback);
        });

    };
    this.findByTitre = function (option,callback) {
        Mongo((db) => {
            console.log(option);
            db.collection('musique').find(option).toArray(callback);
        });

    };
};
var musique_dao = new MusiqueDAO();
module.exports = musique_dao;

