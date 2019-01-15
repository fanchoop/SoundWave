function Player () {
    //Permet de récuperer le paramètre Get

    function $_GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function( m, key, value ) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );
        if ( param ) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }
    this.str_pad_left = function(string,pad,length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    };
    this.tempsEnSeconde = function(duree){
        let minutes = Math.floor(duree / 60);
        let seconds = duree - minutes * 60;
        return minutes + ":" + this.str_pad_left(seconds,'0',2);
    };
    var idMorceau = $_GET('morceau'),
        musique;

    Connexion.getMusiqueById(idMorceau, function (music) {
        musique = new Music(JSON.parse(music));
    }.bind(this));
    console.log("toto");
    console.log(musique);


    var soundPlaying; // On le déclare avant, histoire qu'il soit une variable globale.
    soundManager.onload = function() {
        soundPlaying = soundManager.createSound(
            {
                id : "premier_son",
                url : "musique/son.mp3" // Attention pas de virgule ici !
            });
        soundPlaying.play();
    }



    this.displayInfo = function () {
        console.log("IXI");
        let currentMusic = newMusique;//this.Playlist.getMusiqueCourante();
       /* if (currentMusic != null) {
            document.querySelector(".audioplayer .visuel").style.background = "url(" + currentMusic.cheminPochette + ")";
            document.querySelector(".audioplayer .artiste").innerText = currentMusic.nomAuteur;
            document.querySelector(".audioplayer .titre").innerText = currentMusic.titre;
            document.querySelector(".audioplayer .total").innerText = this.tempsEnSeconde(currentMusic.duree);
            document.querySelector(".audioplayer .nb-lectures").innerText = currentMusic.nbEcoute;
            document.querySelector(".audioplayer .nb-commentaires").innerText = currentMusic.nbCommentaire;
            document.querySelector(".audioplayer .like").innerText = currentMusic.nbJaime;
        }*/
    };

    constructor();
}
console.log("toto");


