function Connexion() {}

function err(callback) {
    if (this.readyState === 4 && this.status === 200) {
        callback(this.responseText);
    }
}

Connexion.prototype.GetRequest = function (url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (xhttp.readyState === 4){
            if (xhttp.status.toString().startsWith(2)) {
                callback(null, xhttp);
            } else {
                callback(new Error(this.status, this.statusText));
            }
        }
    };
    xhttp.onerror = function() {
        callback(new Error(this.status, this.statusText));
    };
    xhttp.open("GET", url, true);
    xhttp.send(null);
};

Connexion.prototype.PostRequest = function (url, values, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (xhttp.readyState === 4){
            if (xhttp.status.toString().startsWith(2)) {
                callback(null, xhttp);
            } else {
                callback(new Error(this.status, this.statusText));
            }
        }
    };
    xhttp.onerror = function() {
        callback(new Error(this.status, this.statusText));
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(values);
};

Connexion.prototype.PutRequest = function (url, values, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        if (xhttp.readyState === 4){
            if (xhttp.status.toString().startsWith(2)) {
                callback(null, xhttp);
            } else {
                callback(new Error(this.status, this.statusText));
            }
        }
    };
    xhttp.onerror = function() {
        callback(new Error(this.status, this.statusText));
    };
    xhttp.open("PUT", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(values);
};

/**  GET */

Connexion.prototype.getMusiques = function (callback) {
    this.GetRequest("http://localhost:3000/musique", callback);
};

Connexion.prototype.getMusiqueById = function (id, callback) {
    this.GetRequest("http://localhost:3000/musique/" + id, callback);
};

Connexion.prototype.getMusiqueByTitre = function (title, callback) {
    this.GetRequest("http://localhost:3000/musique/find/music/title/" + title, callback);
};


/**             PUT            */

Connexion.prototype.addLike = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/addLike/" + idMusic, null, callback);
};
Connexion.prototype.removeLike = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/delLike/" + idMusic, null, callback);
};
Connexion.prototype.addViewNumber = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/addView/" + idMusic, null, callback);
};
Connexion.prototype.addNumberOfShare = function (idMusic, callback) {
    this.PutRequest("http://localhost:3000/musique/delView/" + idMusic, null, callback);
};
Connexion.prototype.addCom = function (idMusic, callback) {
    this.PutRequest("http:/localhost:3000/musique/addCom/" + idMusic, null, callback);
};
Connexion.prototype.delCom = function (idMusic, callback) {
    this.PutRequest("http:/localhost:3000/musique/delCom/" + idMusic, null, callback);
};



let connexion = new Connexion();