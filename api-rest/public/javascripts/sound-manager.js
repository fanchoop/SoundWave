soundManager.url = '/javascripts/soundmanager/swf/';
soundManager.onready(function() {
    soundManager.createSound({
        id: song.smId,
        url: song.cheminMP3,
        onpause: function () {
            util.addClass(player.pauseButton ,'play');
            util.removeClass(player.pauseButton,'pause');
        },
        onresume: function() {
            util.addClass(player.pauseButton ,'pause');
            util.removeClass(player.pauseButton,'play');
        },
        onplay: function() {
            util.addClass(player.pauseButton ,'pause');
            util.removeClass(player.pauseButton,'play');
            player.waveform.reset();

        },
        onfinish: function() {
            util.addClass(player.pauseButton ,'play');
            util.removeClass(player.pauseButton,'pause');
            player.waveform.reset();
        },
        whileplaying: function() {
            let rect = util.searchRect(util.getXFromTime(this.position));
            util.addClassSvg(rect, "passed");
            player.setDuree(util.SecToMin(Math.round(this.position/1000)));
        }
    });
    soundManager.play(song.smId);
});