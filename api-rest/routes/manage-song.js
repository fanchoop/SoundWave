var express = require("express");
var router = express.Router();
let musique = require('../../DAO').musique;
/* GET home page. */

router.get("/", function(req, res, next) {
    //Edition ou suppression des musiques
    musique.findAll(function (err, result) {
        if (err) {
            res.send(err);
        }
        res.render('manage-song', {data: result});
    })
});

module.exports = router;
