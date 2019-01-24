let Player = function () {
    this.pauseButton = document.querySelector(".audioplayer > .controls >.play-pause");
    this.volumeButton = document.querySelector(".audioplayer > .controls > .volume");
    this.svg = document.querySelector(".audioplayer > svg");
    this.likeButton = document.querySelector(".audioplayer > .social > .like");
    this.shareDisplay = document.querySelector(".audioplayer > .social > .share");
    this.comButton = document.querySelector(".audioplayer > .statistiques > .nb-commentaires");
    this.viewDisplay = document.querySelector(".audioplayer > .statistiques > .nb-lectures");
    this.sliderTimeout;
};

let player = new Player();

Player.prototype.createWaveform = function () {
    this.waveform = new Waveform(document.querySelector(".waveform"), 0.66, 5, 1, song.peaks);
    this.waveform.draw();
    this.appendListeners();
};

Player.prototype.appendListeners = function () {
    let rects = document.querySelectorAll("svg > rect.peak");
    for (let i = 0; i < rects.length; i++) {
        rects[i].addEventListener("click", function(e){
            player.onWaveClick(e);
        });

        rects[i].addEventListener("mouseenter", function(e) {
            this.waveform.moveHover(e.currentTarget);
        }.bind(this));

        rects[i].addEventListener("mouseout", function(e) {
            this.waveform.clearHover();
        }.bind(this));
    }
};


Player.prototype.redraw = function () {
    this.waveform.draw();
    let smSong = soundManager.getSoundById(song.smId);
    this.waveform.colorUntilX(util.getXFromTime(smSong.position, song.duree));
    this.appendListeners();
};

Player.prototype.toggleSlider = function(e) {
    let slider = document.querySelector(".slider");
    if (!slider) {
        slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.setAttribute("min", 0);
        slider.setAttribute("max", 100);
        slider.setAttribute("class", "slider");
        slider.value = this.volumeButton.getAttribute("data-value");

        slider.addEventListener("mouseout", function(e) {
            player.sliderTimeout = setTimeout(function() {
                e.target.parentElement.removeChild(slider);
            }, 1000);
        });

        slider.addEventListener("mouseenter", function(e) {
            clearTimeout(player.sliderTimeout);
        });

        slider.addEventListener("change", function(e){
            player.volumeButton.setAttribute("data-value", e.target.value);
            soundManager.setVolume(e.target.value);
        });

        e.currentTarget.parentElement.appendChild(slider);
    } else {
        e.currentTarget.parentElement.removeChild(slider);
        clearTimeout(player.sliderTimeout);
    }
};

Player.prototype.setSoundManagerPosition = function (rect) {
    let x = parseFloat(rect.getAttribute("x"));
    let currentTime = util.getTimeFromX(x);
    soundManager.setPosition(song.smId, currentTime * 1000);
};

/**
 * Gere le clic de l'utilisateur sur un rectangle de la waveform
 * @param {Event} e
 */
Player.prototype.onWaveClick = function (e) {
    //fait reculer la coloration
    this.setSoundManagerPosition(e.target);
    this.waveform.clearHover();
};

Player.prototype.setMaxDuree = function (duree) {
    document.querySelector('.total').innerText = duree;
};

Player.prototype.setDuree = function (duree) {
    document.querySelector(".en-cours").innerText = duree;
};

Player.prototype.setCover = function () {
    let img = document.querySelector(".visuel img");
    if (!img) {
        img = document.createElement("img");
    }
    util.addClass(img, "visuel");
    img.setAttribute("src", song.cheminPochette);
    document.querySelector(".visuel").appendChild(img);
};

Player.prototype.toggleLike = function () {
    if (!song.liked) {
        connexion.addLike(song.idPlage, function (err) {
            if (!err) {
                song.liked = true;
                player.likeButton.innerText = parseInt(player.likeButton.innerText) + 1;
            }
        });
    } else {
        connexion.removeLike(song.idPlage, function (err) {
            if (!err) {
                song.liked = false;
                player.likeButton.innerText = parseInt(player.likeButton.innerText) - 1;
            }
        });
    }
};

Player.prototype.addCom = function () {
    connexion.addCom(song.idPlage, function(err) {
        if (!err) {
            player.comButton.innerText = parseInt(player.comButton.innerText) + 1;
        }
    });
};

Player.prototype.addView = function () {
    connexion.addViewNumber(song.idPlage, function (err) {
        if (!err) {
            player.viewDisplay.innerText = parseInt(player.viewDisplay.innerText) + 1;
        }
    });
};
// alert ('<iframe src="http://localhost:3000/lecteur/'+song.idPlage+'" width="100%" height="400px" frameborder="no" scrolling="no"></iframe>');