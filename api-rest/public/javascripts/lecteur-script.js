//Cover
player.setCover();

// button controller
//pause
player.pauseButton.addEventListener("click", function() {
    soundManager.togglePause(song.smId);
});

//like
player.likeButton.addEventListener("click", function() {
    player.toggleLike();
});

//com
player.comButton.addEventListener("click", function() {
    player.addCom();
});

//partage



// gestion du son
player.volumeButton.addEventListener("click", function(e) {
    player.toggleSlider(e);
});

//waveform
player.createWaveform();

window.addEventListener("resize", function () {
    player.waveform.waveContainer.innerHTML = "";
    player.redraw();   
});

//gestion du temps
player.setMaxDuree(util.SecToMin(song.duree));


//augmantation du nombre de vue
player.addView();
