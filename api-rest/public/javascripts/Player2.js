function Player(idMusicToLoad = null) {
    //let soundManager;
    function $_GET(param) {
        var vars = {};
        window.location.href.replace( location.hash, '' ).replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function( m, key, value ) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );
        if ( param ) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }
    let idmusic = $_GET('morceau');
    let constructor = function () {
        this.currentTime = 0;
        this.volume = 50;
        this.playlist = new Playlist();
        this.sound = null;
        this.idMusicToLoad = idmusic;

        /** Finish the "construction" of the manager */
        this.setListener();
        //Use to apply the right color to the background of the input
        let evt = new Event("input");
        document.querySelector(".audioplayer .controls .volume input[type=range].volume-input-range").dispatchEvent(evt);

        //Check if a musicId exist, if is do, load and add the music to the playlist
        if (this.idMusicToLoad !== undefined && this.idMusicToLoad != null) {
            Connexion.getMusiqueById(this.idMusicToLoad, function (music) {
                this.addMusic(new Music(JSON.parse(music)));
            }.bind(this));
        }

    }.bind(this);

    this.str_pad_left = function(string,pad,length) {
        return (new Array(length+1).join(pad)+string).slice(-length);
    };
    this.tempsEnSeconde = function(duree){
        let minutes = Math.floor(duree / 60);
        let seconds = duree - minutes * 60;
        return minutes + ":" + this.str_pad_left(seconds,'0',2);
    };

    this.displayInfo = function () {
        console.log("IXI");
        let currentMusic = newMusique;//this.Playlist.getMusiqueCourante();
         if (currentMusic != null) {
             document.querySelector(".audioplayer .visuel").style.background = "url(" + currentMusic.cheminPochette + ")";
             document.querySelector(".audioplayer .artiste").innerText = currentMusic.nomAuteur;
             document.querySelector(".audioplayer .titre").innerText = currentMusic.titre;
             document.querySelector(".audioplayer .total").innerText = this.tempsEnSeconde(currentMusic.duree);
             document.querySelector(".audioplayer .nb-lectures").innerText = currentMusic.nbEcoute;
             document.querySelector(".audioplayer .nb-commentaires").innerText = currentMusic.nbCommentaire;
             document.querySelector(".audioplayer .like").innerText = currentMusic.nbJaime;
         }
    };

    this.repaint = function () {
        this.displayInfo();
    };

    this.setListener = function () {

        window.addEventListener("resize", this.drawSpectrum.bind(this));

        document.querySelector(".audioplayer .prev").addEventListener("click", this.previous.bind(this));
        document.querySelector(".audioplayer .next").addEventListener("click", this.next.bind(this));
        document.querySelector(".audioplayer .play-pause").addEventListener("click", this.play_pause.bind(this));
        document.querySelector(".audioplayer .like").addEventListener("click", this.like.bind(this));
        document.querySelector(".audioplayer .share").addEventListener("click", this.share.bind(this));
        document.querySelector(".audioplayer .controls .volume input[type=range].volume-input-range").addEventListener("input", this.targetVolume.bind(this));

        //Applied a different listener in case of mobile version
        if (window.mobileAndTabletCheck() || PlayerUtils.detectCompactSize()) {
            document.querySelector(".audioplayer .controls .volume .volume_button").addEventListener("click", this.volumeMouseOverCompact.bind(this));
            document.querySelector(".audioplayer .controls .volume .volume_button").addEventListener("click", this.volumeMouseOutCompact.bind(this));
        }/* else {
            document.querySelector(".audioplayer .controls .volume .volume_button").addEventListener("click", this.mute.bind(this));
            document.querySelector(".audioplayer .controls .volume").addEventListener("mouseover", this.volumeMouseOver.bind(this));
            document.querySelector(".audioplayer .controls .volume").addEventListener("mouseout", this.volumeMouseOut.bind(this));
        }*/
    };

    this.volumeMouseOver = function () {
        document.querySelector(".audioplayer .controls .volume").classList.add('is-active');
    };


    this.targetVolume = function (e) {
        //The target should be the volume bar
        let min = e.target.min,
            max = e.target.max,
            val = e.target.value;

        let value = (val - min) * 100 / (max - min);
        e.target.style.backgroundSize = value + '% 100%';

        if (this.sound != null) {
            this.setVolume(value);
        }
    };
    this.drawMusicTime = function () {
        if (this.sound != null) {

            let currentTime = document.querySelector(".audioplayer .en-cours");
            if (!currentTime.classList.contains("spectrumHoverTime"))
                currentTime.innerText = this.tempsEnSeconde(this.sound.position);
        }
    };

    this.addMusic = function (music) {
        let firstMusic = this.playlist.getMusiqueCourante() == null;

        this.playlist.addMusic(music);
        if (firstMusic) {
            let currentMusic = this.playlist.getMusiqueCourante();
            this.sound = soundManager.createSound({
                id: currentMusic['title'] + "-" + currentMusic['artistName'], // Id arbitraire : piste0, piste1, etc.
                url: currentMusic['musicPath'],
                whileplaying: this.drawMusicTime.bind(this),
                volume: this.volume,
                onfinish: this.next.bind(this)
            });
            this.sound.play();
            this.sound.pause();
            this.repaint();
        } else {
            //Other case, add the visibility of the "previous" and "next" buttons and put the "volume" button at the right place
            document.querySelector(".audioplayer .controls .prev").style.visibility = "visible";
            document.querySelector(".audioplayer .controls .next").style.visibility = "visible";
            document.querySelector(".audioplayer .controls .volume").style.marginLeft = "0px";
        }
    };
    this.addPlaylist = function(idPlaylistToAdd){

        Connexion.getPlaylistById(idPlaylistToAdd,function(newPlaylist){
            if(newPlaylist !== "[]"){
                this.playlist = new Playlist();
                newPlaylist = JSON.parse(newPlaylist);
                for (let position in newPlaylist){
                    this.addMusic(new Music(newPlaylist[position]));
                }
            }

        }.bind(this));

    };

    constructor();

}