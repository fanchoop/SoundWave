let waveContainers = document.getElementsByClassName("waveform"); // on récupère toutes les containers des wavefrom à dessiner 
let peaks = data.data;
console.log(peaks);

for (let i = 0; i < waveContainers.length; i++) {
    drawWaveform(waveContainers[i], peaks, 4, 0.5);
    
}


/**
 * Déssine un svg représentant une forme d'onde
 * @param {Element} parent l'élément dans lequel doit être dessinée le SVG
 * @param {Array} waveformValue valeurs représentant la waveform
 * @param {int} peakWidth largeur de chaque pique
 * @param {int} offset espace entre 2 piques
 */
function drawWaveform(parent, waveformValue, peakWidth, offset) {
    let baselinePourcentage = 0.66; // défini la taille de la partie haute et du reflet de la waveform

    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    createGradient(svg);

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.classList.add("main")
    parent.appendChild(svg);

    let waveHeight = svg.getBoundingClientRect().height;
    let waveWidth = svg.getBoundingClientRect().width;

    let baseline = waveHeight * baselinePourcentage;

    let nbPeaks = Math.floor((waveWidth + 2 * offset)/(peakWidth + offset)); //nombre de pique présent sur le SVG
    // nombre de valeur par pique, chaque pique représentera une moyenne de nbValue valeurs
    // cette arrondi pose des problèmes
    let nbValue = Math.floor(waveformValue.length / nbPeaks);
    if (nbValue == 0) {
        nbValue = 1;
    }
    
    let peakX = 0;

    let maxValue = findMaxAbs(waveformValue); // recherche de la plus grand valeur possible elle servira de référence pour les autres

    let delimitationHeight = 3;


    for (let i = 0; i < waveformValue.length; i += nbValue) {
        //slice fait une copie du tableau compris entre les index fournis, 
        //si l'index de fin dépasse la fin du tableau alors slice s'arrete à la fin du tableau
        let value =  averageAbs(waveformValue.slice(i, i + nbValue));
        
        let peakHeight = waveHeight * (value/maxValue);
        let peakY = baseline - peakHeight * baselinePourcentage;

        let peak = document.createElementNS(svg.namespaceURI, "rect");
        peak.setAttribute("x", peakX);
        peak.setAttribute("y", peakY);
        peak.setAttribute("width", peakWidth);
        peak.setAttribute("height", peakHeight + delimitationHeight);
        peak.classList.add("peak");
        peak.onclick = onWaveClick;
        svg.appendChild(peak);

        peakX += offset + peakWidth;
    }

    let delimitation = document.createElementNS(svg.namespaceURI, "rect");
    delimitation.setAttribute("x", 0);
    delimitation.setAttribute("y", baseline);
    delimitation.setAttribute("width", waveWidth);
    delimitation.setAttribute("height", delimitationHeight);
    let rectStyle = "fill:#ffffff;";
    delimitation.setAttribute("style", rectStyle);

    svg.appendChild(delimitation);
}

function averageAbs(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++){
        sum += Math.abs(array[i]);
    }
    return sum / array.length;
}

function findMaxAbs(array) {
    let max = 0;
    for (let k = 0; k < array.length; k++) {
        if (max <= Math.abs(array[k])) {
            max = Math.abs(array[k]);
        }
    }
    return max;
}

function onWaveClick(e){

    let next = e.target.nextElementSibling;
    while (next != null) {
        next.classList.remove("passed");
        next = next.nextElementSibling;
    }
    
    let prev = e.target;
    while(prev != null) {
        prev.classList.add("passed");
        prev = prev.previousElementSibling;
    }
}

function createGradient(svg) {
    let def = document.createElementNS(svg.namespaceURI, "defs");
    let linearGradient = document.createElementNS(svg.namespaceURI, "linearGradient");
    linearGradient.setAttribute("id", "test");
    linearGradient.setAttribute("x1", "0%");
    linearGradient.setAttribute("y1", "0%");
    linearGradient.setAttribute("x2", "0%");
    linearGradient.setAttribute("y2", "66%");
    linearGradient.setAttribute("x3", "0%");
    linearGradient.setAttribute("y3", "100%");

    let stop1 = document.createElementNS(svg.namespaceURI, "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("style", "stop-color:#ffa90a;stop-opacity:1");
    linearGradient.appendChild(stop1);
    
    let stop2 = document.createElementNS(svg.namespaceURI, "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("style", "stop-color:#000000;stop-opacity:0");
    linearGradient.appendChild(stop2);
    
    let stop3 = document.createElementNS(svg.namespaceURI, "stop");
    stop3.setAttribute("offset", "100%");
    stop3.setAttribute("style", "stop-color:#939392;stop-opacity:1");
    linearGradient.appendChild(stop3);
    
    def.appendChild(linearGradient);

    svg.appendChild(def);
}




