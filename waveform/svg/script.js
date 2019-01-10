let peaks = data.data;

let spaceBetweenPeaks = 0.25;
let peakOffset = 0;

let waveContainers = document.getElementsByClassName("waveform");

for (let i = 0; i < waveContainers.length; i++) {
    let container = waveContainers[i];

    let containerSpecs = container.getBoundingClientRect();

    let waveWidth = parseFloat(window.getComputedStyle(container, null).getPropertyValue("width"));
    let waveHeight = parseFloat(window.getComputedStyle(container, null).getPropertyValue("height"));

    let baseline = containerSpecs.height - containerSpecs.height * 0.5;

    let topPadding = parseFloat(window.getComputedStyle(container, null).getPropertyValue("padding-top"));
    let bottomPadding = parseFloat(window.getComputedStyle(container, null).getPropertyValue("padding-bottom"));

    let boxWidth = waveWidth / peaks.length;

    let topMaxHeight = baseline - topPadding;
    let bottomMaxHeight = waveHeight - baseline - bottomPadding;

    let maxValue = findMax(peaks);

    console.log("max value : " + maxValue);
    console.log("waveHeight : " + waveHeight);
    console.log("baseline : " + baseline);
    console.log("topMaxHeight : " + topMaxHeight);
    console.log("bottomMaxHeight : " + bottomMaxHeight);

    console.log(containerSpecs.top);

    for (let j = 0; j < peaks.length; j++) {
        // création de la box
        let topBox = document.createElement("div");
        let bottomBox = document.createElement("div");

        let boxSize = Math.abs(peaks[j] / maxValue) * topMaxHeight;
        let bottomSize = Math.abs(peaks[j] / maxValue) * bottomMaxHeight;
        // position
        topBox.style.position = "absolute";
        topBox.style.top = containerSpecs.top + baseline - boxSize + "px";
        topBox.style.left = containerSpecs.left + peakOffset + "px";

        bottomBox.style.position = "absolute";
        bottomBox.style.top = containerSpecs.top + baseline + "px";
        bottomBox.style.left = containerSpecs.left + peakOffset + "px";

        // taille
        topBox.style.width = boxWidth + "px";
        topBox.style.height = boxSize + "px";

        bottomBox.style.width = boxWidth + "px";
        bottomBox.style.height = bottomSize + "px";

        // css
        topBox.classList.add("box");
        bottomBox.classList.add("box");

        // ajout au parent
        console.log(bottomBox);
        container.appendChild(topBox);
        container.appendChild(bottomBox);

        // mise à jour des offset;
        peakOffset += boxWidth + spaceBetweenPeaks;
    }
}

function findMax(array) {
    let max = 0;
    for (let k = 0; k < array.length; k++) {
        if (max <= array[k]) {
            max = array[k];
        }
    }
    return max;
}
