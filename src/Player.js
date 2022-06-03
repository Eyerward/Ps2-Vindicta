class Player {

    constructor(scene) {

        this.scene = scene;
        Sword = true;
        this.switched = true;


        this.player = this.scene.physics.add.sprite(800, 5700, 'player');
        //this.player = this.scene.physics.add.sprite(0, 0, 'player');

        //Taille de la hitbox du Player
        this.player.body.setSize(this.player.width-70, this.player.height-10).setOffset(35, 10);

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

        //ATTAQUES
        this.scene.anims.create({
            key: 'sword',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'reagan_sword_',
                start: 0,
                end: 8,
            }),
            framerate: 20,
            repeat: 1
        });
        this.scene.anims.create({
            key: 'blade',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'reagan_blade_',
                start: 0,
                end: 5,
            }),
            framerate: 20,
            repeat: 1
        });


        /**VFX MULTIPLES**/
        this.switchParticles = this.scene.add.particles('energy');
        this.switchParticles.createEmitter({
            speed: 300,
            lifespan: 500,
            quantity: 5,
            alpha: {start: 1, end: 0},
            gravityY: 1000,
            scale: {start: 1, end: 0},
            angle: { min: -180, max: 0 },
            //follow: this.player,
            blendMode: 'ADD',
            on: false
        });

        this.jumpParticles = this.scene.add.particles('fire_particle');
        this.jumpParticles.createEmitter({
            speed: 300,
            lifespan: 300,
            quantity: 5,
            alpha: 1,
            tint:0x808080,
            gravityY: 2000,
            scale: {start: 0.5, end: 0},
            angle: { min: -135, max: -45 },
            //follow: this.player,
            //blendMode: 'ADD',
            on: false
        });



        /**INTERACTIONS MULTIPLES**/
        this.player.onLadder = false;
        this.healing = false;
        this.dying = true;
        this.respawning = true;
        this.climbing = false;
        this.player.charge = true;
        this.jumping = false;
        this.falling = false;
        this.attacking = false;
        this.scene.physics.add.collider(this.player, this.scene.sol);
    }



    jump(){
        this.jumpParticles.emitParticleAt(this.player.x+10, this.player.y+50);
        this.player.setVelocityY(-1300);
    }
    moveRight(){
        this.player.setVelocityX(600);
        this.player.setFlipX(false);
    }
    moveLeft(){
        this.player.setVelocityX(-600);
        this.player.setFlipX(true);
    }
    noMove(){
        this.player.setVelocityX(0);
    }
    attackPlay(){
        if (Sword === true) {
            this.player.play('sword', true);
        }
        else{
            this.player.play('blade', true);
        }
    }

    attack(){
        if (Pouvoir > 0) {
            this.attacking = true;
            if (this.climbing === false) {
                if (this.player.charge === true) {
                    this.player.charge = false;
                    window.Pouvoir -= 20;
                    this.scene.time.delayedCall(100, () => {
                        this.hit = new Attack(this.scene, this.player.x, this.player.y, this.player.flipX, this.player.body.velocity.x);
                    });
                    this.scene.time.delayedCall(200, () => {
                        this.player.charge = true;
                    });
                    this.scene.time.delayedCall(400, () => {
                        this.attacking = false;
                    });
                }
            }
        }
    }


    charaSwitch(){
        if(this.switched === true) {
            this.switched = false;
            this.switchParticles.emitParticleAt(this.player.body.x + 29, this.player.body.y + 55);
            if (window.Sword === true) {
                console.log('BLADE');
                window.Sword = false;
            } else {
                console.log('REAP');
                window.Sword = true;
            }
        }
    }

}
