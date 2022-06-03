class Victory extends Phaser.Scene{
    constructor() {
        super('victory');
    }
    preload(){
        this.load.image('message', 'assets/hud/victoire.png');
        this.load.image('ash', 'assets/hud/ash.png');
        this.load.audio('victory', 'assets/sfx/victoryMenu.wav');
    }

    create(){
        this.chantV = this.sound.add('victory');
        this.chantV.play();
        this.isStart=true;
        this.smokeFX = {
            frequency:250,
            lifespan: 10000,
            quantity:10,
            x:{min:0,max:1280},
            y:0,
            rotate: {min:-180,max:180},
            speedX: { min: 0, max: 1280 },
            speedY: { min: -10, max: -500 },
            scale: {start: 0, end: 0.5},
            alpha: { start: 1, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
        };
        this.emitSmoke = this.add.particles('ash');//On charge les particules à appliquer au layer
        this.emitSmoke.createEmitter(this.smokeFX);
        this.emitSmoke.x = 0;
        this.emitSmoke.y = 750;


        this.message = this.add.image(0,0, 'message').setOrigin(0,0);

        this.cameras.main.flash(5000);


    }

    starter(){
        if (this.isStart){
            this.isStart=false;
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(2000, () => {
                this.chantV.stop();
                this.scene.start('intro');
            });
        }

    }

    initKeyboard() {
        let me = this;

        this.input.keyboard.on('keydown', function(kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.ENTER:
                    me.starter();
                    break;
            }
        });
    }
    update(){
        this.initKeyboard();
    }
}