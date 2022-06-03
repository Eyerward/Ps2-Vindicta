class Menu extends Phaser.Scene{
    constructor(){
        super('menu');
    }
    preload(){
        this.load.image('intro', 'assets/hud/menu2.png');
        this.load.image('title', 'assets/hud/menu1.png');
        this.load.image('ash', 'assets/hud/ash.png');
        this.load.image('fire', 'assets/images/fire.png');
        this.load.audio('button', 'assets/sfx/sword.wav');
        this.load.audio('chant', 'assets/sfx/menu.wav');
    }

    create(){
        this.isStart=true;
        this.chant = this.sound.add('chant',{
            volume:1,
            loop:true,
        });;
        this.chant.play();

        this.button = this.sound.add('button');
        this.smokeFX = {
            frequency:250,
            lifespan: 5000,
            quantity:10,
            x:{min:0,max:1280},
            y:0,
            rotate: {min:-180,max:180},
            speedX: { min: -1000, max: 1000 },
            speedY: { min: -10, max: -1000 },
            scale: {start: 0, end: 0.5},
            alpha: { start: 1, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
        };
        this.fireFX = {
            frequency:250,
            lifespan: 5000,
            quantity:10,
            x:{min:0,max:1280},
            y:0,
            rotate: {min:-180,max:180},
            speedX: { min: -1000, max: 1000 },
            speedY: { min: -10, max: -1000 },
            scale: {start: 0, end: 1},
            alpha: { start: 1, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
        };


        this.emitSmoke = this.add.particles('ash');//On charge les particules à appliquer au layer
        this.emitSmoke.createEmitter(this.smokeFX);
        this.emitSmoke.x = 0;
        this.emitSmoke.y = 750;
        this.emitFire = this.add.particles('fire');//On charge les particules à appliquer au layer
        this.emitFire.createEmitter(this.smokeFX);
        this.emitFire.x = 0;
        this.emitFire.y = 750;

        this.title = this.add.image(0,0,'title').setOrigin(0,0);
        this.title.setAlpha(0);

        this.intro = this.add.image(0,0,'intro').setOrigin(0,0);
        this.intro.setAlpha(0);

        let wow = this.tweens.add({
            targets: this.title,
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
            repeat: 0,
        });



        this.time.delayedCall(2000, () => {
            let wow = this.tweens.add({
                targets: this.intro,
                alpha: 1,
                duration: 500,
                ease: 'Linear',
                repeat: 0,
            });
        });


    }
    starter(){
        if (this.isStart){
            this.isStart=false;
            this.button.play();
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(2000, () => {
                this.chant.stop();
        this.scene.start('scene');
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