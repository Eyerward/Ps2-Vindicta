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
        //Appel de la map Tiled et de ses tuiles
        this.load.image('tiles','assets/tileset/platformPack_tilesheet.png')
        this.load.tilemapTiledJSON('tryout','assets/maps/tryout.json');
    }
    create(){

        /**PRESETS**/
            //BG et Map
        const backgroundImage = this.add.image(0, 500,'background').setOrigin(0, 0);
        backgroundImage.setScale(3, 1.5);

        const map = this.make.tilemap({ key: 'tryout' });
        const tileset = map.addTilesetImage('kenney_tryout', 'tiles');
        const platforms = map.createStaticLayer('Platforms', tileset, 0, -1000);


        this.player = this.physics.add.sprite(100, 1000, 'player');
        //Taille de la hitbox du Player
        this.player.body.setSize(this.player.width-20, this.player.height-20).setOffset(10, 20);
        //this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(false);

        this.cameras.main.startFollow(this.player,true,1,1,-100,0)

        //COLLISIONS
        this.sol = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('Collisions').objects.forEach((sol) => {
            const solSprite = this.physics.add.sprite(sol.x+(sol.width*0.5),sol.y + (sol.height*0.5)-1000).setSize(sol.width,sol.height);
            this.sol.add(solSprite);
        });
        this.physics.add.collider(this.player, this.sol);

    }
    update(){

    }
}