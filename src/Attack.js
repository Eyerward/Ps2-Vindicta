class Attack {
    constructor(scene, x, y, flip, speed, reap) {

        this.scene = scene;

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

        if (reap === true){
            this.scene.time.delayedCall(200,()=>{
                this.attack.destroy()
            });
        }
        else {
            this.scene.time.delayedCall(1000, () => {
                this.attack.destroy()
            });
        }

        this.powerParticles = this.scene.add.particles('power_collect');
        this.powerParticles.createEmitter({
            speed: 150,
            lifespan: 500,
            quantity: 10,
            alpha: 0.5,
            gravity: {x: 1000, y: 10000},
            scale: {start: 1, end: 0},
            angle: { min: -180, max: 0 },
            follow: this.collect.collect,
            //blendMode: 'ADD',
            on: false
        });
        

        this.scene.physics.add.collider(this.attack, this.scene.monster, function (attack,monster) {
            attack.destroy();
            monster.destroy();
        }, null, this);
    }

}