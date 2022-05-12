class LifeCollect {
    constructor(scene/*, x, y*/) {
        this.scene = scene;

        this.lifeCollect = this.scene.physics.add.sprite(1300, 5100, 'power_collect');
        //Taille de la hitbox du collectible
        this.lifeCollect.body.setSize(this.lifeCollect.width-40, this.lifeCollect.height).setOffset(20, 20);
        this.lifeCollect.body.setBounce(0.5);

        /**Animation**/
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
        this.lifeCollect.play('wavingLife', true);
    }


}