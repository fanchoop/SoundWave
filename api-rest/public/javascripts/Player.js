let Player = function () {
    this.pauseButton = document.querySelector(".play");
    this.volumeButton = document.querySelector(".volume");
    this.svg = document.querySelector("svg");
    this.sliderTimeout;
}

let player = new Player();

Player.prototype.createWaveform = function () {
    this.waveform = new Waveform(document.querySelector(".waveform"), 0.66, 7, 1, util.peaks);
    this.waveform.draw();
    this.appendOnClickListeners();
}

Player.prototype.appendOnClickListeners = function () {
    let firstRect = document.querySelector("svg > rect");
    while (firstRect != null) {
        firstRect.addEventListener("click", function(e){
            player.onWaveClick(e);
        }); 
        firstRect = firstRect.nextElementSibling;
    }   
}

Player.prototype.redraw = function () {
    this.waveform.draw();
    this.appendOnClickListeners();
}

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
}

Player.prototype.setSoundManagerPosition = function (rect) {
    let x = parseFloat(rect.getAttribute("x"));
    let currentTime = util.getTimeFromX(x);
    soundManager.setPosition(util.songId, currentTime * 1000);
}

/**
 * Gere le clic de l'utilisateur sur un rectangle de la waveform
 * @param {Event} e
 */
Player.prototype.onWaveClick = function (e) {
    let currentPeak = util.findCurrentPeak();
    //fait reculer la coloration
    this.setSoundManagerPosition(e.target);
    util.clearTimeouts(this.waveform.timeouts);
    this.waveform.timeouts = [];

    if (this.waveform.searchLeft(currentPeak, e.target)) {
        this.waveform.spreadChange(currentPeak, 0, 5,
            function (current) {
                util.removeClassSvg(current, "passed");
            },
            function (current) {
                return (current.previousElementSibling != e.target) ? current.previousElementSibling : null;
            }
        );
        //fait avancer la coloration
    } else {
        this.waveform.spreadChange(currentPeak, 0, 5,
            function (current) {
                util.addClassSvg(current, "passed");
            },
            function (current) {
                return (current.nextElementSibling != e.target.nextElementSibling) ? current.nextElementSibling : null;
            }
        );
        
    }
}

Player.prototype.setMaxDuree = function (duree) {
    document.querySelector('.total').innerText = duree;
}



Player.prototype.setDuree = function (duree) {
    document.querySelector(".en-cours").innerText = duree;
}

//affichage de la waveform



