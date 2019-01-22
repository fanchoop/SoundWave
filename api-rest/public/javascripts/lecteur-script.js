
// pause controller
let pauseButton = document.querySelector(".play");
pauseButton.addEventListener("click", function(e) {
    soundManager.togglePause(smKey);
});


// gestion du son
let soundButton = document.querySelector(".volume");
soundButton.addEventListener("click", function(e) {

    let slider = document.createElement("input");
    slider.setAttribute("type", "range");
    slider.setAttribute("min", 0);
    slider.setAttribute("max", 100);
    slider.setAttribute("class", "slider")
    e.currentTarget.parentElement.appendChild(slider);
    

});