var express = require('express');
var myRouter = express.Router();
let musique = require('../../DAO').musique;

myRouter.route('/')
    .get(function (req, res, next) {
        musique.findAll(function (err, result) {
            if (err) next(err);

            else {
                res.json(result);
            }
        })
    })

    .post(function(req, res,next) {
        musique.insertOne(req.body, function (err, result) {
            if (err) next(err);
            else {
                res.json({'msg': '1 document inserted'});
            }

        })
    });

myRouter.route('/:id')
    .put(function(req,res,next){
        musique.updateOne({'restaurant_id':req.param.id},req.body,function (err,result) {
            if (err) next(err);
            else {
                res.json({'msg ':' 1 document updated'});
            }
        })

    })
    .delete(function(req, res, next) {
        musique.deleteOne(req.param.id,function (err,result) {
            if (err) next(err);
            else {
                res.json({'msg' : '1 document deleted'});
            }
        });
    })
    .get(function (req, res, next) {
        var id = req.params.id;
        var query = {'idPlage':Number(id)};
        musique.findByOption(query,function (err, result) {
            if (err) next(err);

            else {
                res.json(result);
            }
        })
    })




module.exports = myRouter;