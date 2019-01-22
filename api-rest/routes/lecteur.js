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
    .get(function(req, res, next) {
        res.render('embed',{title: "Lecteur intégré sans musique."});
    });
module.exports = myRouter;