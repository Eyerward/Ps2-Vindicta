class PowerCollect {
    constructor(scene/*, x, y*/) {
        this.scene = scene;

        this.powerCollect = this.scene.physics.add.sprite(900, 5500, 'power_collect');
        //Taille de la hitbox du collectible
        this.powerCollect.body.setSize(this.powerCollect.width-40, this.powerCollect.height).setOffset(20, 20);
        this.powerCollect.body.setBounce(0.5);

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
        this.powerCollect.play('wavingPower', true);
    }


}