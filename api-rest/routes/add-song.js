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
        res.render("add-song-modifie",{titre: "Modifier une musique"})
    });

router.route('/del/:id')
    .get(function(req,res,next){
        var id = req.params.id;
        var query = {idPlage: Number(id)};
        musique.deleteOne(query,function (err,result) {
            if (err) next(err);
            res.redirect('/add-song')
        })
    });
module.exports = router;


