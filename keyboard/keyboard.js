//coordinate between note_player and UI(bad English?)
class Keyboard{
    constructor(np,plotter){
        this.player=np;
        this.plotter=plotter;
        this.mode="normal";//( normal | replaying | recording )
        this.nKeys;// should set one default here
        this.key_offset=4;// should change the value later
        this.key_map={};
        this.key_playing=new Set();
        for(let i=0;i<Keyboard.keys.length;++i){
            for(let j=0;j<Keyboard.keys[i].length;++j){
                this.key_map[Keyboard.keys[i][j]]=[i,j];
            }
        }
    }
    startRecord(){
        this.mode="recording";
        this.sequence=new Sequence();
    }
    endRecord(){//should return one Sequence
        //add keyup for all keys not up
        for(let i of this.key_playing){
            this.sequence.addAction(i,"up");
        }
        this.mode="normal";
        var ret=this.sequence;
        ret.end();
        delete this.sequence;
        return ret;
    }
    replay(seq){//replay the Sequence seq
        this.mode="replay";
        this.sequence=seq;
        this.nextReplayNote=0;
        var tar=this;
        //FIXME will these ugly codes bring me some side effect such as memory leak? 
        this._replay=function(){
            var action=tar.sequence.actions[tar.nextReplayNote];
            var key_id=action.key;
            console.log(tar.nextReplayNote+' '+action);
            switch(action.type){
                case "down": tar._keyDown(key_id); break;
                case "up": tar._keyUp(key_id); break;
            }
            if(tar.nextReplayNote==tar.sequence.length-1){
                delete tar.sequence;
                tar.mode="normal";
                delete tar.nextReplayNote;
                tar.allKeyUp();
                tar.plotter.endReplay();
                console.log("replaying over!");
            }
            else{
                setTimeout(tar._replay,tar.sequence.actions[tar.nextReplayNote+1].time-action.time);
                ++tar.nextReplayNote;
            }
        }
        this.allKeyUp();
        this.plotter.startReplay(this);
        setTimeout(
            this._replay,
        seq.actions[0].time-seq.startTime,0);
    }
    findKeyId(key){
        var key_pos=this.key_map[key];
        if(key_pos)return (this.key_offset+key_pos[0])*(12)+key_pos[1];
    }
    keyDown(key){
        if(key.length>1)return false;
        var key_id=this.findKeyId(key);
        if(!key_id)return false;
        if(this.key_playing.has(key_id))return false;
        switch(this.mode){
            case "normal":
                this._keyDown(key_id);
                break;
            case "recording":
                this.sequence.addAction(key_id,"down");
                this._keyDown(key_id);
                break;
            case "replaying":
                break;
        }
        return true;//a key is pressed, so the default behaviors should be prevented.
    }
    _keyDown(key_id){
        this.key_playing.add(key_id);
        this.player.play(key_id);
        this.plotter.keyDown(key_id);
    }
    keyUp(key,conjugateUp=true){
        if(key.length>1)return;
        var key_id=this.findKeyId(key);
        if(key_id){
            switch(this.mode){
                case "normal":
                    this._keyUp(key_id);
                    break;
                case "recording":
                    this.sequence.addAction(key_id,"up");
                    this._keyUp(key_id);
                    break;
                case "replaying":
                    break;
            }
        }
        //maybe some bugs will be here.
        if(conjugateUp)this.keyUp(this.getConjugateKey(key),false);
    }
    _keyUp(key_id){
        this.key_playing.delete(key_id);
        this.player.stop(key_id);
        this.plotter.keyUp(key_id);
    }
    allKeyUp(){
        for(let key_id of this.key_playing)this._keyUp(key_id);
        this.key_playing.clear();
    }
    getConjugateKey(key){
        return String.fromCharCode(key.charCodeAt(0)^32);
    }
    shiftRight(n){
        if(!n)n=1;
        this.key_offset=Math.min(
            this.key_offset+n,
            Math.ceil(this.key_map.note.length/12)
        );
    }
    shiftLeft(n){
        if(!n)n=1;
        this.key_offset=Math.max(
            this.key_offset-n,
            0
        );
    }
}
Keyboard.keys=[
    ['q','Q','w','W','e','r','R','t','T','y','Y','u'],
    ['a','A','s','S','d','f','F','g','G','h','H','j'],
    ['z','Z','x','X','c','v','V','b','B','n','N','m']
];

class Sequence{
    constructor(seq_str){
        this.startTime=new Date().getTime();
        if(!seq_str){
            this.actions=[];
        }
        else if(seq_str.constructor==String){//parse from JSON
            //import notes from notes if notes has value
            var data=JSON.parse(seq_str);
            this.len=data["len"];
            this.actions=data["actions"];
        }
        else if(seq_str.constructor==Array){//parse from MIDI binary
            throw "Not Implemented!";
        }
        else{
            throw "Not Supported Import Format";
        }
    }
    addAction(keyId,type,time){// enum type{down,up}, double time
        //FIXME Is the time gotten from here accurate?
        if(!time)time=new Date().getTime();
        this.actions.push({key: keyId,type: type,time: time});
    }
    end(){
        this.endTime=new Date().getTime();
    }
    toString(){
        //export to string, the work of ui is up to main.html
        var data={len: this.len,actions: this.actions};
        return JSON.stringify(data);
    }
    get length(){
        return this.actions.length;
    }
    toMIDI(){
        throw "Not Implemented!";
    }
}

