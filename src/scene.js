class scene extends Phaser.Scene {
    constructor(){
        super('scene')
    }
    preload(){
        this.load.image('aranea', 'assets/images/aranea.png');
        this.load.image('wall', 'assets/images/wall.png');
        this.load.image('wall2', 'assets/images/wall2.png');
        this.load.image('broken', 'assets/images/broken.png');
        this.load.image('brick', 'assets/images/brick.png');
        this.load.image('rock', 'assets/images/rock.png');
        this.load.image('ladder', 'assets/images/ladder.png');
        this.load.image('brasero', 'assets/images/brasero.png');
        this.load.image('boss', 'assets/images/boss.png');
        this.load.image('bossFire', 'assets/images/boss_fire.png');
        this.load.image('die_particle', 'assets/images/die_particle.png');
        this.load.image('fire_particle', 'assets/images/fire_particle.png');
        //Appel des différents Spritesheets : collectibles, pouvoirs et ennemis
        this.load.atlas('power_collect', 'assets/images/collectible_power.png', 'assets/images/collectible_atlas.json');
        this.load.atlas('life_collect', 'assets/images/collectible_life.png', 'assets/images/collectible_atlas.json');
        this.load.atlas('energy', 'assets/images/energy_blade.png', 'assets/images/energy.json');
        //Appel du spritesheet du joueur avec sa ref JSON
        this.load.atlas('player', 'assets/images/reagan_player.png','assets/images/reagan_player_atlas.json');
        //Appel de la map Tiled et de ses tuiles
        this.load.image('tiles','assets/tileset/platform_vindicta_v5.png');
        this.load.image('bg1','assets/tileset/bg1_mountain.png');
        this.load.image('bg2','assets/tileset/bg2_mountain.png');
        this.load.image('bg3','assets/tileset/bg3_sky.png');
        this.load.image('controls','assets/tileset/controls.png');
        this.load.tilemapTiledJSON('map_final','assets/maps/map_final.json');

        this.load.audio('theme', 'assets/sfx/Vindicta1.wav');
        this.load.audio('beginning', 'assets/sfx/beginning.wav');
        this.load.audio('scream', 'assets/sfx/scream.wav');
        this.load.audio('victory', 'assets/sfx/victory.wav');
    }
    create(){
        /**PRESETS DE MISE EN SCENE**/
        this.beginning = true;
        this.deathSound = false;
        this.win = true;

        this.theme = this.sound.add('theme',{
            volume:1,
            loop:true,
        });
        this.theme.play();
        this.begin = this.sound.add('beginning',{
            volume:0.5,
            loop:false,
        })
        this.begin.play();

        this.screamAudio = this.sound.add('scream');
        this.victoireAudio = this.sound.add('victory');

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

        const map = this.make.tilemap({ key: 'map_final' });

        const sky = map.addTilesetImage('vindicta_sky','bg3');
        const bg2 = map.addTilesetImage('vindicta_bg2','bg2');
        const bg1 = map.addTilesetImage('vindicta_bg1','bg1');
        const tileset = map.addTilesetImage('vindicta_platforms', 'tiles');
        const tuto = map.addTilesetImage('controls', 'controls');

        this.sky = map.createLayer('BG3', sky, 0, -5000);
        this.bg2 = map.createLayer('BG2', bg2, 0, -4500);
        this.bg1 = map.createLayer('BG1', bg1, 0, -4300);

        const grotte = map.createLayer('Grotte', tileset, 0, 0);
        const platforms = map.createLayer('Platforms', tileset, 0, 0);
        const staticObjects = map.createLayer('StaticObjects', tileset, 0, 0);
        const controls = map.createLayer('Controls', tuto, 0, 0);
        const cache = map.createLayer('Cache', tileset, 0, 0);
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

        //MURS ENNEMIS
        this.wallsR = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('WallR').objects.forEach((wallR) => {
            const wallRSprite = this.physics.add.sprite(wallR.x, wallR.y - 128 - wallR.height, 'wall').setOrigin(0);
            this.wallsR.add(wallRSprite);
        });
        this.wallsB = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('WallB').objects.forEach((wallB) => {
            const wallBSprite = this.physics.add.sprite(wallB.x, wallB.y - 128 - wallB.height, 'wall2').setOrigin(0);
            this.wallsB.add(wallBSprite);
        });

        //SAFETY
        this.safe = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Safety').objects.forEach((safe) => {
            const safeSprite = this.physics.add.sprite(safe.x+(safe.width*0.5),safe.y + (safe.height*0.5)).setSize(safe.width,safe.height);
            this.safe.add(safeSprite);
        });

        //DIVE
        this.dive = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Dive').objects.forEach((dive) => {
            const diveSprite = this.physics.add.sprite(dive.x - dive.width, dive.y - dive.height, 'broken').setOrigin(0);
            this.dive.add(diveSprite);
        });

        //REGENERATION
        this.regenerate = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Regenerate').objects.forEach((regenerate) => {
            const regenerateSprite = this.physics.add.sprite(regenerate.x+(regenerate.width*0.5),regenerate.y + (regenerate.height*0.5)).setSize(regenerate.width,regenerate.height);
            this.regenerate.add(regenerateSprite);
        });

        //BOSS FIGHT
        this.boss = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('BossFight').objects.forEach((boss) => {
            const bossSprite = this.physics.add.sprite(boss.x - boss.width, boss.y - boss.height, 'boss').setOrigin(0);
            this.boss.add(bossSprite);
        });

        //EASTER
        this.easter = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('EasterFound').objects.forEach((easter) => {
            const easterSprite = this.physics.add.sprite(easter.x+(easter.width*0.5),easter.y + (easter.height*0.5)).setSize(easter.width,easter.height);
            this.easter.add(easterSprite);
        });


        /***ESSAI DE COLLECTIBLE**/
        this.collect = new Collect(this,1300, 5500);

        /**************INITIALISATION PLAYER AVEC SA POSITION ET SA CAMERA***************/
        this.player = new Player(this);
        this.easterEgg = map.createLayer('Easter', tileset, 0, 0);
        this.easterEgg.visible = true;

        this.monster = new Monster(this, this.player.player);
        this.saveX = this.player.player.x;
        this.saveY = this.player.player.y;
        this.monsterSpawnX = this.monster.monster.x;
        this.monsterSpawny = this.monster.monster.y;
        /**UN PEU DE MISE EN SCENE**/
        this.cameras.main.startFollow(this.monster.monster, true, 0.1,0.1, 0, 0);
        this.cameras.main.shake(3000, 0.005);
        this.time.delayedCall(2000, () => {
            this.beginning = false;
            this.cameras.main.startFollow(this.player.player,true,0.1,0.1,0,150);
        });


        /*****VFX EN VRAC*****/

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
        this.dieParticles = this.add.particles('die_particle');
        this.dieParticles.createEmitter({
            speed: 300,
            lifespan: 600,
            quantity: 50,
            rotate: {min:-90,max:90},
            scale: {start: 2, end: 0},
            alpha:{start: 1, end: 0},
            //angle: { min: -180, max: 0 },
            blendMode: 'ADD',
            on: false
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
            rotate: {min:-180,max:180},
            speedX: { min: -20, max: 20 },
            speedY: { min: -100, max: -10 },
            scale: {start: 0, end: 1},
            alpha: { start: 1, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
        };

        this.bossFX = {
            frequency:100,
            lifespan: 800,
            quantity:50,
            x:{min:-50,max:50},
            y:{min:-10,max:0},
            rotate: {min:-180, max:180},
            speedX: { min: -20, max: 20 },
            speedY: { min: -500, max: -10 },
            scale: {start: 0, end: 1},
            alpha: { start: 1, end: 0 },
            blendMode: Phaser.BlendModes.ADD,
        };

        this.bricks = this.add.particles('brick');
        this.bricks.createEmitter({
            //frequency:100,
            lifespan: 1000,
            quantity:30,
            gravityY: 1000,
            x:{min:-30,max:300},
            y:{min:-1000,max:1000},
            rotate: {min:-180,max:180},
            speedX: { min: -500, max: 500 },
            speedY: { min: -100, max: 500 },
            scale: {start: 1, end: 0},
            alpha: { start: 1, end: 0 },
            //blendMode: Phaser.BlendModes.ADD,
            on: false
        });

        /**PARALLAXE**/
        this.sky.scrollFactorX = 0;
        this.sky.scrollFactorY = 0;

        this.bg2.scrollFactorX = 0.1;
        this.bg2.scrollFactorY = 0.1;

        this.bg1.scrollFactorX = 0.15;
        this.bg1.scrollFactorY = 0.15;


        /**LANCEMENT DE L'INTERFACE**/

        this.scene.launch('HUD');


        /*****OVERLAPS ENTRE OBJECTS*****/
        //CACHE
        this.physics.add.overlap(this.player.player,this.cache, this.discover, null, this);
        this.physics.add.overlap(this.player.player,this.easter, this.bravo, null, this);
        //INTERACTIONS LADDER
        this.physics.add.overlap(this.player.player,this.ladder, this.climb.bind(this), null, this);
        this.physics.add.overlap(this.player.player,this.outLad, this.notClimb.bind(this), null, this);
        //CHECKPOINT
        this.physics.add.overlap(this.player.player,this.save, this.checkpoint, null, this);
        this.physics.add.overlap(this.player.player,this.regenerate, this.regeneration, null, this);
        this.physics.add.overlap(this.player.player,this.boss, this.finalBoss, null, this);
        //MURS
        this.physics.add.collider(this.player.player,this.wallsR);
        this.physics.add.collider(this.player.player,this.wallsB);
        this.physics.add.overlap(this.player.player,this.dive, this.diving, null, this);
        //ANTAGONISTE
        this.physics.add.collider(this.player.player, this.monster.monster, this.playerHurt, null, this);
        //COLLECTIBLES
        this.physics.add.collider(this.collect.power, this.sol);
        this.physics.add.collider(this.collect.life, this.sol);
        this.physics.add.overlap(this.player.player, this.collect.power,this.powered, null, this);
        this.physics.add.overlap(this.player.player, this.collect.life,this.healed, null, this);
        //SAFETY
        this.physics.add.overlap(this.player.player, this.safe, this.safety, null, this);

        /**INPUT MOVEMENTS**/
        this.initKeyboard();
        window.tableau = this;

    }

    bravo(){
        this.easterEgg.visible = false;
    }

    discover(){
        this.mapCache.visible = false;
    }

    climb(){
        this.player.player.onLadder = true;
        this.player.climbing = true;
        this.attacking = false;
    }
    notClimb(){
        this.player.climbing = false
        this.attacking = false;
    }
    regeneration(){
        this.player.healing = true;
    }

    checkpoint(player, save){
        this.saveX = this.player.player.x;
        this.saveY = this.player.player.y - 10;
        window.Vie += 200;
        window.Pouvoir += 200;
        console.log("current", this.saveX, this.saveY);
        this.emitFire = this.add.particles('fire_particle'); //On charge les particules à appliquer au layer
        this.emitFire.createEmitter(this.fireFX); //On crée l'émetteur
        this.emitFire.x = save.x +30;
        this.emitFire.y = save.y+15;
        this.fireParticles.emitParticleAt(save.x+30, save.y+10);
        save.body.enable = false;
    }

    powered(){
        window.HUDvisible = true;
        window.Armevisible = true;
        window.Pouvoir += this.collect.valueCollect;
        this.collect.powerParticles.emitParticleAt(this.collect.power.body.x, this.collect.power.body.y);
        this.collect.power.destroy();
    }
    healed(){
        window.HUDvisible = true;
        this.collect.lifeParticles.emitParticleAt(this.collect.life.body.x, this.collect.life.body.y);
        this.collect.life.destroy();
    }
    diving(player, dive){
        this.bricks.emitParticleAt(dive.x + 64, dive.y+10);
        dive.destroy();
    }

    playerHurt(){
        this.player.player.onLadder = false;
        this.player.climbing = false;
        this.attacking = false;
        this.player.player.body.setAllowGravity(true);
        window.Vie -= 10;
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
        window.Vie = 0;
        this.attacking = false;
        this.player.respawning = true;
        if (window.Climax === true) {
            window.MonstreVie += 3;
        }
        if (this.deathSound === true && this.player.dying === true) {
            this.deathSound = false;
            this.player.dying = false;
            console.log('MORT');
        }
        this.player.player.onLadder = false;
        this.player.climbing = false;
        this.respawnFX.emitParticleAt(this.player.player.x, this.player.player.y+50);
        this.player.player.setVisible(false);
        this.player.player.disableBody();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                window.Vie = 2000;
                window.Pouvoir = 1000;
                if (this.player.respawning === true){
                    this.player.respawning = false;
                    console.log('RESPAWN');
                }
                this.player.dying = true;
                this.respawnFX.emitParticleAt(this.player.player.x, this.player.player.y+50);
                this.player.player.enableBody();
                this.player.player.setVisible(true);
                this.player.player.body.setAllowGravity(true);
                this.player.player.x = this.saveX;
                this.player.player.y = this.saveY;
                this.player.player.play('idle', true);
            }});
    }

    safety(){
        this.player.player.x = this.saveX;
        this.player.player.y = this.saveY-100;
        this.player.player.play('idle', true);
        this.attacking = false;
    }

    finalBoss(player, boss){
        window.Climax = true;
        window.Monstrevisible = true;
        window.MonstreVie = 200;
        this.monster.monster.setScale(1.5);
        this.emitBoss = this.add.particles('bossFire'); //On charge les particules à appliquer au layer
        this.emitBoss.createEmitter(this.bossFX);
        this.emitBoss.x = boss.x +60;
        this.emitBoss.y = boss.y+15;
        boss.body.enable = false;

    }


    monsterDeath(){
        if (window.Climax === true){
            window.HUDvisible = false;
            window.Armevisible = false;
            window.Monstrevisible = false;
            this.attacking = false;
            if (this.win === true){
                this.win = false;
                this.theme.stop();
                this.victoireAudio.play();
                console.log('Victoire');
                this.cameras.main.shake(5000, 0.05);
                this.cameras.main.fade(5000, 1000, 1000, 1000);
                this.time.delayedCall(5000, () => {
                    this.victoireAudio.stop();
                    this.scene.start('victory');
                });
            }
            this.cameras.main.startFollow(this.monster.monster, true);
            this.dieParticles.emitParticleAt(this.monster.monster.x, this.monster.monster.y);
            this.monster.monster.setVisible(false);
            this.monster.monster.disableBody();
        }
        else {
            this.dieParticles.emitParticleAt(this.monster.monster.x, this.monster.monster.y);
            this.monster.monster.setVisible(false);
            this.monster.monster.disableBody();
            this.time.addEvent({
                delay: 500,
                callback: () => {
                    this.dieParticles.emitParticleAt(this.monster.monster.x, this.monster.monster.y);
                    this.monster.monster.enableBody();
                    this.monster.monster.setVisible(true);
                    this.monster.monster.x = this.monsterSpawnX;
                    this.monster.monster.y = this.monsterSpawny;
                    window.MonstreVie = 50;
                }
            });
        }
    }



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
                case Phaser.Input.Keyboard.KeyCodes.SHIFT:
                    me.player.player.x = 18400;
                    me.player.player.y = 1000;
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
                case Phaser.Input.Keyboard.KeyCodes.R:
                    me.player.switched =true;
                    break;
            }
        });
    }
    update(){
        if (this.beginning === false) {
            this.monster.monsterGestion(this.monster.monster, this.player.player);
        }
        else {
            this.monster.beginning(this.monster.monster, this.player.player);
        }


        if (window.Vie > 2000){
            window.Vie = 2000;
        }
        if (window.Pouvoir > 1000){
            window.Pouvoir = 1000;
        }
        if (window.MonstreVie >=200){
            window.MonstreVie = 200;
        }

        /**QUELQUES CONDITIONS D'ANIMATION**/

        //IDLE
        if (this.player.player.body.velocity.x === 0 && this.player.player.body.onFloor()) {
            if (this.player.attacking === true) {
                this.player.attackPlay();
            }
            else {
                this.player.player.play('idle', true);
            }
        }

        //RUN
        if (this.player.player.body.velocity.x != 0 && this.player.player.body.onFloor() && this.player.falling === true){
            if (this.player.attacking === true) {
                this.player.attackPlay();
            }
            else {
                this.player.player.play('run', true);
            }
        }
        if (this.player.player.body.onFloor() && this.player.player.body.velocity.x != 0) {
            if (this.player.attacking === true) {
                this.player.attackPlay();
            } else {
                this.player.player.play('run', true);
            }
        }
        if(this.player.player.body.velocity.y ===0){
            this.player.jumping = false;
            this.player.falling = false;
        }

        //SAUT ET GRIMPETTE

        if(this.player.climbing === true){
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
                this.player.jumping = true;
                if (this.player.attacking === true) {
                    this.player.attackPlay();
                }
                else {
                    this.player.player.play('jump', true);
                }
            }
            else if (this.player.player.body.velocity.y > 0){
                this.player.falling =true;
                if (this.player.attacking === true) {
                    this.player.attackPlay();
                }
                else {
                    this.player.player.play('fall', true);
                }

            }
        }



        /**CONDITIONS POUR GRIMPER**/
        if(this.player.player.onLadder === true)
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

            if (this.player.player.onLadder === false){
                if (this.downLad || this.upLad || this.rightLad || this.leftLad){
                    this.player.player.body.setAllowGravity(true);
                }
            }


        }

        /***CONDITION DE REGENERATION***/
        if(this.player.healing === true){
            this.player.healing = false;
            window.Vie += 4;
            window.Pouvoir += 2;
        }

        /**CONDITIONS DE VIE OU DE MORT**/
        if (window.Vie <= 0){
            this.deathSound = true;
            this.playerDeath();
        }
        if (window.MonstreVie <= 0){
            this.monsterDeath();
        }


    }
}