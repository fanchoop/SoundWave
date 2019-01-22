var express = require('express');
var myRouter = express.Router();
let musique = require('../../DAO').musique;
var muisqueMeta = require('music-metadata');
var duree;
var shell = require('shelljs');
var fs = require('fs');
var words;

myRouter.route('/')
    .get(function (req, res, next) {
        musique.findAll(function (err, result) {
            if (err) next(err);

            else {
                res.json(result);
            }
        })
    })

    .post(function (req, res, next) {
        //Recupération des fichiers envoyée par le formulaire
        let mp3 = req.files.music;
        let cover = req.files.cover;


        let regex = /(?:\.([^.]+))?$/;
        let verification1 = regex.exec(req.files.music.name)[1];
        let verification2 = regex.exec(req.files.cover.name)[1];

        if (verification1 ==='mp3' && verification2 ==='jpg') {


            //Modification des nom des fichiers pour remplacer les espace par des tirets
            let songwithoutSpace = req.files.music.name.replace(/\s+/g, '-').toLowerCase();
            let newNameSongNoExtNoSPace = req.body.name.replace(/\s+/g, '-').toLowerCase();

            //Remove des éléments qui sont dans les parenthèses.
            var newNameSong = songwithoutSpace.replace(/\(.[^(]*\)/g, '');
            let newNameSongNoExt = newNameSongNoExtNoSPace.replace(/\(.[^(]*\)/g, '');

            let newNameCover = req.files.cover.name.replace(/\s+/g, '-').toLowerCase();
            //Chemin d'entrée et de sortie pour la commande audioWaveform
            let path = "../api-rest/public/songs/" + newNameSong;
            let dest = "../api-rest/public/songData/" + newNameSongNoExt + ".json";
            mp3.mv(path, function (err) {
                if (err)
                    return res.status(500).send(err);
                // recuperation des metadata
                muisqueMeta.parseFile(path, {native: true})
                    .then(metadata => {
                        duree = metadata.format.duration;
                        creatJson(dest, readJson);

                    })
                    .catch(err => {
                        console.log(err.message);
                    });
            });
            cover.mv('../api-rest/public/cover/' + newNameCover, function (err) {
                if (err)
                    return res.status(500).send(err);
            });

            function creatJson(dest, callback) {
                shell.exec('audiowaveform -i ' + path + ' -b 8 -z 44100 -o ' + dest);
                callback(dest, envoi);
            }

            function readJson(dest, callback) {
                let donnee = fs.readFileSync(dest, 'utf8');
                words = JSON.parse(donnee);
                callback(dest, delJSON);
            }

            //destruction du fichier JSON
            function delJSON() {
                shell.exec('rm ' + dest);

            }

            //Fonction d'envoi dans la base de données.
            function envoi(dest, callback) {
                let request = {
                    idPlage: 9,
                    titre: req.body.name,
                    duree: duree,
                    nbLike: 0,
                    nbCommentaire: 0,
                    nbEcoute: 0,
                    peaks: words.data,
                    nomAuteur: req.body.author,
                    anneePlage: req.body.date,
                    cheminPochette: '/SoundWave/api-rest/public/cover/' + newNameCover,
                    cheminMP3: '/SoundWave/api-rest/public/songs/' + newNameSong
                };
                musique.insertOne(request, function (err, result) {
                    if (err) next(err);
                    else {
                        res.render('ajoutSucces');
                        console.log("Le Fichier JSON viens d'être retiré.");
                        callback(delJSON);
                    }

                })
            }
        }
        else {
            return res.send("Les fichiers fournis ne sont pas au bon format.");
        }
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
        let query = {"idPlage": Number(req.params.id)};
        musique.findByOption(query,function (err, result) {
            if (err) next(err);
            else {
                res.json(result);
            }
        });
    });


myRouter.route('/titre/:titre')
    .get(function(req,res){
        let title = new RegExp(req.params.titre);
        musique.findByTitre({titre: { $regex : title}}, function(err, result) {
            if (err) {
                res.send(err);
            }
            res.json(result);
        });
    });
myRouter.route('/updateAdd/like/')
    .put(function (req,res) {
        musique.updateOne({idPlage: req.params.id}, {$inc:{nbLike : 1}}, function(err, status) {
            if (err) {
                res.send(err);
            }
            res.json(status);
        });

    });
myRouter.route('/updateDel/like/')
    .put(function (req,res) {
        musique.updateOne({id: req.params.id}, {$inc:{nbLike : -1}}, function(err, status) {
            if (err) {
                res.send(err);
            }
            res.json(status);
        });

    });
myRouter.route('/updateAdd/view/')
    .put(function (req,res) {
        musique.updateOne({id: req.params.id}, {$inc:{nbEcoute : 1}}, function(err, status) {
            if (err) {
                res.send(err);
            }
            res.json(status);
        });

    });
myRouter.route('/updateRem/view/')
    .put(function (req,res) {
        musique.updateOne({id: req.params.id}, {$inc:{nbEcoute : -1}}, function(err, status) {
            if (err) {
                res.send(err);
            }
            res.json(status);
        });

    });

module.exports = myRouter;