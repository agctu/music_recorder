class Note2Frequency{
    constructor(){
        const a=440;//I don't know what this stand for.
        this.note=[];
        this.num=128;
        for(let i=0;i<this.num;++i){
            this.note[i]=(a/32)*Math.pow(2,((i-9)/12));
        }
    }
    getFrequencyById(id){
        return this.note[id];
    }
}
