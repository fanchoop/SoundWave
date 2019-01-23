var express = require("express");
var router = express.Router();
let musique = require('../../DAO').musique;

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render("add-song", { title: "Ajouter une musique" });
    });

router.route('/:id')
    .get(function(req,res,next){
        res.redirect('../musique/mod/'+req.params.id)

    });
module.exports = router;


