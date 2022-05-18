class Attack {
    constructor(scene, x, y, state, vitesse) {

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

        if (state === true) {
            this.attack.setVelocityX(vitesse -1300);
        }
        else {
            this.attack.setVelocityX(vitesse + 1300);
        }

        this.scene.time.delayedCall(10000,()=>{
            this.attack.destroy()
        });

        this.scene.physics.add.collider(this.attack, this.scene.monster, function (attack,monster) {
            console.log(monster);
            attack.destroy();
            monster.destroy();
        }, null, this);
    }

}