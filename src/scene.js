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
        this.load.atlas('player', 'assets/images/reagan_player.png','assets/images/reagan_player_atlas.json');
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


        /*******GAME OBJECTS*******/
        //ECHELLE
        this.ladder = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Ladder').objects.forEach((ladder) => {
            // Add new spikes to our sprite group
            const ladderSprite = this.ladder.create(ladder.x,ladder.y - 1000 - ladder.height, 'ladder').setOrigin(0);
            ladderSprite.body.setSize(ladder.width-50, ladder.height).setOffset(25, 0);
        });

        //SORTIE DE L'ECHELLE
        this.outLad = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('OutOfLAdder').objects.forEach((outLad) => {
            const outLadSprite = this.physics.add.sprite(outLad.x+(outLad.width*0.5),outLad.y + (outLad.height*0.5)-1000).setSize(outLad.width,outLad.height);
            this.outLad.add(outLadSprite);
        });


        /****INITIALIZING THE PLAYER*****/
        this.player = new Player(this);
        this.cameras.main.startFollow(this.player.player,true,0.1,0.05,-100,0);

        /*****GLOBAL OVERLAPS BETWEEN OBJECTS*****/
        this.physics.add.overlap(this.player.player,this.ladder, this.climb.bind(this), null, this);
        this.physics.add.overlap(this.player.player,this.outLad, this.notClimb.bind(this), null, this);

        /**INPUT MOVEMENTS**/
        this.initKeyboard();
    }

    climb(player, ladder){
        this.player.player.onLadder = true;
        this.player.player.climbing = true;
    }
    notClimb(player,outLad){
        this.player.player.climbing = false
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
        if (this.player.player.body.velocity.y < 0){
            this.player.player.jumping =true;
            console.log('Jumping');
        }
        if (this.player.player.body.velocity.y > 0){
            this.player.player.falling = true;
            console.log('Falling');
        }

        if (this.player.player.body.velocity.x != 0 && this.player.player.body.onFloor() && this.player.player.falling){
            this.player.player.play('run',true);
        }

        /**CONDITIONS POUR GRIMPER**/
        if(this.player.player.onLadder)
        {
            this.player.player.onLadder = false;
            if (this.upLad)
            {
                this.player.player.setVelocityY(-400);
                this.player.player.body.setAllowGravity(true);
            }
            else if (this.downLad)
            {
                this.player.player.setVelocityY(400);
                this.player.player.body.setAllowGravity(true);
            }
            else {
                this.player.player.setVelocityY(0);
                this.player.player.body.setAllowGravity(false);

            }

            if (!this.player.player.onLadder){
                if (this.downLad || this.upLad || this.rightLad || this.leftLad){
                    this.player.player.body.setAllowGravity(true);
                }
            }


        }
        /**
        if(this.player.player.climbing){
            console.log('climbing');
            if(this.player.player.body.velocity.y != 0){
                this.player.player.play('climb',true);
            }
            else {
                this.player.player.play('climbidle',true);

            }
        }**/
    }
}