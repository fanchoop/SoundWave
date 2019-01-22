let waveContainers = document.getElementsByClassName("waveform"); // on récupère toutes les containers des wavefrom à dessiner
let baselinePourcentage = 0.66; // défini la taille de la partie haute et du reflet de la waveform
let peakWeight = 7;
let peakOffset = 1;

let timeouts = [];

window.addEventListener("resize", function () {
    for (let i = 0; i < waveContainers.length; i++) {
        waveContainers[i].innerHTML = "";
        drawWaveform(waveContainers[i], peaks, peakWeight, peakOffset);
    }
});
for (let i = 0; i < waveContainers.length; i++) {
    drawWaveform(waveContainers[i], peaks, peakWeight, peakOffset);
}

/**
 * Déssine un svg représentant une forme d'onde
 * @param {Element} parent l'élément dans lequel doit être dessinée le SVG
 * @param {Array} waveformValue valeurs représentant la waveform
 * @param {int} peakWidth largeur de chaque pique
 * @param {int} offset espace entre 2 piques
 */
function drawWaveform(parent, waveformValue, peakWidth, offset) {

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    createGradients(svg);

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    addClass(svg, "main");
    parent.appendChild(svg);

    let waveHeight = svg.getBoundingClientRect().height;
    let waveWidth = svg.getBoundingClientRect().width;

    let baseline = waveHeight * baselinePourcentage;

    let nbPeaks = Math.floor((waveWidth + 2 * offset) / (peakWidth + offset)); //nombre de pique présent sur le SVG
    // nombre de valeur par pique, chaque pique représentera une moyenne de nbValue valeurs
    // cette arrondi pose des problèmes
    let nbValue = Math.floor(waveformValue.length / nbPeaks);
    if (nbValue == 0) {
        nbValue = 1;
    }

    let maxValue = findMaxAbs(waveformValue); // recherche de la plus grand valeur possible elle servira de référence pour les autres

    let delimitationHeight = 3;

    let peakX = 0;
    let i = 0;

    while (i < waveformValue.length && peakX + offset + peakWidth <= waveWidth) {
        //slice fait une copie du tableau compris entre les index fournis,
        //si l'index de fin dépasse la fin du tableau alors slice s'arrete à la fin du tableau
        let value = averageAbs(waveformValue.slice(i, i + nbValue));

        let peakHeight = waveHeight * (value / maxValue);
        let peakY = baseline - peakHeight * baselinePourcentage;

        let peak = document.createElementNS(svg.namespaceURI, "rect");
        peak.setAttribute("x", peakX);
        peak.setAttribute("y", peakY);
        peak.setAttribute("rx", Math.floor(peakWeight / 3));
        peak.setAttribute("width", peakWidth);
        peak.setAttribute("height", peakHeight + delimitationHeight);
        let peakStyle = "stroke-width:" + offset / 2 + ";";
        peakStyle += "stroke:#fff;";
        peak.setAttribute("style", peakStyle);
        addClass(peak, "peak");

        peak.addEventListener("click", onWaveClick);
        svg.appendChild(peak);

        peakX += offset + peakWidth;
        i += nbValue;
    }

    let delimitation = document.createElementNS(svg.namespaceURI, "rect");
    delimitation.setAttribute("y", baseline - delimitationHeight / 2);
    delimitation.setAttribute("width", waveWidth);
    delimitation.setAttribute("height", delimitationHeight);
    delimitation.setAttribute("style", "fill:#000");
    // svg.appendChild(delimitation);
}

/**
 * calcule la moyenne des valeur absolue d'un tableau
 * @param {Array} array tableau dont la moyenne est calculé
 */
function averageAbs(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += Math.abs(array[i]);
    }
    return sum / array.length;
}

/**
 * return la valeur absolue maximale d'un tableau donnée
 * @param {Array} array tableau dont la valeur max est extrait
 */
function findMaxAbs(array) {
    let max = 0;
    for (let k = 0; k < array.length; k++) {
        if (max <= Math.abs(array[k])) {
            max = Math.abs(array[k]);
        }
    }
    return max;
}

/**
 * Gere le clic de l'utilisateur sur un rectangle de la waveform
 * @param {Event} e
 */
function onWaveClick(e) {
    let currentPeak = findCurrentPeak();
    if (!currentPeak) {
        //selectionne le premier rect du svg
        currentPeak = document.querySelector("svg > rect");
    }
    //fait reculer la coloration

    if (searchLeft(currentPeak, e.target)) {
        clearTimeouts(timeouts);
        timeouts = [];
        spreadChange(currentPeak, 0, 5,
            function (current) {
                removeClass(current, "passed");
            },
            function (current) {
                return (current.previousElementSibling != e.target) ? current.previousElementSibling : null;
            }
        );
        //fait avancer la coloration
    } else {
        clearTimeouts(timeouts);
        timeouts = [];
        spreadChange(currentPeak, 0, 5,
            function (current) {
                addClass(current, "passed");
            },
            function (current) {
                return (current.nextElementSibling != e.target.nextElementSibling) ? current.nextElementSibling : null;
            }
        );
        
    }
    
}

