let gameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 2000},
            debug: false,
        },
    },
    scene: new
};
let game = new Phaser.Game(gameConfig);