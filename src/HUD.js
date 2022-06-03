class HUD extends Phaser.Scene {
    constructor(){
        super('HUD');
    }

    preload(){
        this.load.image('player_base', 'assets/hud/ui_player.png');
        this.load.image('playerLife', 'assets/hud/player-life.png');
        this.load.image('playerPower', 'assets/hud/player-power.png');
        this.load.image('boss_base', 'assets/hud/ui_boss.png');
        this.load.image('bossLife', 'assets/hud/boss-life.png');
        this.load.image('showEnergy', 'assets/hud/energy.png');
        this.load.image('showSword', 'assets/hud/sword.png');
    }

    create(){
        this.playerL = 0;
        this.PlayerP = 0;
        this.MonsterL = 0;
        this.screenWidth = 1280;
        this.screenHeight = 720;
        this.halfScreenW = this.screenWidth/2;

        this.InterfacePlayer = this.add.container(0,0);
        this.ArmePlayer = this.add.container(0, 0);
        this.UIplayer = this.add.image(0, 10, 'player_base').setOrigin(0,0);
        this.lifeBar = this.add.image(this.UIplayer.x + 229, this.UIplayer.y + 29, 'playerLife').setOrigin(0,0);
        this.powerBar = this.add.image(this.UIplayer.x + 229, this.UIplayer.y + 85, 'playerPower').setOrigin(0,0);
        this.sword = this.add.image(this.UIplayer.x + 63, this.UIplayer.y, 'showSword').setOrigin(0,0);
        this.blade = this.add.image(this.UIplayer.x + 63, this.UIplayer.y, 'showEnergy').setOrigin(0,0);

        this.InterfacePlayer.add(this.UIplayer);
        this.InterfacePlayer.add(this.lifeBar);
        this.InterfacePlayer.add(this.powerBar);
        this.InterfacePlayer.add(this.powerBar);
        this.ArmePlayer.add(this.sword);
        this.ArmePlayer.add(this.blade);

        this.InterfacePlayer.setVisible(false);
        this.ArmePlayer.setVisible(false);


        this.InterfaceMonster = this.add.container(0,0);

        this.UImonster = this.add.image(this.halfScreenW - 325, this.screenHeight - 100, 'boss_base').setOrigin(0,0);
        this.bossBar = this.add.image(this.UImonster.x + 70, this.UImonster.y + 17, 'bossLife').setOrigin(0,0);

        this.InterfaceMonster.add(this.UImonster);
        this.InterfaceMonster.add(this.bossBar);

        this.InterfaceMonster.setVisible(false);

    }

    update(){
        this.playerL = window.Vie /2000;
        this.PlayerP = window.Pouvoir /1000;
        this.MonsterL = window.MonstreVie /200;
        this.lifeBar.setScale(this.playerL, 1);
        this.powerBar.setScale(this.PlayerP, 1);
        this.bossBar.setScale(this.MonsterL, 1);

        if(window.HUDvisible === true){
            this.InterfacePlayer.setVisible(true);
        }
        else {
            this.InterfacePlayer.setVisible(false);
        }
        if(window.Armevisible === true){
            this.ArmePlayer.setVisible(true);
        }
        else {
            this.ArmePlayer.setVisible(false);
        }

        if(window.Sword === true){
            this.sword.setVisible(true);
            this.blade.setVisible(false);
        }
        else{
            this.sword.setVisible(false);
            this.blade.setVisible(true);
        }

        if( window.Monstrevisible === true) {
            this.InterfaceMonster.setVisible(true);
        }
        else{
            this.InterfaceMonster.setVisible(false);
        }
    }
}