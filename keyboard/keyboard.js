//coordinate between note_player and UI(bad English?)
class Keyboard{
    constructor(np,plotter){
        this.player=np;
        this.plotter=plotter;
        this.mode="normal";//normal, replaying or recording
        this.nKeys;// should set one default here
        this.key_offset=40;// should change the value later 
        this.key_map={};
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
        return this.sequence;
    }
    replay(seq){//replay the Sequence seq
        this.mode="recording";
    }
    findKeyId(key){
        var key_pos=this.key_map[key];
        if(key_pos)return (5+key_pos[0])*(12)+key_pos[1];
    }
    keyDown(key){
        var key_id=this.findKeyId(key);
        if(!key_id)return;
        this.player.play(key_id);
        this.plotter.keyDown(key_id);
    }
    keyUp(key){
        if(key.length>1)return;
        var key_id=this.findKeyId(key);
        if(key_id){
            this.player.stop(key_id);
            this.plotter.keyUp(key_id);
        }
        //maybe some bugs will be here.
        key_id=this.findKeyId(String.fromCharCode(key.charCodeAt(0)^32));
        if(key_id){
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
        if(!seq_str){
            this.len=0;
            this.notes=[];
        }
        else if(seq_str.constructor==String){//parse from JSON
            //import notes from notes if notes has value
            var data=JSON.parse(seq_str);
            this.len=data["len"];
            this.notes=data["notes"];
        }
        else if(seq_str.constructor==Array){//parse from MIDI binary
            throw "Not Implemented!";
        }
        else{
            throw "Not Supported Import Format";
        }
    }
    addNote(note_id,note_len){
        this.notes.push({id:note_id,len:note_len});
    }
    toString(){
        //export to string, the work of ui is up to main.html
        var data={len: this.len,notes: this.notes};
        return JSON.stringify(data);
    }
    toMIDI(){
        throw "Not Implemented!";
    }
}

