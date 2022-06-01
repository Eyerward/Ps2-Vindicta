class Collect {
    constructor(scene, x, y) {
        this.scene = scene;

        this.valueCollect = 200;

        this.power = this.scene.physics.add.sprite(x-60, y, 'power_collect');
        //Taille de la hitbox du collectible
        this.power.body.setSize(this.power.width-40, this.power.height).setOffset(20, 20);
        this.power.body.setBounce(0.5);

        this.life = this.scene.physics.add.sprite(x+60, y, 'life_collect');
        //Taille de la hitbox du collectible
        this.life.body.setSize(this.life.width-40, this.life.height).setOffset(20, 20);
        this.life.body.setBounce(0.5);

        /**Animations**/
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

        this.scene.anims.create({
            key: 'wavingLife',
            frames: this.scene.anims.generateFrameNames('life_collect', {
                prefix: 'collectible_',
                start: 0,
                end: 9,
            }),
            frameRate: 16,
            yoyo: true,
            repeat: -1
        });
        this.life.play('wavingLife', true);


        /**VFX**/
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
        this.lifeParticles = this.scene.add.particles('life_collect');
        this.lifeParticles.createEmitter({
            speed: 100,
            lifespan: 500,
            quantity: 10,
            alpha: 0.5,
            gravityY: 800,
            scale: {start: 1, end: 0},
            angle: { min: -180, max: 0 },
            follow: this.life.collect,
            blendMode: 'ADD',
            on: false
        });
    }




}