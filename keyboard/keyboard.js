//coordinate between note_player and UI(bad English?)
class Keyboard{
    constructor(np,plotter){
        this.player=np;
        this.plotter=plotter;
        this.nKeys;// should set one default here
        this.key_offset=40;// should change the value later 
        this.key_map={};
        for(let i=0;i<Keyboard.keys.length;++i){
            for(let j=0;j<Keyboard.keys[i].length;++j){
                this.key_map[Keyboard.keys[i][j]]=[i,j];
            }
        }
    }
    findKeyId(key){
        var key_pos=this.key_map[key];
        return (4+key_pos[0])*(12)+key_pos[1];
    }
    keyDown(key){
        var key_id=this.findKeyId(key);
        this.player.play(key_id);
    }
    keyUp(key){
        var key_id=this.findKeyId(key);
        this.player.stop(key_id);
    }
}
Keyboard.keys=[
    ['1','2','3','4','5','6','7','8'],
    ['9','0','q','w','e','r','t','y'],
    ['u','i','o','p','a','s','d','f'],
    ['g','h','j','k','l',';','z','x'],
    ['c','v','b','n','m',',','.','/'],
    ['!','@','#','$','%','^','&','*'],
    ['(',')','Q','W','E','R','T','Y'],
    ['U','I','O','P','A','S','D','F']
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

