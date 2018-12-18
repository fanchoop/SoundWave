class Player extends SMSound {

    constructor() {
        super();
        this.curTime = 0;
        this.volume = 100;
        this.playlist = new Playlist();
        this.music = null;
    }
}
let soundManagerUrl = 'SoundManager/swf/';

//let music = getMusicByName(); //TODO à faire coller avec l'API




