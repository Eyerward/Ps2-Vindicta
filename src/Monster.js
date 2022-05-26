class Monster {
    constructor(scene, player, x, y) {
        this.scene = scene;
        this.player = player;
        this.onScreen = false;

        this.life = 100;

        this.monster = this.scene.physics.add.sprite(x, y, 'aranea');
        // this.monster.body.setSize(this.monster.width, this.monster.height+50).setOffset(0, 0);
        this.monster.body.setAllowGravity(false);
        this.monster.body.setCircle(64);


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
            this.onScreen = false;
            console.log('SCREAMING');
        }
    }

    trackPlayer(monster, player){
        this.scene.physics.moveToObject(monster, player, 300);
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