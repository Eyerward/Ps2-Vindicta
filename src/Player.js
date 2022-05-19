class Player {

    constructor(scene/*,x,y*/) {

        this.scene = scene;

        this.life = 200;
        this.power = 0;
        this.reap = true;


        this.player = this.scene.physics.add.sprite(800, 5700, 'player');
        //Taille de la hitbox du Player
        this.player.body.setSize(this.player.width-70, this.player.height).setOffset(35, 0);

        /***Animations***/
        //RUN
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

       //JUMP
        this.scene.anims.create({
            key: 'jump',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'reagan_jump_',
                start: 0,
                end: 3,
            }),
            frameRate: 8,
            repeat: 0
        });

        //FALL
        this.scene.anims.create({
            key: 'fall',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'reagan_jump_',
                start: 3,
                end: 5,
            }),
            frameRate: 6,
            repeat: 0
        });

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

        /**VFX POTENTIELLE**/
        this.swordParticles = this.scene.add.particles('die_particle');
        this.swordParticles.createEmitter({
            speed: this.player.body.velocity.x + 500,
            lifespan: 1000,
            quantity: 20,
            alpha: 1,
            scale: {start: 1, end: 0},
            angle: 0,
            //follow: this.player,
            blendMode: 'ADD',
            on: false
        });

        /**INTERACTIONS MULTIPLES**/
        this.player.climbing = false;
        this.player.droite = true;
        this.player.charge = true;
        this.player.jumping = false;
        this.player.falling = false;
        this.player.hurt = false;
        this.scene.physics.add.collider(this.player, this.scene.sol);
    }



    jump(){
        this.player.jumping = true;
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

    attack(){
        if (this.player.charge ===true) {
            this.player.charge = false;
            new Attack(this.scene, this.player.x, this.player.y, this.player.flipX, this.player.body.velocity.x, this.reap);
            //this.scene.time.delayedCall(100,()=>{
            this.swordParticles.emitParticleAt(this.player.body.x+60, this.player.body.y+20);
            //});
            this.scene.time.delayedCall(300,()=>{
                this.player.charge = true
            });
        }
    }

    charaSwitch(){
        if (this.reap === true) {
            console.log('BLADE');
            this.reap = false;
        }
        else {
            console.log('REAP');
            this.reap = true;
        }
    }

}
