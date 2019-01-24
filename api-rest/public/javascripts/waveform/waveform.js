let Waveform = function (container, baseline, peakWidth, peakOffset, peaks) {
    this.waveContainer = container;
    this.baselinePourcentage = baseline;
    this.peakWidth = peakWidth;
    this.peakOffset = peakOffset;
    this.peaks = peaks;
    this.currentPeak;
    this.targetPeak;
    this.targetHover;
    this.moveSpeed = 5;
    this.moving = false;
};


Waveform.prototype.selectFirstRect = function () {
    this.currentPeak = document.querySelector('svg > rect');
};

Waveform.prototype.setCurrentPeak = function (rect) {
    this.targetPeak = rect;
    util.addClassSvg(this.currentPeak, "passed");
    
    if (this.currentPeak != this.targetPeak && !this.moving) {
        this.move(this.targetPeak);
    }
};

Waveform.prototype.move = function () {
    if (this.currentPeak != null && this.targetPeak != null) {
        this.moving = true;
        if (this.searchLeft(this.currentPeak, this.targetPeak)) {
            //target à gauche
            util.removeClassSvg(this.currentPeak, "passed");
            this.currentPeak = this.currentPeak.previousElementSibling;
        } else {
            //target à droite
            this.currentPeak = this.currentPeak.nextElementSibling;
            util.addClassSvg(this.currentPeak, "passed");
            util.removeClassSvg(this.currentPeak, "hover");
        }
        if (this.currentPeak != this.targetPeak) {
            setTimeout(function() {
                this.move();
            }.bind(this), this.moveSpeed);
        } else {
            this.moving = false;
        }
    } else {
        this.moving = false;
    }
};

Waveform.prototype.moveHover = function (target) {
    this.targetHover = target;
    let current = this.currentPeak;
    console.log("hover");
    if (this.searchLeft(current, target)){
        // target à gauche
        while (target != current) {
            util.addClassSvg(current, "hover");
            current = current.previousElementSibling;
        } 
    } else {
        //target à droite
        while (current != target) {
            current = current.nextElementSibling;
            util.addClassSvg(current, "hover");
        } 

    }
}

Waveform.prototype.clearHover = function () {
    let rects = document.querySelectorAll("svg > rect.peak");
    for (let i = 0; i < rects.length; i++) {
        util.removeClassSvg(rects[i], "hover");
    }
    this.targetHover = null;
}

Waveform.prototype.clearMoveTimeout = function () {
    clearTimeout(this.moveTimeout);
};

Waveform.prototype.searchRectFromX = function (x) {
    let rects = document.querySelectorAll("svg > .peak");
    for (let i = 0; i < rects.length; i++) {
        let curX = parseInt(rects[i].getAttribute("x"));
        if (curX >= x && curX < (x + this.peakWidth)) {
            return rects[i];
        }
    }
};

/**
 * Déssine un svg représentant une forme d'onde
 */
Waveform.prototype.draw = function () {
    let svg = document.createElementNS(util.svgURI, "svg");
    this.createGradients(svg);

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    util.addClassSvg(svg, "main");
    this.waveContainer.appendChild(svg);

    let waveHeight = svg.getBoundingClientRect().height;
    let waveWidth = svg.getBoundingClientRect().width;

    let baseline = waveHeight * this.baselinePourcentage;
    /*
    nombre de pique présent sur le SVG 
    nombre de valeur par pique, chaque pique représentera une moyenne de nbValue valeurs
    cette arrondi pose des problèmes
    */
    let nbRect = Math.floor((waveWidth + 2 * this.peakOffset) / (this.peakWidth + this.peakOffset));
    let nbValue = Math.floor(this.peaks.length / nbRect);
    let nbReste = 0;
    if (nbValue == 0) {
        nbValue = 1;
    } else {
        nbReste = this.peaks.length % nbRect;
    }
    /*
    recherche de la plus grand valeur possible elle servira de référence pour les autres
    */
    let maxValue = util.findMaxAbs(this.peaks);
    let delimitationHeight = 3;

    let peakX = 0;
    let i = 0;

    while (i < this.peaks.length && peakX + this.peakOffset + this.peakWidth <= waveWidth) {
        /*
        slice fait une copie du tableau compris entre les index fournis,
        si l'index de fin dépasse la fin du tableau alors slice s'arrete à la fin du tableau
        */
        let value;
        if (i <= nbReste) {
            value = util.averageAbs(this.peaks.slice(i, i + nbValue + 1));
            i += nbValue + 1;
        } else {
            value = util.averageAbs(this.peaks.slice(i, i + nbValue));
            i += nbValue;
        }

        let peakHeight = waveHeight * (value / maxValue);
        let peakY = baseline - peakHeight * this.baselinePourcentage;

        let peakStyle = "stroke-width:" + this.peakOffset / 2 + ";";
        peakStyle += "stroke:#000;";
        peakStyle += "stroke-opacity:0;";

        let round = Math.floor(this.peakWidth / 3);

        let peak = util.createRectSvg(peakX, peakY, round, round, this.peakWidth, peakHeight + (delimitationHeight / 2), peakStyle)
        util.addClassSvg(peak, "peak");
        svg.appendChild(peak);

        peakX += this.peakOffset + this.peakWidth;
        
    }

    let delimitation = util.createRectSvg(0, baseline - delimitationHeight / 2, 0, 0, waveWidth, delimitationHeight, "fill:#fff");
    svg.appendChild(delimitation);

    this.selectFirstRect();
};

