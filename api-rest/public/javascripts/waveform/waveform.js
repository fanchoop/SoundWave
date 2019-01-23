let Waveform = function(container, baseline, peakWidth, peakOffset, peaks) {
    this.waveContainer = container;
    this.baselinePourcentage = baseline;
    this.peakWidth = peakWidth;
    this.peakOffset = peakOffset;
    this.peaks = peaks;
    this.timeouts = [];
}


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

    let nbRect = Math.floor((waveWidth + 2 * this.peakOffset) / (this.peakWidth + this.peakOffset)); //nombre de pique présent sur le SVG
    // nombre de valeur par pique, chaque pique représentera une moyenne de nbValue valeurs
    // cette arrondi pose des problèmes
    let nbValue = Math.floor(this.peaks.length / nbRect);
    if (nbValue == 0) {
        nbValue = 1;
    }

    let maxValue = util.findMaxAbs(this.peaks); // recherche de la plus grand valeur possible elle servira de référence pour les autres

    let delimitationHeight = 6;

    let peakX = 0;
    let i = 0;

    while (i < this.peaks.length && peakX + this.peakOffset + this.peakWidth <= waveWidth) {
        //slice fait une copie du tableau compris entre les index fournis,
        //si l'index de fin dépasse la fin du tableau alors slice s'arrete à la fin du tableau
        let value = util.averageAbs(this.peaks.slice(i, i + nbValue));

        let peakHeight = waveHeight * (value / maxValue);
        let peakY = baseline - peakHeight * this.baselinePourcentage;

        let peakStyle = "stroke-width:" + this.peakOffset / 2 + ";";
        peakStyle += "stroke:#000;";
        peakStyle += "stroke-opacity:0;";

        let round = Math.floor(this.peakWidth / 3);
        
        let peak = util.createRectSvg(peakX, peakY, round, round, this.peakWidth, peakHeight + (delimitationHeight /2), peakStyle)
        util.addClassSvg(peak, "peak");
        svg.appendChild(peak);

        peakX += this.peakOffset + this.peakWidth;
        i += nbValue;
    }

    let delimitation = util.createRectSvg(0, baseline - delimitationHeight / 2, 0, 0, waveWidth, delimitationHeight, "fill:#fff");
    svg.appendChild(delimitation);
}

Waveform.prototype.redraw = function () {
    waveContainer.innerHTML = "";
    this.draw();
}

Waveform.prototype.reset = function() {
    let lastPassedRect = util.findCurrentPeak();
    while (lastPassedRect != null) {
        util.removeClassSvg(lastPassedRect, "passed");
        lastPassedRect = lastPassedRect.previousElementSibling;
    }
}

Waveform.prototype.colorUntilX = function (x) {
    let current = util.findCurrentPeak();
    while (current.getAttribute("x") <= x) {
        util.addClassSvg(current, "passed");
        current = current.nextElementSibling;
    }
}

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
}

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
    }, time));
    time += timeout;
    let nextElem = nextCallback(current);
    if (nextElem) {
        this.spreadChange(nextElem, time, timeout, callback, nextCallback);
    }
}

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
        style: "stop-color:#bbb;stop-opacity:1"
    },{
        offset: this.baselinePourcentage*100+ "%",
        style: "stop-color:#888;stop-opacity:1"
    },{
        offset: this.baselinePourcentage*100 + 1 + "%",
        style: "stop-color:#666;stop-opacity:1"
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
        offset: "30%",
        style: "stop-color:#FF7D03;stop-opacity:1"
    }, {
        offset: this.baselinePourcentage*100 + "%",
        style: "stop-color:#000;stop-opacity:0.8"
    }, {
        offset: "80%",
        style: "stop-color:rgb(150,150,150);stop-opacity:1"
    }];

    for (let i = 0; i < stopsActive.length; i++) {
        let stop = document.createElementNS(util.svgURI, "stop");
        stop.setAttribute("offset", stopsActive[i]["offset"]);
        stop.setAttribute("style", stopsActive[i]["style"]);
        activeGradient.appendChild(stop);
    }

    def.appendChild(baseGradient);
    def.appendChild(activeGradient);

    svg.appendChild(def);
}