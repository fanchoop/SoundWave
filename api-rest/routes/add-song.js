var express = require("express");
var router = express.Router();
/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.render("add-song", { title: "Ajouter une musique" });
    });

module.exports = router;


