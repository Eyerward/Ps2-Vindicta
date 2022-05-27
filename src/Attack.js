class Attack {
    constructor(scene, x, y, flip, speed, reap) {

        this.scene = scene;
        this.reap = reap;
        /**APPEL DU SPRITE D'ATTAQUE**/

        this.attack = this.scene.physics.add.sprite(x,y-30,'energy');
        this.attack.body.setSize(this.attack.width - 30, this.attack.height - 30).setOffset(15, 15);
        this.attack.body.setAllowGravity(false);

        this.scene.anims.create({
            key: 'volt',
            frames: this.scene.anims.generateFrameNames('energy', {
                prefix: 'energy_',
                start: 0,
                end: 5,
            }),
            frameRate: 16,
            repeat: -1
        });
        this.attack.play('volt', true);

        if (flip === true) {
            this.attack.setVelocityX(speed -650);
        }
        else {
            this.attack.setVelocityX(speed + 650);
        }

        if (this.reap === true){
            //this.attack.setVisible(false);
            this.scene.time.delayedCall(200,()=>{
                this.attack.destroy()
            });
        }
        else {
            //this.attack.setVisible(true);
            this.scene.time.delayedCall(1000, () => {
                this.attack.destroy()
            });
        }

        this.attackParticles = this.scene.add.particles('die_particle');
        this.attackParticles.createEmitter({
            frequency:100,
            lifespan: 500,
            quantity:50,
            gavityY: 500,
            x:{min:-30,max:300},
            y:{min:-1000,max:1000},
            rotate: {min:-10,max:10},
            speedX: { min: -500, max: 500 },
            speedY: { min: -100, max: 0 },
            scale: {start: 2, end: 0},
            alpha: { start: 1, end: 0 },
            //blendMode: Phaser.BlendModes.ADD,
            on: false
        });
        this.collideParticles = this.scene.add.particles('energy');
        this.collideParticles.createEmitter({
            speed: 300,
            lifespan: 300,
            quantity: 10,
            alpha: 1,
            gravityY: 2000,
            scale: {start: 1, end: 0},
            //angle: { min: -180, max: 0 },
            //follow: this.player,
            //blendMode: 'ADD',
            on: false
        });

        this.scene.physics.add.collider(this.attack, this.scene.sol, function (attack) {
            this.collideParticles.emitParticleAt(this.attack.x +15, this.attack.y+15);
            attack.destroy();
        }, null, this);

        this.scene.physics.add.collider(this.attack, this.scene.walls, function (attack,wall) {
            this.attackParticles.emitParticleAt(wall.x + 32, wall.y + 128);
            attack.destroy();
            wall.destroy();
        }, null, this);


        this.scene.physics.add.collider(this.attack, this.scene.monster.monster, this.monsterHurt, null, this);


    }

    monsterHurt(){
        this.attack.destroy();
        if (this.reap === true){
            this.scene.monster.life -= 10;
        }
        else if (this.reap === false){
            this.scene.monster.life -= 5;
        }

        this.scene.monster.monster.setAlpha(0.3);
        let hurt = this.scene.tweens.add({
            targets: this.scene.monster.monster,
            alpha: 1,
            tint: false,
            duration: 50,
            ease: 'Linear',
            repeat: 5,
        });
        this.scene.monster.hurtParticles.emitParticleAt(this.scene.monster.monster.x, this.scene.monster.monster.y);
        console.log(this.scene.monster.life, 'Mlife');
    }

}