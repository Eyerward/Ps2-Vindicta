class scene extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/images/background.png');
        this.load.image('diamond_blue', 'assets/images/diamond_blue.png');
        this.load.image('diamond_red', 'assets/images/diamond_red.png');
        this.load.image('enemy_blade', 'assets/images/enemy_blade.png');
        this.load.image('enemy_reap', 'assets/images/enemy_reap.png');
        this.load.image('ladder', 'assets/images/ladder.png');
        this.load.image('save_off', 'assets/images/save_off.png');
        this.load.image('save_on', 'assets/images/save_on.png');
        this.load.image('save_on', 'assets/images/save_on.png');
        //Appel du spritesheet du joueur avec sa ref JSON
        this.load.atlas('player', 'assets/images/kenney_player.png','assets/images/kenney_player_atlas.json');
        //Appel de la map Tiled et de ses tuiles
        this.load.image('tiles','assets/tileset/platformPack_tilesheet.png')
        this.load.tilemapTiledJSON('tryout','assets/maps/tryout.json');
    }
    create(){

        /**PRESETS**/
            //BG et Map
        const backgroundImage = this.add.image(0, 500,'background').setOrigin(0, 0);
        backgroundImage.setScale(3, 1.5);

        const map = this.make.tilemap({ key: 'tryout' });
        const tileset = map.addTilesetImage('kenney_tryout', 'tiles');
        const platforms = map.createStaticLayer('Platforms', tileset, 0, -1000);



        //COLLISIONS
        this.sol = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Collisions').objects.forEach((sol) => {
            const solSprite = this.physics.add.sprite(sol.x+(sol.width*0.5),sol.y + (sol.height*0.5)-1000).setSize(sol.width,sol.height);
            this.sol.add(solSprite);
        });

        this.player = new Player(this);
        this.cameras.main.startFollow(this.player.player,true,0.1,0.05,-100,0);

        this.initKeyboard();
    }

    initKeyboard()
    {
        let me = this;

        this.input.keyboard.on('keydown', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.rightLad = true;
                    me.player.moveRight();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.leftLad = true;
                    me.player.moveLeft();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Z:
                    me.upLad = true;
                    if (me.player.player.body.onFloor()) {
                        me.player.jump();
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.downLad = true;
                    break;
            }
        });
        this.input.keyboard.on('keyup', function(kevent)
        {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.D:
                    me.rightLad = false;
                    me.player.noMove();

                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                    me.leftLad = false;
                    me.player.noMove();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Z:
                    me.upLad = false;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.downLad = false;
                    break;
            }
        });
    }
    update(){

        /**QUELQUES CONDITIONS D'ANIMATION**/

        //IDLE
        if (this.player.player.body.velocity.x === 0 && this.player.player.body.onFloor()) {
            this.player.player.play('idle',true);
        }

        //SAUT
        if (this.player.player.body.velocity.y > 0){
            this.player.player.falling = true;
            console.log(this.player.player.falling);
        }

        if (this.player.player.body.velocity.x != 0 && this.player.player.body.onFloor() && this.player.player.falling){
            this.player.player.play('walk',true);
        }
    }
}