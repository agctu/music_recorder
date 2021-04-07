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
        if(!this.mapping.getFrequencyById(noteId))return;
        var osc=this.audio_ctx.createOscillator();
        var localAmp=this.audio_ctx.createGain();
        localAmp.gain.value=1;
        osc.type="square";
        osc.frequency.value=this.mapping.getFrequencyById(noteId);
        this.note_playing[noteId]=[osc,localAmp];
        osc.connect(localAmp).connect(this.amp).connect(this.audio_ctx.destination);
        osc.start();
    }
    stop(noteId){
        if(!this.note_playing[noteId])return;
        var oscset=this.note_playing[noteId];
        oscset[0].stop(this.audio_ctx.currentTime+0.2);
        oscset[1].gain.linearRampToValueAtTime(0,this.audio_ctx.currentTime+0.2);
        
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
