var express = require('express');
var myRouter = express.Router();
let http = require('http');
let musique = require('../../DAO').musique;

myRouter.get('/:id', function (req, res, next) {
    let apiUrl = 'http://localhost:3000/musique/'+req.params.id;
    http.get(apiUrl, (resp) => {

        let buffer = "";
        resp.on("data", function (chunk) {
            buffer += chunk;
        });

        resp.on("end", function (err) {
            if (err) next(err);
            let result = JSON.parse(buffer)[0];
            if (result != undefined) {
                res.render('lecteur', {data : JSON.parse(buffer)[0]});
            } else {
                next(new Error(404));
            }
        });
    });
})

myRouter.route('/embed')
    .get(function (req, res, next) {
        res.render('embed', { title: "Lecteur intégré sans musique." });
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