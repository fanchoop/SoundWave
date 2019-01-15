function Connexion() {}

function err(callback) {
    if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText);
    }
}

Connexion.prototype.requestGet = function (url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        //     if (this.readyState == 4 && this.status == 200) {

        err(callback);
    };
    //xhttp.setRequestHeader("Access-Control-Allow-Origin","");
    xhttp.open("GET", url, true);
    xhttp.send();
};

Connexion.prototype.PostRequest = function (url, values, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        err(callback);
    };

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(values);
};

Connexion.prototype.PutRequest = function (url, values, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        err(callback);
    };

    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(values);
};

Connexion.prototype.getMusiques = function (callback) {
    this.requestGet("http://localhost:3000/musique", callback);
};

Connexion.prototype.getMusiqueById = function (id, callback) {
    this.requestGet("http://localhost:3000/musique/" + id, callback);
};

Connexion.prototype.getMusiqueByTitre = function (title, callback) {
    this.requestGet("http://localhost:3000/music/find/music/title/" + title, callback);
};
/*
Connexion.prototype.getPlaylistById = function(id, callback){
    this.requestGet("http://localhost:3000/music/find/playlist/id/" + id, callback);
};

Connexion.prototype.getPlaylistByName = function(name, callback){
    this.requestGet("http://localhost:3000/music/find/playlist/name/" + name, callback);
};

*/
/**             PUT            */ //TODO
Connexion.prototype.addLike = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/music/maj/like/" + idMusic, null, callback);
};
Connexion.prototype.removeLike = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/music/maj/removeLike/" + idMusic, null, callback);
};
Connexion.prototype.addNumberOfView = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/music/maj/views/" + idMusic, null, callback);
};

Connexion.prototype.addNumberOfShare = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/music/maj/share/" + idMusic, null, callback);
};
Connexion.prototype.addMusicToPlaylist = function (idPlaylist, idMusic, callback){
    this.requestPut("http://localhost:3000/music/maj/playlist/add/" + idPlaylist, JSON.parse('{"idMusic" : '+idMusic+'}'), callback);
};

Connexion.prototype.removeMusicToPlaylist = function (idPlaylist, idMusic, callback){
    this.requestPut("http://localhost:3000/music/maj/playlist/remove/" + idPlaylist, JSON.parse('{"idMusic" : '+idMusic+'}'), callback);

};

/**         Common part          */

/**
 * Allow to get the id (if exist) of the music put in the url
 * @returns {number}
 */

var Connexion = new Connexion();