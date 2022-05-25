class Special {
    constructor(scene, x, y) {
        this.scene = scene;
        this.larg = 1300;
        this.haut = 800;

        this.special = this.scene.physics.add.sprite(x, y - 150).setSize(this.larg, this.haut);
        this.special.body.setAllowGravity(false);
        this.special.setImmovable(true);

        this.scene.time.delayedCall(1000,()=>{
            this.special.destroy()
        });
    }
}