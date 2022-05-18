class Attack {
    constructor(scene, Player, x, y) {
        this.scene = scene;
        this.player = Player;
        x = this.player.player.x;
        y = this.player.player.y;

        /**APPEL DU SPRITE D'ATTAQUE**/

        this.attack = this.scene.physics.add.sprite(x, y, 'energy');
        this.attack.body.setSize(this.attack.width - 30, this.attack.height - 30).setOffset(15, 15);

    }
}