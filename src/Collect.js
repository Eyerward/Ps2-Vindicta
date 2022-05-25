class Collect {
    constructor(scene, x, y) {
        this.scene = scene;

        this.valueCollect = 10;

        this.power = this.scene.physics.add.sprite(x-60, y, 'power_collect');
        //Taille de la hitbox du collectible
        this.power.body.setSize(this.power.width-40, this.power.height).setOffset(20, 20);
        this.power.body.setBounce(0.5);

        /**Animation**/
        this.scene.anims.create({
            key: 'wavingPower',
            frames: this.scene.anims.generateFrameNames('power_collect', {
                prefix: 'collectible_',
                start: 0,
                end: 9,
            }),
            frameRate: 16,
            yoyo: true,
            repeat: -1
        });
        this.power.play('wavingPower', true);

        this.powerParticles = this.scene.add.particles('power_collect');
        this.powerParticles.createEmitter({
            speed: 100,
            lifespan: 500,
            quantity: 10,
            alpha: 0.5,
            gravityY: 800,
            scale: {start: 1, end: 0},
            angle: { min: -180, max: 0 },
            follow: this.power.collect,
            blendMode: 'ADD',
            on: false
        });
    }




}