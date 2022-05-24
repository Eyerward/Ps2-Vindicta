class Monster {
    constructor(scene, player, x, y) {
        this.scene = scene;
        this.player = player;

        this.life = 100;

        this.monster = this.scene.physics.add.sprite(x, y, 'enemy_blade');
        // this.monster.body.setSize(this.monster.width, this.monster.height+50).setOffset(0, 0);
        this.monster.body.setAllowGravity(false);


    }

    trackPlayer(){
        if (this.monster.x > this.player.player.x) {
            this.monster.setVelocityX(-300);
            this.monster.setFlipX(true);
        }
        if(this.monster.x < this.player.player.x) {
            this.monster.setVelocityX(300);
            this.monster.setFlipX(false);
        }
        if(this.monster.y < this.player.player.y) {
            this.monster.setVelocityY(300);
        }
        if(this.monster.y > this.player.player.y) {
            this.monster.setVelocityY(-300);
        }

    }
}