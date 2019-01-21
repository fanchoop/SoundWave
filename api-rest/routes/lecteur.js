var express = require('express');
var myRouter = express.Router();
let musique = require('../../DAO').musique;

myRouter.route('/')
    .get(function(req, res, next) {
        res.render("lecteur", { title: "Lecteur" });
    });


myRouter.route('/embed')
    .get(function(req, res, next) {
    res.render('embed',{title: "Lecteur intégré sans musique."});
});
module.exports = myRouter;