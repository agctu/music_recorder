function isWhiteKey(keyId){
    var t=keyId%12;
    t-=t>4;
    return t%2==0;
}
//draw keys and notes
class Plotter{
    blackKeyOffset=[0.5,1.8,3.5,4.7,5.8];
    blackKeyDown="linear-gradient(2deg,#777777,black)";
    blackKeyUp="black";
    whiteKeyDown="linear-gradient(2deg,#cccccc,white)";
    whiteKeyUp="white";
    constructor(nWhiteKey,offset,noteDisplayTime){
        this.width=window.innerWidth;
        this.height=window.innerHeight;
        this.whiteKeyWidth=this.width/nWhiteKey;
        this.blackKeyWidth=this.whiteKeyWidth*0.55;
        this.offset=offset;
        this.noteDisplayTime=noteDisplayTime;
        this.notes=[];
        this.initKeys();
    }
    createNote(keyId){
        var noteBlock=document.createElement("div");
        noteBlock.style.position="absolute";
        noteBlock.style.left=this.getKeyLeftPosition(keyId)+"px";
        noteBlock.style.top=this.height/2+"px";
        noteBlock.style.width=(isWhiteKey(keyId)?
        this.whiteKeyWidth:
        this.blackKeyWidth)+"px";
        noteBlock.style.height=0+"px";
        noteBlock.style.background="#99f";
        noteBlock.style.borderRadius="5px 5px 5px 5px";
        document.body.append(noteBlock);
        return {state: "dynamic",id: keyId,block: noteBlock};
    }
    //keyDown and keyUp modify the state of the key and add note above keys
    keyDown(keyId){
        if(keyId<0||keyId>=this.keys.length)return;
        var tarKey=this.keys[keyId];
        tarKey.style.background=isWhiteKey(keyId)?
            this.whiteKeyDown:
            this.blackKeyDown;
        //create a new note block
        var newNote=this.createNote(keyId);
        this.notes.push(newNote);
    }
    keyUp(keyId){
        if(keyId<0||keyId>=this.keys.length)return;
        var tarKey=this.keys[keyId];
        tarKey.style.background=isWhiteKey(keyId)?
            this.whiteKeyUp:
            this.blackKeyUp;
        //modify the state of the note
        for(let i=0;i<this.notes.length;++i)if(this.notes[i].state=="dynamic"&&this.notes[i].id==keyId){
            this.notes[i].state="static";
        }
    }

    update(currentTime){
        var diffPos=this.height/2*((currentTime-this.lastUpdateTime)/1000)/this.noteDisplayTime;
        this.lastUpdateTime=currentTime;
        for(let i=0,curBlock;i<this.notes.length;++i){
            curBlock=this.notes[i].block;
            curBlock.style.top=Number(curBlock.style.top.slice(0,-2))-diffPos+"px";
            if(this.notes[i].state=="dynamic"){
                curBlock.style.height=Number(curBlock.style.height.slice(0,-2))+diffPos+"px";
            }
            else if(this.notes[i].state=="static"){
                if(Number(curBlock.style.top.slice(0,-2))+Number(curBlock.style.height.slice(0,-2))<0){
                    curBlock.remove();
                    this.notes.splice(i,1);
                    --i;
                }
            }
        }
    }
    startLoop(tim){
        var tar=this;
        if(!this._update){
            this._update=function(tim){
                tar.update(tim);
                requestAnimationFrame(tar._update);
            }
        }
        //FIXME how to stop this, because every anonymous function is different.
        requestAnimationFrame(this._update);
    }
    initKeys(){
        var totalN=128
        this.keys=[];
        //add all keys no matter it is visible
        for(let i=0;i<totalN;++i){
            let key=document.createElement("div");
            this.keys.push(key);
        }
        //separate keys into two clusters
        this.wkeys=[],this.bkeys=[];
        //for each key, set its style according to its color
        for(let i=0;i<totalN;++i){
            if(isWhiteKey(i)) this.wkeys.push(this.keys[i]);
            else this.bkeys.push(this.keys[i]);
        }
        this.initWhiteKeys();
        this.initBlackKeys();
        //document.body.scrollTo(this.whiteKeyWidth*this.offset,0);
    }
    initWhiteKeys(){
        for(let i=0;i<this.wkeys.length;++i){
            this.wkeys[i].style.width=this.whiteKeyWidth*0.96+"px";
            this.wkeys[i].style.height=this.height/2+"px";
            this.wkeys[i].style.background="#ffffff";
            this.wkeys[i].style.borderRadius="0px 0px 4px 4px";
        }
        //append white keys separately,not in a table
        for(let i=0;i<this.wkeys.length;++i){
            this.wkeys[i].style.position="absolute";
            this.wkeys[i].style.left=this.whiteKeyWidth*i+"px";
            this.wkeys[i].style.top=this.height/2+"px";
            this.wkeys[i].style.border="1px";
            document.body.append(this.wkeys[i]);
        }
    }
    initBlackKeys(){
        for(let i=0;i<this.bkeys.length;++i){
            this.bkeys[i].style.width=this.blackKeyWidth+"px";
            this.bkeys[i].style.height=this.height/4+"px";
            this.bkeys[i].style.background="#000000";
            this.bkeys[i].style.borderRadius="0px 0px 4px 4px";
        }
        //don't put black keys in a table
        for(let i=0;i<this.bkeys.length;++i){
            this.bkeys[i].style.position="absolute";
            this.bkeys[i].style.left=
            Number.parseInt(i/5)*this.whiteKeyWidth*7+
            this.blackKeyOffset[i%5]*this.whiteKeyWidth+"px";
            this.bkeys[i].style.top=this.height/2+"px";
            document.body.append(this.bkeys[i]);
        }
    }
    getKeyLeftPosition(keyId){
        return isWhiteKey(keyId)?
            this.whiteKeyWidth*(
                Number.parseInt(keyId/12)*7+
                ((keyId%12+(keyId%12>4))>>>1)
            ):
            this.whiteKeyWidth*(
                Number.parseInt(keyId/12)*7+
                this.blackKeyOffset[
                    ((keyId%12-(keyId%12>3))>>>1)
                ]
            );
    }
}
