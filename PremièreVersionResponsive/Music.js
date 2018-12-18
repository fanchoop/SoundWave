class Music {

    constructor(jsonFile){
        let data = JSON.parse(jsonFile);
        this.idPlage = data.idPlage;
        this.titre = data.titre;
        this.duree = data.duree;
        this.nbLike = data.nbLike;
        this.nbCommentaire = data.nbCommentaire;
        this.nbEcoute = data.nbEcoute;
        this.cheminPic = data.cheminPic;
        this.nomAuteur = data.nomAuteur;
        this.anneePlage = data.anneePlage;
        this.pochette = data.pochette;
        this.cheminMP3 = data.cheminMP3;
    }

}

exports.Music = Music.prototype;
