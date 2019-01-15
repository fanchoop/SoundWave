function Music (fichierJson) {

    let data = JSON.parse(fichierJson);


    this.idPlage = data.idPlage;
    this.titre = data.titre;
    this.duree = data.duree;
    this.nbJaime = data.nbJaime;
    this.nbCommentaire = data.nbCommentaire;
    this.nbEcoute = data.nbEcoute;
    this.peaks = data.peaks;
    this.nomAuteur = data.nomAuteur;
    this.anneeMusique = data.anneeMusique;
    this.cheminPochette = data.cheminPochette;
    this.cheminMP3 = data.cheminMP3;

}