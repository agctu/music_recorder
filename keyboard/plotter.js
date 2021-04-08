function isWhiteKey(keyId){
    return keyId%12%5%2==0;
}
//draw keys and notes
class Plotter{
    constructor(nWhiteKey,offset){
        this.width=window.innerWidth;
        this.height=window.innerHeight;
        this.offset=offset;
        this.notes=[];
        this.initKeys(nWhiteKey);
    }
    //keyDown and keyUp modify the state of the key and add note above keys
    keyDown(keyId){
        if(keyId<0||keyId>=this.keys.length)return;
    }
    keyUp(keyId){
        if(keyId<0||keyId>=this.keys.length)return;
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
    initKeys(nWhiteKey){
        var totalN=128
        this.keys=[];
        //add all keys no matter it is visible
        for(let i=0;i<totalN;++i){
            let key=document.createElement("td");
            this.keys.push(key);
        }
        //separate keys into two clusters
        this.wkeys=[];
        var wtb=document.createElement("table");
        wtb.append(document.createElement("tr"));
        this.bkeys=[];
        var btb=document.createElement("table");
        btb.append(document.createElement("tr"));
        for(let i=0;i<totalN;++i){
            if(isWhiteKey(i)){
                this.keys[i].style.width=this.width/nWhiteKey+"px";
                this.keys[i].style.height=this.height/2+"px";
                this.keys[i].style.background="#ffffff";
                this.keys[i].style.borderRadius="0px 0px 4px 4px";
                this.wkeys.push(this.keys[i]);
                wtb.firstElementChild.append(this.keys[i]);
            }
            else{//key is black
                this.bkeys.push(this.keys[i]);
                btb.firstElementChild.append(this.keys[i]);
            }
        }
        //add tables to document, and set their positions
        wtb.style.position="absolute";
        wtb.style.top=this.height/2+"px";
        document.body.append(wtb);
    }
}
