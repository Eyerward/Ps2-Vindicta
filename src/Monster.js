class Monster {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.onScreen = false;
        this.finalFight = false;

        this.life = 100;

        this.monster = this.scene.physics.add.sprite(18368, 1280, 'aranea');
        // this.monster.body.setSize(this.monster.width, this.monster.height+50).setOffset(0, 0);
        this.monster.body.setAllowGravity(false);
        this.monster.body.setCircle(64);

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
        if(this.dist < 750){
            this.scream();
        }
        else{
            this.onScreen = true;
        }
        this.trackPlayer(monster, player);
    }

    scream(){
        //CRI DU MONSTRE
        //CONDITIONS POUR EVITER LA REPETITION DU SON EN CONTINU

        if (this.onScreen === true) {
            this.scene.cameras.main.shake(2000, 0.005);
            this.onScreen = false;
        }
    }

    trackPlayer(monster, player){
        this.scene.physics.moveToObject(monster, player, 150);
        if (player.x < monster.x){
            monster.setFlipX(true);
        }
        else {
            monster.setFlipX(false);
        }
    }
    idle(monster){
        monster.setVelocityX(0);
        monster.setVelocityY(0);
    }
}