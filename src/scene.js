class scene extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/images/bg_parallaxe.png');
        this.load.image('diamond_blue', 'assets/images/diamond_blue.png');
        this.load.image('diamond_red', 'assets/images/diamond_red.png');
        this.load.image('enemy_blade', 'assets/images/enemy_blade.png');
        this.load.image('ladder', 'assets/images/ladder.png');
        this.load.image('save_off', 'assets/images/save_off.png');
        this.load.image('save_on', 'assets/images/save_on.png');
        //Appel des différents Spritesheets : collectibles, pouvoirs et ennemis
        this.load.atlas('power_collect', 'assets/images/collectible_power.png', 'assets/images/collectible_atlas.json');
        this.load.atlas('life_collect', 'assets/images/collectible_life.png', 'assets/images/collectible_atlas.json');
        this.load.atlas('energy', 'assets/images/energy_blade.png', 'assets/images/energy.json')
        //Appel du spritesheet du joueur avec sa ref JSON
        this.load.atlas('player', 'assets/images/reagan_player.png','assets/images/reagan_player_atlas.json');
        //Appel de la map Tiled et de ses tuiles
        this.load.image('tiles','assets/tileset/platform_vindicta_v4.png')
        this.load.tilemapTiledJSON('map_1','assets/maps/map_1.json');
    }
    create(){
        this.valueCollect = 10;
        this.valueHurt = 2;

        this.screenWidth = 1000;

        /**PRESETS**/
        //BG parallaxe et Map
        this.parallaxe = this.add.container(0,0);

        this.background = this.add.image(-100, 4500,'background').setOrigin(0, 0);
        this.background.setScale(1.5, 1.5);

        const map = this.make.tilemap({ key: 'map_1' });
        const tileset = map.addTilesetImage('vindicta_platform', 'tiles');
        const grotte = map.createStaticLayer('Grotte', tileset, 0, 0);
        const platforms = map.createStaticLayer('Platforms', tileset, 0, 0);
        const staticObjects = map.createStaticLayer('StaticObjects', tileset, 0, 0);
        const cache = map.createStaticLayer('Cache', tileset, 0, 0);
        this.mapCache = cache;
        this.mapCache.visible = true;

        /**INTERACTIONS AVEC LA MAP**/
        //COLLISIONS
        this.sol = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Collisions').objects.forEach((sol) => {
            const solSprite = this.physics.add.sprite(sol.x+(sol.width*0.5),sol.y + (sol.height*0.5)).setSize(sol.width,sol.height);
            this.sol.add(solSprite);
        });

        //CACHE DE GROTTE
        this.cache = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Cache').objects.forEach((cache) => {
            const cacheSprite = this.physics.add.sprite(cache.x+(cache.width*0.5),cache.y+(cache.height*0.5)).setSize(cache.width,cache.height);
            this.cache.add(cacheSprite);
        });


        /*******GAME OBJECTS*******/
        //ECHELLE
        this.ladder = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Ladder').objects.forEach((ladder) => {
            const ladderSprite = this.physics.add.sprite(ladder.x+(ladder.width*0.5),ladder.y+(ladder.height*0.5)).setSize(ladder.width,ladder.height);
            this.ladder.add(ladderSprite);
        });

        /**this.ladder = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Ladder').objects.forEach((ladder) => {
            // Add new spikes to our sprite group
            const ladderSprite = this.ladder.create(ladder.x,ladder.y - ladder.height, 'ladder').setOrigin(0);
            ladderSprite.body.setSize(ladder.width-50, ladder.height).setOffset(25, 0);
        });**/

        //SORTIE DE L'ECHELLE
        this.outLad = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('OutOfLadder').objects.forEach((outLad) => {
            const outLadSprite = this.physics.add.sprite(outLad.x+(outLad.width*0.5),outLad.y + (outLad.height*0.5)).setSize(outLad.width,outLad.height);
            this.outLad.add(outLadSprite);
        });

        //SAUVEGARDES

        this.save = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Save').objects.forEach((save) => {
            const saveSprite = this.physics.add.sprite(save.x, save.y - save.height, 'save_off').setOrigin(0);
            this.save.add(saveSprite);
        });

        //ORBES COLLECTIBLES

        /**this.powerCollect = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('CollectiblePower').objects.forEach((powerCollect) => {
            let powerCollect1 = new PowerCollect(this, powerCollect.x, powerCollect.y - powerCollect.height*2);
            this.powerCollect.add(powerCollect1);
        });**/

        //ENNEMIS
        this.monster = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Ennemy').objects.forEach((ennemy) => {
            const ennemySprite = this.physics.add.sprite(ennemy.x, ennemy.y - ennemy.height, 'enemy_blade').setOrigin(0);
            this.monster.add(ennemySprite);
        });

        this.collect = new Collect(this);


        /****INITIALISATION PLAYER AVEC SA POSITION ET SA CAMERA*****/
        this.player = new Player(this);
        this.saveX = this.player.player.x;
        this.saveY = this.player.player.y;
        //map.getObjectLayer('Player').objects.forEach((player) => { this.player = new Player(this,player.x,player.y);})
        this.cameras.main.startFollow(this.player.player,true,0.1,0.1,0,150);

        /*****OVERLAPS ENTRE OBJECTS*****/
        //CACHE
        this.physics.add.overlap(this.player.player,this.cache, this.discover, null, this);
        //INTERACTIONS LADDER
        this.physics.add.overlap(this.player.player,this.ladder, this.climb.bind(this), null, this);
        this.physics.add.overlap(this.player.player,this.outLad, this.notClimb.bind(this), null, this);
        //CHECKPOINT
        this.physics.add.overlap(this.player.player,this.save, this.checkpoint, null, this);
        //COLLECTIBLES
        this.physics.add.collider(this.collect.collect, this.sol);
        this.physics.add.overlap(this.player.player, this.collect.collect,this.collected, null, this);
        //ENNEMIS
        this.physics.add.collider(this.player.player, this.monster, this.playerHurt, null, this);

        /**INPUT MOVEMENTS**/
        this.initKeyboard();

    }
    discover(){
        this.mapCache.visible = false;
    }

    climb(player, ladder){
        this.player.player.onLadder = true;
        this.player.player.climbing = true;
    }
    notClimb(player, outLad){
        this.player.player.climbing = false
    }

    checkpoint(player, save){
        this.saveX = this.player.player.x;
        this.saveY = this.player.player.y;
        console.log("current", this.saveX, this.saveY);
        save.visible = false;
        save.body.enable = false;
    }

    collected(player, collect){
        this.player.power += this.valueCollect;
        console.log(this.player.power, "power");
        this.collect.collect.destroy();
    }

    playerHurt(player, monster){
        this.player.life -= this.valueHurt;
        console.log(this.player.life, "life");

        this.player.player.setAlpha(0);
        let hurt = this.tweens.add({
            targets: this.player.player,
            alpha: 1,
            duration: 100,
            ease: 'Linear',
            repeat: 3,
        });
    }

    death(){
        this.player.player.setVisible(false);
        this.player.player.disableBody();
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.player.player.enableBody();
                this.player.player.setVisible(true);
                this.player.player.x = this.saveX;
                this.player.player.y = this.saveY;
                this.player.life = 100;
                this.player.power = 0;
            }});
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
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    me.player.attack();
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

        /**QUELQUES CONDITIONS D'ANIMATION AVEC CONDITIONS DE PARALLAXE**/

        //Parallaxe en X

        if (this.player.player.body.velocity.x > 0){
            /**this.time.addEvent({
                delay: 50,
                callback: () => {
                    this.background.setVelocityX(500)
                }
            })**/
        }
        else if (this.player.player.body.velocity.x < 0){
        }
        else {
        }

        //IDLE
        if (this.player.player.body.velocity.x === 0 && this.player.player.body.onFloor()) {
            this.player.player.play('idle',true);
        }

        //SAUT ET GRIMPETTE
        if (this.player.player.body.velocity.y < 0){
            console.log('Jumping');
        }
        else if (this.player.player.body.velocity.y > 0){
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
                this.player.player.setVelocityY(-300);
                this.player.player.body.setAllowGravity(true);
            }
            else if (this.downLad)
            {
                this.player.player.setVelocityY(300);
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

        if(this.player.player.climbing){
            console.log('climbing');
            if(this.player.player.body.velocity.y < 0){
                this.player.player.play('climbUp',true);
            }
            else if(this.player.player.body.velocity.y > 0){
                this.player.player.play('climbDown',true);
            }
            else {
                this.player.player.play('climbidle',true);

            }
        }

        /**CONDITIONS DE RESPAWN**/
        if (this.player.life < 0){
            this.death();
        }

    }
}