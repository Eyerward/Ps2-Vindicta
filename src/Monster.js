class Monster {
    constructor(scene, x, y) {
        this.scene = scene;

        this.life = 100;

        this.monster = this.scene.physics.add.sprite(x, y, 'enemy_blade');
    }
}