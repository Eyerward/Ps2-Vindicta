let gameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#ffffff',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 3000},
            //debug: true,
        },
    },
    scene: [new scene(), new HUD()]
};
let game = new Phaser.Game(gameConfig);
window.Vie = 2000;
window.Pouvoir = 0;
window.MonstreVie = 50;
Window.Climax = false;
window.HUDvisible = false;
window.Armevisible = false;
window.Monstrevisible = false;
window.Sword = true;

