class Playlist{
    constructor() {
        this.positionCourante = 0;
        this.musiqueCourante = null;
        this.list = [];


    }
}
Playlist.prototype.ajouterMusique = function(musique) {
    this.list.push(musique);
};

Playlist.prototype.retirerMusiqueCourante = function() {
    this.list.splice(this.positionCourante);
};

Playlist.prototype.getMusiqueCourante = function() {
    return this.musiqueCourante;
};

Playlist.prototype.getPosition = function() {
    return this.positionCourante;
};

Playlist.prototype.setPosition = function(newPosition) {
    this.musiqueCourante = this.list[newPosition];
    this.positionCourante = newPosition;
};
Playlist.prototype.Precedent = function () {
    if (this.positionCourante > 0) {
        this.positionCourante --;
        this.musiqueCourante = this.list[this.musiqueCourante];
    }
};

Playlist.prototype.Suivant = function () {
    if (this.positionCourante < this.list.length) {
        this.positionCourante ++;
        this.musiqueCourante = this.list[this.positionCourante];
    }

};

Playlist.prototype.hydrate = function(json) {
    this.list = JSON.parse(json);
};

