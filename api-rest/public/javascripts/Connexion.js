function Connexion() {}

function err(callback) {
    if (this.readyState == 4 && this.status == 200) {
        callback(this.responseText);
    }
}

Connexion.prototype.requestGet = function (url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        err(callback);
    };
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
    this.requestGet("http://localhost:3000/musique/find/music/title/" + title, callback);
};


/**             PUT            */

Connexion.prototype.addLike = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/updateAdd/like/" + idMusic, null, callback);
};
Connexion.prototype.removeLike = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/updateDel/like/" + idMusic, null, callback);
};
Connexion.prototype.addViewNumber = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/updateAdd/view/" + idMusic, null, callback);
};

Connexion.prototype.addNumberOfShare = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/updateRem/view/" + idMusic, null, callback);
};
var Connexion = new Connexion();