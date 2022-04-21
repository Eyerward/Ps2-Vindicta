class Player {

    constructor(scene) {
        this.scene = scene;


        this.player = this.scene.physics.add.sprite(100, 1000, 'player');
        //Taille de la hitbox du Player
        this.player.body.setSize(this.player.width, this.player.height+20).setOffset(0, -20);

        /***Animations***/
        //WALK
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1
        });
        //IDLE
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'robo_player_0' }],
            frameRate: 10,
        });
        //JUMP
        this.scene.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'robo_player_1' }],
            frameRate: 10,
        });
        //CLIMB
        this.scene.anims.create({
            key: 'climb',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'robo_player_',
                start: 4,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'climbidle',
            frames: [{ key: 'player', frame: 'robo_player_4' }],
            frameRate: 10,
        });

        this.player.jumping = false;
        this.player.falling = false;
        this.player.climbing = false;
        this.scene.physics.add.collider(this.player, this.scene.sol);
    }



    jump(){
        this.player.play('jump', true);
        this.player.setVelocityY(-1000);
        console.log(this.player.key)
    }
    moveRight(){
        this.player.setVelocityX(300);
        this.player.setFlipX(false);
        if (this.player.body.onFloor()) {
            this.player.play('walk', true)}
    }
    moveLeft(){
        this.player.setVelocityX(-300);
        this.player.setFlipX(true);
        if (this.player.body.onFloor()) {
            this.player.play('walk', true)}
    }
    noMove(){
        this.player.setVelocityX(0);
    }

}