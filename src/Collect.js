class Collect {
    constructor(scene/*, x, y*/) {
        this.scene = scene;

        this.collect = this.scene.physics.add.sprite(1100, 5500, 'power_collect');
        //Taille de la hitbox du collectible
        this.collect.body.setSize(this.collect.width-40, this.collect.height).setOffset(20, 20);
        this.collect.body.setBounce(0.5);

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
        this.collect.play('wavingPower', true);
    }


}