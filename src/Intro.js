class Intro extends Phaser.Scene{
    constructor() {
        super('intro');
    }

    create(){
        window.Vie = 2000;
        window.Pouvoir = 0;
        window.MonstreVie = 50;
        Window.Climax = false;
        window.HUDvisible = false;
        window.Armevisible = false;
        window.Monstrevisible = false;
        window.Sword = true;

        this.scene.start('menu');
    }
}