/**
 * delete every timeout in then arrau
 * @param {Array} timeoutsIds array containing timeouts ids
 */
function clearTimeouts(timeoutsIds) {
    for (let i = 0; i < timeoutsIds.length; i ++) {
        clearTimeout(timeoutsIds[i]);
    }
}

/**
 * renvoie le dernier peak possedant la classe CSS "passed". 
 * Il est considéré comme le dernier élément "actif"
 * @return {Element} le pique en question
 */
function findCurrentPeak() {
    let arr = document.querySelectorAll("rect.passed");
    return arr[arr.length - 1];
}

/**
 * cherche un élément dans les frères ainés (previousElementSiblings) d'un autre élément
 * @param {Element} current l'Element à partir duquel on doit commencer la recherche
 * @param {Element} searched l'Element cherché
 * @return {bool} vrai si l'élément à été trouvé faux sinon
 */
function searchLeft(current, searched) {
    while (current.previousElementSibling != null) {
        if (current.previousElementSibling == searched) {
            return true;
        }
        current = current.previousElementSibling;
    }
    return false;
}

/**
 * 
 * @param {Element} current l'élement par le quel commencer
 * @param {int} time le temps initiale avant l'enclenchement de l'animation
 * @param {int} timeout le temps entre chaque animation
 * @param {function(Element)} callback logique à appliquer à un élément 
 * @param {function(Element): Element} nextCallback logique pour determiner la validité de l'élément suivant, doit retourner l'élément suivant
 */
function spreadChange(current, time, timeout, callback, nextCallback) {
    timeouts.push(setTimeout(function () {
        callback(current);
    }, time));
    time += timeout;
    let nextElem = nextCallback(current);
    if (nextElem) {
        spreadChange(nextElem, time, timeout, callback, nextCallback);
    }
}

/**
 * créer les gradient nécessaire avec la beauté du waveform
 * Note : créé un élément def et le rajoute au svg
 * @param {Element} svg l'élément auquel les gradients seront rattachés 
 */
function createGradients(svg) {
    let def = document.createElementNS(svg.namespaceURI, "defs");
    let baseGradient = document.createElementNS(svg.namespaceURI, "linearGradient");
    baseGradient.setAttribute("id", "base");
    baseGradient.setAttribute("x1", "0%");
    baseGradient.setAttribute("y1", "100%");
    baseGradient.setAttribute("x2", "0%");
    baseGradient.setAttribute("y2", "0%");

    let pourcent = (1 - baselinePourcentage) * 100;

    let stops = [{
        offset: "0%",
        style: "stop-color:rgb(150,150,150);stop-opacity:1"
    }, {
        offset: pourcent + "%",
        style: "stop-color:rgb(0,0,0);stop-opacity:0.8"
    }, {
        offset: "70%",
        style: "stop-color:#ffc04a;stop-opacity:1"
    }];

    for (let i = 0; i < stops.length; i++) {
        let stop = document.createElementNS(svg.namespaceURI, "stop");
        stop.setAttribute("offset", stops[i]["offset"]);
        stop.setAttribute("style", stops[i]["style"]);
        baseGradient.appendChild(stop);
    }

    let activeGradient = document.createElementNS(svg.namespaceURI, "linearGradient");
    activeGradient.setAttribute("id", "active");
    activeGradient.setAttribute("x1", "0%");
    activeGradient.setAttribute("y1", "100%");
    activeGradient.setAttribute("x2", "0%");
    activeGradient.setAttribute("y2", "0%");

    let stopsActive = [{
        offset: "0%",
        style: "stop-color:rgb(150,150,150);stop-opacity:1"
    }, {
        offset: pourcent + "%",
        style: "stop-color:rgb(0,0,0);stop-opacity:0.8"
    }, {
        offset: "70%",
        style: "stop-color:#FF7D03;stop-opacity:1"
    }];

    for (let i = 0; i < stopsActive.length; i++) {
        let stop = document.createElementNS(svg.namespaceURI, "stop");
        stop.setAttribute("offset", stopsActive[i]["offset"]);
        stop.setAttribute("style", stopsActive[i]["style"]);
        activeGradient.appendChild(stop);
    }

    def.appendChild(baseGradient);
    def.appendChild(activeGradient);

    svg.appendChild(def);
}

/**
 * Add a class to a DOM element
 * @param {Element} target element that the class will be added
 * @param {String} name the name of the class
 */
function addClass(target, name) {
    if (target.className.baseVal.indexOf(name) == -1) {
        target.className.baseVal += " " + name;
    }
}


/**
 * remove a class from a DOM element
 * @param {Element} target element from whitch the class will be removed
 * @param {String} name the of tha class
 */
function removeClass(target, name) {
    target.className.baseVal = target.className.baseVal.replace(name, "");
}