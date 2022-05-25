class Monster {
    constructor(scene, player, x, y) {
        this.scene = scene;
        this.player = player;

        this.life = 100;

        this.monster = this.scene.physics.add.sprite(x, y, 'enemy_blade');
        // this.monster.body.setSize(this.monster.width, this.monster.height+50).setOffset(0, 0);
        this.monster.body.setAllowGravity(false);


    }

    monsterGestion(monster, player){
        this.dist = Phaser.Math.Distance.BetweenPoints(player, monster);
        if(this.dist < 750){
            this.trackPlayer(monster, player);
        }
        else{
            this.idle(monster);
        }
    }

    trackPlayer(monster, player){
        this.scene.physics.moveToObject(monster, player, 300);
    }
    idle(monster){
        monster.setVelocityX(0);
        monster.setVelocityY(0);
    }
}