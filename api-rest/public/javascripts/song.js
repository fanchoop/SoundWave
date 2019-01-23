let Song = function(idPlage, duree, peaks, cheminCover, cheminMP3) {
    this.idPlage = idPlage;
    this.duree = duree;
    this.peaks = peaks;
    this.cheminPochette = cheminCover;
    this.cheminMP3 = cheminMP3;
    this.smId = "s" + idPlage;
    this.liked = false;
}