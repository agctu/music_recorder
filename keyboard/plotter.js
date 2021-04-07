//draw keys and notes
class Plotter{
    constructor(nWhiteKey,offset){
        this.width=window.innerWidth;
        this.height=window.innerHeight;
        this.nWhiteKey=nWhiteKey;
        this.offset=offset;
        this.notes=[];
        initKeys();
    }
    //keyDown and keyUp modify the state of the key and add note above keys
    keyDown(keyId){
    }
    keyUp(keyId){
    }

    draw(){
        //draw black keys

        //draw white keys

    }
    startDraw(){
        let tar=this;
        tar.draw();
        //FIXME how to stop this, because every anonymous function is different.
        requestAnimationFrame(function(){tar.startDraw();});
    }
    initKeys(){
    }
}
