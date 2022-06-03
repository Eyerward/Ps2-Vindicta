class UI extends Phaser.scene {
    constructor() {
        super('UI');
    }

    preload(){
        this.load .image('ui_base', 'assets/images/ui_player.png')
    }
}