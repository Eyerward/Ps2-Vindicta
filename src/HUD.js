class HUD extends Phaser.scene {
    constructor(){
        super('HUD')
    }

    preload(){
        this.load.image('player_base', 'assets/images/ui_player.png');

    }
}