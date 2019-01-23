// pause controller
player.pauseButton.addEventListener("click", function(e) {
    soundManager.togglePause(util.songId);
});

// gestion du son
player.volumeButton.addEventListener("click", function(e) {
    player.toggleSlider(e)
});

//waveform
player.createWaveform();

window.addEventListener("resize", function () {
    player.waveform.waveContainer.innerHTML = "";
    player.redraw()
    let song = soundManager.getSoundById(util.songId)
    player.waveform.colorUntilX(util.getXFromTime(song.position, util.duree))
});

//gestion du temps
player.setMaxDuree(util.SecToMin(util.duree));
