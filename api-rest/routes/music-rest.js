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

        let stringJson="";
        //Modification des nom des fichiers pour remplacer les espace par des tirets
        let newNameSong = req.files.music.name.replace(/\s+/g, '-').toLowerCase();
        let newNameSongNoExt = req.body.name.replace(/\s+/g, '-').toLowerCase();
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
                    creatJson();

                })
                .catch(err => {
                    console.log(err.message);
                });
        });
        cover.mv('../api-rest/public/cover/' + newNameCover, function (err) {
            if (err)
                return res.status(500).send(err);
        });

        function creatJson() {
            shell.exec('audiowaveform -i ' + path + ' -b 8 -z 44100 -o ' + dest);
            setTimeout(readJson, 15000);
        }

        function readJson() {
               let donnee = fs.readFileSync(dest, 'utf8');
               words=JSON.parse(donnee);
               envoi();
        }
        //destruction du fichier JSON
        function delJSON() {
            shell.exec('rm ' + dest);

        }

        //Fonction d'envoi dans la base de données.
        function envoi() {
            let request = {
                titre: req.body.name,
                duree: duree,
                nbLike: 0,
                nbCommentaire: 0,
                nbEcoute: 0,
                cheminFichierJSON: words.data,
                nomAuteur: req.body.author,
                anneePlage: req.body.date,
                cheminPochette: '/SoundWave/api-rest/public/cover/' + newNameCover,
                cheminMP3: path
            };
            musique.insertOne(request, function (err, result) {
                if (err) next(err);
                else {
                    res.render('ajoutSucces');
                    console.log("Le Fichier JSON viens d'être retiré.");
                    delJSON();
                }

            })
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