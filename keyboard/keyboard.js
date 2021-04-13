//coordinate between note_player and UI(bad English?)
class Keyboard{
    constructor(np,plotter){
        this.player=np;
        this.plotter=plotter;
        this.mode="normal";//normal, replaying or recording
        this.nKeys;// should set one default here
        this.key_offset=40;// should change the value later 
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
        this.mode="normal";
        var ret=this.sequence;
        this.sequence=null;
        return ret;
    }
    replay(seq){//replay the Sequence seq
        this.mode="replay";
        this.sequence=seq;
        var tar=this;
        setTimeout(
            this._replay,
        seq.actions[0].time-seq.startTime,0);
    }
    //FIXME will these ugly codes bring me some side effect such as memory leak? 
    _replay=function(id){
        var action=tar.sequence.actions[id];
        console.log(id+' '+action);
        switch(action.type){
            case "down": tar.keyDown(action.key); break;
            case "up": tar.keyUp(action.key); break;
        }
        if(id==tar.sequence.length-1){
            tar.sequence=null;
            tar.mode="normal";
            console.log("replaying over!");
            return;
        }
        else
            setTimeout(tar._replay,tar.sequence.actions[id+1].time-action.time,id+1);
    }
    findKeyId(key){
        var key_pos=this.key_map[key];
        if(key_pos)return (5+key_pos[0])*(12)+key_pos[1];
    }
    keyDown(key){
        var key_id=this.findKeyId(key);
        if(!key_id)return;
        if(this.key_playing.has(key_id))return;
        if(this.mode=="recording")this.sequence.addAction(key,"down");
        this.key_playing.add(key_id);
        this.player.play(key_id);
        this.plotter.keyDown(key_id);
    }
    keyUp(key){
        if(key.length>1)return;
        if(this.mode=="recording")this.sequence.addAction(key,"up");
        var key_id=this.findKeyId(key);
        if(key_id){
            this.key_playing.delete(key_id);
            this.player.stop(key_id);
            this.plotter.keyUp(key_id);
        }
        //maybe some bugs will be here.
        key_id=this.findKeyId(String.fromCharCode(key.charCodeAt(0)^32));
        if(key_id){
            this.key_playing.delete(key_id);
            this.player.stop(key_id);
            this.plotter.keyUp(key_id);
        }
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

