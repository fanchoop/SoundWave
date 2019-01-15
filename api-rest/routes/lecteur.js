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


/*myRouter.route('/embed/:id')
    .get(function (req, res, next) {
        var id = req.params.id;
        var query = {'idPlage':Number(id)};
        musique.findByOption(query,function (err, result) {
            if (err) next(err);

            else {
                res.render('embed',{title: "Lecteur intégré."});
            }
        })
    });*/
module.exports = myRouter;