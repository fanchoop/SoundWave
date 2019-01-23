//Cover
player.setCover();

// button controller
//pause
player.pauseButton.addEventListener("click", function(e) {
    soundManager.togglePause(song.smId);
});

//like
player.likeButton.addEventListener("click", function(e) {
    player.toggleLike();
});

//com
player.comButton.addEventListener("click", function(e) {
    player.addCom();
});

//partage



// gestion du son
player.volumeButton.addEventListener("click", function(e) {
    player.toggleSlider(e)
});

//waveform
player.createWaveform();

window.addEventListener("resize", function () {
    player.waveform.waveContainer.innerHTML = "";
    player.redraw()
    let smSong = soundManager.getSoundById(song.smId)
    player.waveform.colorUntilX(util.getXFromTime(smSong.position, song.duree))
});

//gestion du temps
player.setMaxDuree(util.SecToMin(song.duree));


//augmantation du nombre de vue
player.addView();
