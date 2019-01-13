var express = require('express');
var myRouter = express.Router();
let musique = require('../../DAO').musique;

myRouter.route('/')
    .get(function(req, res, next) {
        res.render("lecteur", { title: "Lecteur" });
    });

module.exports = myRouter;