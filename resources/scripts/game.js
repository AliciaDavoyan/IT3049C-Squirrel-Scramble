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

        this.platforms = this.physics.add.staticGroup();

        for (let i = 0; i < 5; i++) {
          const x = Phaser.Math.Between(80, 400);
          const y = 150 * i;
    
          /** @type {Phaser.Physics.Arcade.Sprite} */
          const platform = this.platforms.create(x, y, "platform");
          platform.scale = 0.5;
    
          /** @type {Phaser.Physics.Arcade.StaticBody} */
          const body = platform.body;
          body.updateFromGameObject();
        }

        this.physics.add.collider(this.platforms, this.player);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
    

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
        } else if (this.arrow.up.isDown) {
            this.player.setVelocityY(-400);
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
            gravity: { y: 500},
            debug: false
        }
     },
    parent: 'game',
});
