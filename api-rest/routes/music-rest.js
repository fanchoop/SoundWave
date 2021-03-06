var express = require("express");
var myRouter = express.Router();
let musique = require("../../DAO").musique;
var muisqueMeta = require("music-metadata");
var duree;
var shell = require("shelljs");
var fs = require("fs");
var words;
/* Affichage des résultats de la requête findAll faite à la base de données */
myRouter
    .route("/")
    .get(function(req, res, next) {
        musique.findAll(function(err, result) {
            if (err) next(err);
            else {
                res.json(result);
            }
        });
    })

    /* Envoi des données saisie dans le formulaire d'ajout des musique */
    .post(function(req, res, next) {
        //Recupération des fichiers envoyée par le formulaire
        let mp3 = req.files.music;
        let cover = req.files.cover;
        var idPlage = 0;
        //Récupération des extenssions des fichiers reçu
        let regex = /(?:\.([^.]+))?$/;
        let verification1 = regex.exec(req.files.music.name)[1];
        let verification2 = regex.exec(req.files.cover.name)[1];

        if ((verification1 === "mp3" && verification2 === "jpg") || verification2 === "jpeg" || verification2 ==="png") {
            //Modification des nom des fichiers pour remplacer les espace par des tirets
            let songwithoutSpace = req.files.music.name.replace(/\s+/g, '-').toLowerCase();
            let newNameSongNoExtNoSPace = req.body.name.replace(/\s+/g, '-').toLowerCase();
            //Modification des nom des fichiers pour remplacer les # par des tirets
            songwithoutSpace = songwithoutSpace.replace(/#/g, '-');
            newNameSongNoExtNoSPace = newNameSongNoExtNoSPace.replace(/#/g,'-');


            //Remove des éléments qui sont dans les parenthèses.
            var newNameSong = songwithoutSpace.replace(/\(.[^(]*\)/g, '');
            let newNameSongNoExt = newNameSongNoExtNoSPace.replace(/\(.[^(]*\)/g, '');
            let newNameCover = req.files.cover.name.replace(/\s+/g, '-').toLowerCase();
            if(req.body.id === undefined) {
                musique.findLastEntry(function (err, result) {
                    if (err) next(err);
                    if(result[0]) {
                        idPlage = result[0].idPlage;
                        idPlage++;
                    }else {
                        idPlage = 1;
                    }
                });
            } else {
                var idDel = req.body.id;
                var queryDel = {idPlage: Number(idDel)};
                musique.deleteOne(queryDel,function (err) {
                    if (err) next(err);
                    else {
                        idPlage = Number(req.body.id);
                    }
                });
            }
            //Chemin d'entrée et de sortie pour la commande audioWaveform
            let path = appRoot + '/public/songs/' + newNameSong;
            let dest = appRoot + '/public/songData/' + newNameSongNoExt + ".json";
            mp3.mv(path, function(err) {
                if (err) return res.status(500).send(err);
                // recuperation des metadata
                muisqueMeta
                    .parseFile(path, { native: true })
                    .then(metadata => {
                        duree = metadata.format.duration;
                        creatJson(dest, readJson);
                    })
                    .catch(err => {
                        next(err);
                    });
            });
            // Les fichiers sont déplacé dans un autre dossier sur le serveur.
            cover.mv(appRoot + '/public/cover/' + newNameCover, function(err) {
                if (err) return res.status(500).send(err);
            });

            //Création du fichier JSON contenant tout les peaks
            function creatJson(dest, callback) {
                shell.exec("audiowaveform -i " + path + " -b 8 -z 44100 -o " + dest);
                callback(dest, envoi);
            }
            //Lecture des données généré dans le JSON
            function readJson(dest, callback) {
                let donnee = fs.readFileSync(dest, "utf8");
                words = JSON.parse(donnee);
                callback(dest, delJSON);
            }

            //destruction du fichier JSON
            function delJSON() {
                shell.exec("rm " + dest);
            }

            //Fonction d'envoi dans la base de données.
            function envoi(dest, callback) {
                let request = {
                    idPlage: idPlage,
                    titre: req.body.name,
                    duree: duree,
                    nbLike: 0,
                    nbCommentaire: 0,
                    nbEcoute: 0,
                    peaks: words.data,
                    nomAuteur: req.body.author,
                    anneePlage: req.body.date,
                    cheminPochette: '/cover/' + newNameCover,
                    cheminMP3: '/songs/' + newNameSong
                };
                musique.insertOne(request, function(err) {
                    if (err) next(err);
                    else {
                        res.redirect('manage-song');
                        callback(delJSON);
                    }
                });
            }
        } else {
            return res.send("Les fichiers fournis ne sont pas au bon format.");
        }
    });

//Mise à jour d'une plage.
myRouter
    .route("/:id")
    .put(function(req, res, next) {
        var id = req.params.id;
        var query = { idPlage: Number(id) };
        musique.updateOne(query, req.body, function(err) {
            if (err) next(err);
            else {
                res.redirect('manage-song');
            }
        });
    })

    //Récupération d'une plage via son id
    .get(function(req, res, next) {
        let query = { idPlage: Number(req.params.id) };
        musique.findByOption(query, function(err, result) {
            if (err) next(err);
            else {
                res.json(result);
            }
        });
    });
//Suppression d'une plage
myRouter.route('/del/:id')
    .get(function(req,res,next){
        var id = req.params.id;
        var query = {idPlage: Number(id)};
        musique.deleteOne(query,function (err) {
            if (err) next(err);
            res.redirect('/manage-song');
        });
    });
myRouter.route('/mod/:id')
    .get(function(req,res,next){
        var id = req.params.id;
        var query = {idPlage: Number(id)};
        musique.findByOption(query,function (err,result) {
            if (err) next(err);
            res.render("add-song-modifie",{titre: "Modifier une musique",data:result});
        });
    });
    
//Récupération d'une plage via son Titre
myRouter.route("/titre/:titre").get(function(req, res) {
    let title = new RegExp(req.params.titre);
    musique.findByTitre({ titre: { $regex: title } }, function(err, result) {
        if (err) {
            res.send(err);
        }
        res.json(result);
    });
});
//Ajout d'un like
myRouter.route("/addLike/:id").put(function(req, res) {
    musique.updateIncrement({ idPlage: Number(req.params.id) }, { nbLike: 1 }, function(err, status) {
        if (err) {
            res.json(err);
        } else {
            res.json(status);
        }
    });
});
//Suppression d'un like
myRouter.route("/delLike/:id").put(function(req, res) {
    musique.updateIncrement({ idPlage: Number(req.params.id)},{ nbLike: -1 }, function(err, status) {
        if (err) {
            res.json(err);
        }
        res.json(status);
    });
});
//Mise à jour du nombre de vue +1
myRouter.route("/addView/:id").put(function(req, res) {
    musique.updateIncrement({ idPlage: Number(req.params.id) }, { nbEcoute: 1 }, function(err, status) {
        if (err) {
            res.json(err);
        }
        res.json(status);
    });
});
//Mise à jour du nombre de vue -1
myRouter.route("/delView/:id").put(function(req, res) {
    musique.updateIncrement({ idPlage: Number(req.params.id) }, { nbEcoute: -1 }, function(err, status) {
        if (err) {
            res.json(err);
        }
        res.json(status);
    });
});

module.exports = myRouter;
