class mainScene {

    preload() {

        this.load.spritesheet("player", "resources/images/squirrel.png", {
            frameWidth: 126,
            frameHeight: 108
        });
        this.load.image('acorn', 'resources/images/acorn.png');
        this.load.image('platform', 'resources/images/platform.png');

    }

    create() {
        this.player = this.physics.add.sprite(100, 500, 'player');

        this.arrow = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("player", {
                start: 0,
                end: 2
            }),
            frameRate: 15,
            repeat: -1
        });

        let platform = this.physics.add.staticGroup();
        platform.create(400, 568, 'platform').setScale(2).refreshbody();
        platform.create(600, 400, 'platform');
        platform.create(50, 250, 'platform');
        platform.create(750, 220, 'platform');

    }

    update() {
        if (this.arrow.right.isDown) {
            this.player.play("walk", true);
            this.player.x += 5;
            this.player.flipX = false;
        } else if (this.arrow.left.isDown) {
            this.player.play("walk", true);
            this.player.x -= 5;
            this.player.flipX = true;
        } else {
            this.player.anims.stop();
            this.player.setFrame(3);
        }
    }

}

new Phaser.Game({
    width: 700,
    height: 600,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: { 
        default: 'arcade',
        arcade: {
            gravity: { y: 300},
            debug: false
        }
     },
    parent: 'game',
});
