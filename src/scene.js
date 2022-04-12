class scene extends Phaser.Scene {
    preload(){
        this.load.image('background', 'assets/images/background.png');
        this.load.image('diamond_blue', 'assets/images/diamond_blue.png');
        this.load.image('diamond_red', 'assets/images/diamond_red.png');
        this.load.image('enemy_blade', 'assets/images/enemy_blade.png');
        this.load.image('enemy_reap', 'assets/images/enemy_reap.png');
        this.load.image('ladder', 'assets/images/ladder.png');
        this.load.image('save_off', 'assets/images/save_off.png');
        this.load.image('save_on', 'assets/images/save_on.png');
        this.load.image('save_on', 'assets/images/save_on.png');
        //Appel du spritesheet du joueur avec sa ref JSON
        this.load.atlas('player', 'assets/images/kenney_player.png','assets/images/kenney_player_atlas.json');
    }
    create(){

    }
    update(){

    }
}