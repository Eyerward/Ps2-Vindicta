class scene extends Phaser.Scene {
    preload(){
        this.load.image('diamond_blue', 'assets/images/diamond_blue.png');
        this.load.image('diamond_red', 'assets/images/diamond_red.png');
        this.load.image('enemy_blade', 'assets/images/enemy_blade.png');
        this.load.image('ladder', 'assets/images/ladder.png');
        this.load.image('brasero', 'assets/images/brasero.png');
        this.load.image('die_particle', 'assets/images/die_particle.png');
        this.load.image('fire_particle', 'assets/images/fire_particle.png');
        //Appel des différents Spritesheets : collectibles, pouvoirs et ennemis
        this.load.atlas('power_collect', 'assets/images/collectible_power.png', 'assets/images/collectible_atlas.json');
        this.load.atlas('life_collect', 'assets/images/collectible_life.png', 'assets/images/collectible_atlas.json');
        this.load.atlas('energy', 'assets/images/energy_blade.png', 'assets/images/energy.json')
        //Appel du spritesheet du joueur avec sa ref JSON
        this.load.atlas('player', 'assets/images/reagan_player.png','assets/images/reagan_player_atlas.json');
        //Appel de la map Tiled et de ses tuiles
        this.load.image('tiles','assets/tileset/platform_vindicta_v4.png');
        this.load.image('bg1','assets/tileset/bg1_mountain.png');
        this.load.image('bg2','assets/tileset/bg2_mountain.png');
        this.load.image('bg3','assets/tileset/bg3_sky.png');
        this.load.tilemapTiledJSON('map_1','assets/maps/map_1.json');
    }
    create(){

        //DATA
        this.valueHurt = 2;

        this.screenWidth = 1000;

        //VFX PARTICLES D2J0 PRESENTES SUR LA MAP

        this.smokeFX = {
            frequency:250,
            lifespan: 1500,
            quantity:2,
            x:{min:-32,max:32},
            y:{min:-10,max:10},
            tint:0x808080,
            rotate: {min:-10,max:10},
            speedX: { min: -10, max: 10 },
            speedY: { min: -10, max: -20 },
            scale: {start: 0, end: 1},
            alpha: { start: 1, end: 0 },
            //blendMode: Phaser.BlendModes.ADD,
        };

        /**PRESETS**/
        //APPEL DES LAYERS ET CREATION PLATFORMES ET PARALLAXE

        const map = this.make.tilemap({ key: 'map_1' });

        const sky = map.addTilesetImage('vindicta_sky','bg3');
        const bg2 = map.addTilesetImage('vindicta_bg2','bg2');
        const bg1 = map.addTilesetImage('vindicta_bg1','bg1');
        const tileset = map.addTilesetImage('vindicta_platform', 'tiles');

        this.sky = map.createLayer('BG3', sky, 0, -5000);
        this.bg2 = map.createLayer('BG2', bg2, 0, -4500);
        this.bg1 = map.createLayer('BG1', bg1, 0, -4300);

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

        /***ESSAI DE COLLECTIBLE**/
        this.collect = new Collect(this,1100, 5500);
        /****INITIALISATION PLAYER AVEC SA POSITION ET SA CAMERA*****/
        this.player = new Player(this, this.monster);
        this.saveX = this.player.player.x;
        this.saveY = this.player.player.y;
        this.cameras.main.startFollow(this.player.player,true,0.1,0.1,0,150);


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
            const saveSprite = this.physics.add.sprite(save.x, save.y - save.height, 'brasero').setOrigin(0);
            this.save.add(saveSprite);
            this.emitSmoke = this.add.particles('fire_particle');//On charge les particules à appliquer au layer
            this.emitSmoke.createEmitter(this.smokeFX);
            this.emitSmoke.x = save.x+32;
            this.emitSmoke.y = save.y-55;
        });


        //ENNEMIS



        this.respawnFX = this.add.particles('energy');
        this.respawnFX.createEmitter({
            lifespan: 200,
            quantity: 10,
            speedX: { min: -300, max: 300 },
            speedY: { min: -1000, max: -100 },
            gravityY: 500,
            scale: {start: 1, end: 0},
            alpha: { start: 1, end: 0 },
            blendMode: 'ADD',
        });

        this.fireParticles = this.add.particles('fire_particle');
        this.fireParticles.createEmitter({
            speed: 100,
            lifespan: 1500,
            quantity: 100,
            //gravityY: 500,
            scale: {start: 0.5, end: 1},
            alpha: { start: 1, end: 0 },
            angle: { min: -100, max: -80 },
            blendMode: 'ADD',
            on: false
        });

        this.fireFX = {
            frequency:100,
            lifespan: 2000,
            quantity:10,
            x:{min:-20,max:20},
            y:{min:-10,max:0},
            rotate: {min:-10,max:10},
            speedX: { min: -20, max: 20 },
            speedY: { min: -100, max: -10 },
            scale: {start: 0, end: 1},
            alpha: { start: 1, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
        };

        /**PARALLAXE**/
        this.sky.scrollFactorX = 0;
        this.sky.scrollFactorY = 0;

        this.bg2.scrollFactorX = 0.1;
        this.bg2.scrollFactorY = 0.1;

        this.bg1.scrollFactorX = 0.15;
        this.bg1.scrollFactorY = 0.15;




        /*****OVERLAPS ENTRE OBJECTS*****/
        //CACHE
        this.physics.add.overlap(this.player.player,this.cache, this.discover, null, this);
        //INTERACTIONS LADDER
        this.physics.add.overlap(this.player.player,this.ladder, this.climb.bind(this), null, this);
        this.physics.add.overlap(this.player.player,this.outLad, this.notClimb.bind(this), null, this);
        //CHECKPOINT
        this.physics.add.overlap(this.player.player,this.save, this.checkpoint, null, this);
        //ENNEMIS
        this.physics.add.collider(this.player.player, this.monster, this.playerHurt, null, this);
        //COLLECTIBLES
        this.physics.add.collider(this.collect.power, this.sol);
        this.physics.add.overlap(this.player.player, this.collect.power,this.collected, null, this);

        /**INPUT MOVEMENTS**/
        this.initKeyboard();

    }

    discover(){
        this.mapCache.visible = false;
    }

    climb(){
        this.player.player.onLadder = true;
        this.player.player.climbing = true;
    }
    notClimb(){
        this.player.player.climbing = false
    }

    checkpoint(player, save){
        this.saveX = this.player.player.x;
        this.saveY = this.player.player.y;
        console.log("current", this.saveX, this.saveY);
        this.emitFire = this.add.particles('fire_particle'); //On charge les particules à appliquer au layer
        this.emitFire.createEmitter(this.fireFX); //On crée l'émetteur
        this.emitFire.x = save.x +30;
        this.emitFire.y = save.y+15;
        this.fireParticles.emitParticleAt(save.x+30, save.y+10);
        save.body.enable = false;
    }

    collected(){
        this.player.power += this.collect.valueCollect;
        console.log(this.player.power, "power");
        this.collect.powerParticles.emitParticleAt(this.collect.power.body.x, this.collect.power.body.y);
        this.collect.power.destroy();
    }

    playerHurt(){
        this.player.life -= this.valueHurt;
        console.log(this.player.life, "life");
        this.player.player.setAlpha(0.3);
        let hurt = this.tweens.add({
            targets: this.player.player,
            alpha: 1,
            tint: false,
            duration: 50,
            ease: 'Linear',
            repeat: 10,
        });

    }

    playerDeath(){
        this.player.player.setVisible(false);
        this.player.player.disableBody();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.respawnFX.emitParticleAt(this.player.player.x, this.player.player.y+50);
                this.player.player.enableBody();
                this.player.player.setVisible(true);
                this.player.player.x = this.saveX;
                this.player.player.y = this.saveY;
                this.player.life = 100;
                this.player.power = 0;
            }});
    }

    // monsterHurt(monster){
    //     if (monster.life <= 0){
    //         monster
    //     }
    // }



    initKeyboard()
    {
        let me = this;

        this.input.keyboard.on('keydown', function(kevent)
        {
            switch (kevent.keyCode)
            {
                case Phaser.Input.Keyboard.KeyCodes.D:
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    me.rightLad = true;
                    me.player.moveRight();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    me.leftLad = true;
                    me.player.moveLeft();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Z:
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    me.upLad = true;
                    if (me.player.player.body.onFloor()) {
                        me.player.jump();
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    me.downLad = true;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    me.player.attack();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.R:
                    me.player.charaSwitch();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.E:
                    me.player.special();
                    break;
            }
        });
        this.input.keyboard.on('keyup', function(kevent)
        {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.D:
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    me.rightLad = false;
                    me.player.noMove();

                    break;
                case Phaser.Input.Keyboard.KeyCodes.Q:
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    me.leftLad = false;
                    me.player.noMove();
                    break;
                case Phaser.Input.Keyboard.KeyCodes.Z:
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    me.upLad = false;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.S:
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    me.downLad = false;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.C:
                    me.player.switched =true;
                    break;
                case Phaser.Input.Keyboard.KeyCodes.E:
                    me.player.lightning = true;
                    break;
            }
        });
    }
    update(){

        this.monster.monsterGestion(this.monster.monster, this.player.player);

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

        //RUN
        if (this.player.player.body.velocity.x != 0 && this.player.player.body.onFloor() && this.player.player.falling === true){
            this.player.player.play('run',true);
        }
        if(this.player.player.body.velocity.y ===0){
            this.player.player.jumping = false;
            this.player.player.falling = false;
        }

        //SAUT ET GRIMPETTE

        if(this.player.player.climbing === true){
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
        else {
            if (this.player.player.body.velocity.y < 0){
                console.log('Jumping');
                this.player.player.play('jump', true);
            }
            else if (this.player.player.body.velocity.y > 0){
                console.log('Falling');
                this.player.player.falling =true;
                this.player.player.play('fall', true);

            }
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

        /**CONDITIONS DE VIE OU DE MORT**/
        if (this.player.life <= 0){
            this.playerDeath();
        }


    }
}