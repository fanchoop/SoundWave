let sliderTimeout;


// pause controller
let pauseButton = document.querySelector(".play");
pauseButton.addEventListener("click", function(e) {
    soundManager.togglePause(smKey);
});

// gestion du son
let soundButton = document.querySelector(".volume");
soundButton.addEventListener("click", function(e) {
    let slider = document.querySelector(".slider"); 
    if (!slider) {
        slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.setAttribute("min", 0);
        slider.setAttribute("max", 100);
        slider.setAttribute("class", "slider");
        slider.value = soundButton.getAttribute("data-value");

        slider.addEventListener("mouseout", function(e) {
            sliderTimeout = setTimeout(function() {
                e.target.parentElement.removeChild(slider);
            }, 1000);
        });
        
        slider.addEventListener("mouseenter", function(e) {
            if (sliderTimeout) {
                clearTimeout(sliderTimeout);
            }
        });
        
        slider.addEventListener("change", function(e){
            soundButton.setAttribute("data-value", e.target.value);
            soundManager.setVolume(e.target.value);
        });

        e.currentTarget.parentElement.appendChild(slider);
    } else {
        e.currentTarget.parentElement.removeChild(slider);
        clearTimeout(sliderTimeout);
    }
});


//gestion du temps

