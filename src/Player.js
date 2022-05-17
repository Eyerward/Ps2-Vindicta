class Player {

    constructor(scene/*,x,y*/) {

        this.scene = scene;

        this.life = 20;
        this.power = 0;


        this.player = this.scene.physics.add.sprite(600, 5700, 'player');
        //Taille de la hitbox du Player
        this.player.body.setSize(this.player.width-70, this.player.height).setOffset(35, 0);

        /***Animations***/
        //WALK
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'reagan_run_',
                start: 0,
                end: 9,
            }),
            frameRate: 16,
            repeat: -1
        });
        //IDLE
        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 'reagan_idle' }],
            frameRate: 10,
        });
       /** //JUMP
        this.scene.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 'robo_player_1' }],
            frameRate: 10,
        });**/
        //CLIMB
        this.scene.anims.create({
            key: 'climbUp',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'reagan_climb_',
                start: 0,
                end: 7,
            }),
            frameRate: 16,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'climbDown',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'reagan_climb_',
                start: 7,
                end: 0,
            }),
            frameRate: 16,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'climbidle',
            frames: [{ key: 'player', frame: 'reagan_climb_0' }],
            frameRate: 10,
        });

        /**INTERACTIONS MULTIPLES**/
        this.player.climbing = false;
        this.player.droite = true;
        this.scene.physics.add.collider(this.player, this.scene.sol);
    }



    jump(){
        this.player.setVelocityY(-1300);
    }
    moveRight(){
        this.player.droite = true;
        this.player.setVelocityX(600);
        this.player.setFlipX(false);
        if (this.player.body.onFloor()) {
            this.player.play('run', true)}
    }
    moveLeft(){
        this.player.droite = false;
        this.player.setVelocityX(-600);
        this.player.setFlipX(true);
        if (this.player.body.onFloor()) {
            this.player.play('run', true)}
    }
    noMove(){
        this.player.setVelocityX(0);
    }

}
