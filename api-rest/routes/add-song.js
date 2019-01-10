var express = require("express");
var router = express.Router();

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render("add-song", { title: "Ajouter une musique" });
    })
    .post(function (req, res, next) {
        console.log(req.body.name);
        console.log(req.body.author);
        console.log(req.body.music);
        res.send();
    });


module.exports = router;
