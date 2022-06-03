class Monster {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.onScreen = false;
        this.dying = true;
        this.respawning = true;


        this.monster = this.scene.physics.add.sprite(18368, 1280, 'aranea');
        this.monster.body.setAllowGravity(false);
        this.monster.setScale(1.5);
        this.monster.body.setCircle(64);
        this.monster.setFlipX(true);


        this.hurtParticles = this.scene.add.particles('die_particle');
        this.hurtParticles.createEmitter({
            speed: 300,
            lifespan: 700,
            quantity: 10,
            gravityY: 500,
            rotate: {min:-90,max:90},
            scale: {start: 1, end: 0},
            //angle: { min: -180, max: 0 },
            blendMode: 'ADD',
            on: false
        });

    }

    monsterGestion(monster, player){
        this.dist = Phaser.Math.Distance.BetweenPoints(player, monster);
        this.trackPlayer(monster, player);
        if(this.dist < 750){
            this.scream();
        }
        else{
            this.onScreen = true;
        }
    }

    scream(){
        //CRI DU MONSTRE
        //CONDITIONS POUR EVITER LA REPETITION DU SON EN CONTINU

        if (this.onScreen === true) {
            this.onScreen = false;
            this.scene.cameras.main.shake(2000, 0.005);
        }
    }

    trackPlayer(monster, player){
        if(this.dist < 750) {
            this.scene.physics.moveToObject(monster, player, 150);
        }
        else{
            this.scene.physics.moveToObject(monster, player, 400);

        }
        if (player.x < monster.x){
            monster.setFlipX(true);
        }
        else {
            monster.setFlipX(false);
        }
    }
    beginning(monster, player){
        this.scene.physics.moveToObject(monster, player, 150);
    }
}