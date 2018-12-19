class Music {

  constructor(jsonFile) {
    let data = JSON.parse(jsonFile);
    this.idPlage = data.idPlage;
    this.titre = data.titre;
    this.duree = data.duree;
    this.nbJaime = data.nbJaime;
    this.nbCommentaire = data.nbCommentaire;
    this.nbEcoute = data.nbEcoute;
    this.pic = data.pic;
    this.nomAuteur = data.nomAuteur;
    this.anneeMusique = data.anneeMusique;
    this.cheminPochette = data.cheminPochette;
    this.cheminMP3 = data.cheminMP3;
  }
}

exports.Music = Music.prototype;