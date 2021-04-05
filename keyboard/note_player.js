//play multiple notes simultaneously, but every note in playing should have a different value.
class NotePlayer{
    constructor(maptable){
        this.mapping=maptable;
        this.note_playing=[];
        this.audio_ctx=new AudioContext();
        this.amp=this.audio_ctx.createGain();
        this.amp.gain.value=1;
    }
    play(noteId){
        if(this.note_playing[noteId])return;
        var osc=this.audio_ctx.createOscillator();
        osc.frequency.value=this.mapping.getFrequencyById(noteId);
        this.note_playing[noteId]=osc;
        osc.connect(this.amp).connect(this.audio_ctx.destination);
        osc.start();
    }
    stop(noteId){
        if(!this.note_playing[noteId])return;
        var osc=this.note_playing[noteId];
        osc.stop();
        this.note_playing[noteId]=null;
    }
    stopAll(){
        for(let i=0;i<this.note_playing.length;++i)this.stop(i);
    }
    set volume(value){
        this.amp.gain.value=value;
    }
    get volume(){
        return this.amp.gain.value;
    }
}
