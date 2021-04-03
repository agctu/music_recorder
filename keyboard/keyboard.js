//coordinate between note_player and UI(bad English?)
class Keyboard{
    constructor(np,plotter){
        this.player=np;
        this.plotter=plotter;
        this.nKeys;// should set one default here
        this.key_offset=40;// should change the value later 
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