Waveform.prototype.redraw = function () {
    waveContainer.innerHTML = "";
    this.draw();
};

Waveform.prototype.reset = function () {
    while (this.currentPeak != null) {
        util.removeClassSvg(this.currentPeak, "passed");
        this.currentPeak = this.currentPeak.previousElementSibling;
    }
    this.selectFirstRect();
};

Waveform.prototype.colorUntilX = function (x) {
    while (this.currentPeak.getAttribute("x") <= x) {
        util.addClassSvg(this.currentPeak, "passed");
        this.currentPeak = this.currentPeak.nextElementSibling;
    }
};

/**
 * cherche un élément dans les frères ainés (previousElementSiblings) d'un autre élément
 * @param {Element} current l'Element à partir duquel on doit commencer la recherche
 * @param {Element} searched l'Element cherché
 * @return {bool} vrai si l'élément à été trouvé faux sinon
 */
Waveform.prototype.searchLeft = function (current, searched) {
    while (current.previousElementSibling != null) {
        if (current.previousElementSibling == searched) {
            return true;
        }
        current = current.previousElementSibling;
    }
    return false;
};

/**
 * @param {Element} current l'élement par le quel commencer
 * @param {int} time le temps initiale avant l'enclenchement de l'animation
 * @param {int} timeout le temps entre chaque animation
 * @param {function(Element)} callback logique à appliquer à un élément
 * @param {function(Element): Element} nextCallback logique pour determiner la validité de l'élément suivant, doit retourner l'élément suivant
 */
Waveform.prototype.spreadChange = function (current, time, timeout, callback, nextCallback) {
    this.timeouts.push(setTimeout(function () {
        callback(current);
        time += timeout;
        let nextElem = nextCallback(current);
        if (nextElem) {
            this.spreadChange(nextElem, time, timeout, callback, nextCallback);
        }
    }, time));
};

/**
 * créer les gradient nécessaire avec la beauté du waveform
 * Note : créé un élément def et le rajoute au svg
 * @param {Element} svg l'élément auquel les gradients seront rattachés
 */
Waveform.prototype.createGradients = function (svg) {
    let def = document.createElementNS(util.svgURI, "defs");
    let baseGradient = document.createElementNS(util.svgURI, "linearGradient");
    baseGradient.setAttribute("id", "base");
    baseGradient.setAttribute("x1", "0%");
    baseGradient.setAttribute("y1", "0%");
    baseGradient.setAttribute("x2", "0%");
    baseGradient.setAttribute("y2", "100%");

    let stops = [{
        offset: "30%",
        style: "stop-color:#888;stop-opacity:1"
    }, {
        offset: this.baselinePourcentage * 100 + "%",
        style: "stop-color:#555;stop-opacity:1"
    }, {
        offset: this.baselinePourcentage * 100 + "%",
        style: "stop-color:#bbb;stop-opacity:1"
    }];

    for (let i = 0; i < stops.length; i++) {
        let stop = document.createElementNS(util.svgURI, "stop");
        stop.setAttribute("offset", stops[i]["offset"]);
        stop.setAttribute("style", stops[i]["style"]);
        baseGradient.appendChild(stop);
    }

    let activeGradient = document.createElementNS(util.svgURI, "linearGradient");
    activeGradient.setAttribute("id", "active");
    activeGradient.setAttribute("x1", "0%");
    activeGradient.setAttribute("y1", "0%");
    activeGradient.setAttribute("x2", "0%");
    activeGradient.setAttribute("y2", "100%");

    let stopsActive = [{
        offset: "20%",
        style: "stop-color:#ff9400;stop-opacity:1"
    }, {
        offset: this.baselinePourcentage * 100 + "%",
        style: "stop-color:#ff7700;stop-opacity:1"
    }, {
        offset: this.baselinePourcentage * 100 + "%",
        style: "stop-color:#ffbd91;stop-opacity:1"
    }];

    for (let i = 0; i < stopsActive.length; i++) {
        let stop = document.createElementNS(util.svgURI, "stop");
        stop.setAttribute("offset", stopsActive[i]["offset"]);
        stop.setAttribute("style", stopsActive[i]["style"]);
        activeGradient.appendChild(stop);
    }


    let hoverGradient = document.createElementNS(util.svgURI, "linearGradient");
    hoverGradient.setAttribute("id", "hover");
    hoverGradient.setAttribute("x1", "0%");
    hoverGradient.setAttribute("y1", "0%");
    hoverGradient.setAttribute("x2", "0%");
    hoverGradient.setAttribute("y2", "100%");

    let stopsHover = [{
        offset: "20%",
        style: "stop-color:#000;stop-opacity:1"
    }, {
        offset: this.baselinePourcentage * 100 + "%",
        style: "stop-color:#000;stop-opacity:1"
    }, {
        offset: this.baselinePourcentage * 100 + "%",
        style: "stop-color:#000;stop-opacity:1"
    }];

    for (let i = 0; i < stopsHover.length; i++) {
        let stop = document.createElementNS(util.svgURI, "stop");
        stop.setAttribute("offset", stopsHover[i]["offset"]);
        stop.setAttribute("style", stopsHover[i]["style"]);
        hoverGradient.appendChild(stop);
    }

    def.appendChild(baseGradient);
    def.appendChild(activeGradient);
    def.appendChild(hoverGradient);

    svg.appendChild(def);
};