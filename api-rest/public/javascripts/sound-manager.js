soundManager.url = '/javascripts/soundmanager/swf/';
soundManager.onready(function () {
    soundManager.createSound({
        id: song.smId,
        waitForWindowLoad: true,
        url: song.cheminMP3,
        onpause: function () {
            util.addClass(player.pauseButton, 'play');
            util.removeClass(player.pauseButton, 'pause');
        },
        onresume: function () {
            util.addClass(player.pauseButton, 'pause');
            util.removeClass(player.pauseButton, 'play');
        },
        onplay: function () {
            util.addClass(player.pauseButton, 'pause');
            util.removeClass(player.pauseButton, 'play');
            player.waveform.reset();
            player.waveform.selectFirstRect();
        },
        onfinish: function () {
            util.addClass(player.pauseButton, 'play');
            util.removeClass(player.pauseButton, 'pause');
            player.waveform.reset();
        },
        whileplaying: function () {
            let rect = player.waveform.searchRectFromX(util.getXFromTime(this.position));
            player.waveform.setCurrentPeak(rect);
            player.setDuree(util.SecToMin(Math.round(this.position / 1000)));
        }
    });
    soundManager.play(song.smId);
});