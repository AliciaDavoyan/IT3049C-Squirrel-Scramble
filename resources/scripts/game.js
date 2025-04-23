class mainScene {

    preload() {

        this.load.spritesheet("player", "resources/images/squirrel.png", {
            frameWidth: 126,
            frameHeight: 108
        });
        this.load.image('acorn', 'resources/images/acorn.png');
        this.load.image('platform', 'resources/images/platform.png');
        this.load.image('ground', 'resources/images/placeholder/ground.png');
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
        this.ground = this.physics.add.staticGroup();

        for (let i = 0; i < 12; i++) {
          const x = Phaser.Math.Between(-30, 750);
          const y = 140 * i; //Determines how high a platform is
          const platform = this.platforms.create(x, y, "platform");
          platform.scale = 0.5;
          const body = platform.body;
          body.updateFromGameObject();
        }

        this.ground.create(400, 700, 'ground');
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.ground, this.player); //NOTE: Can't have more than two objects using the same collider
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
        this.cameras.main.startFollow(this.player);
    }

    update() {
        //Means player is touching top of platform
        const onPlatform = this.player.body.touching.down;
        
        if (this.arrow.right.isDown) {
            this.player.play("walk", true);
            this.player.x += 5;
            this.player.flipX = false;
        } else if (this.arrow.left.isDown) {
            this.player.play("walk", true);
            this.player.x -= 5;
            this.player.flipX = true;
        } else if (this.arrow.up.isDown && onPlatform) {
            this.player.setVelocityY(-1500);
        } else {
            this.player.anims.stop();
            this.player.setFrame(3);
        }

        this.platforms.children.iterate(child => {
            const platform = child;
            const scrollUp = this.cameras.main.scrollY;
            if (platform.y >= scrollUp + 650) {
              platform.y = scrollUp - Phaser.Math.Between(50, 100);
              platform.body.updateFromGameObject();
            }
          });
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
            gravity: { y: 4000},
            debug: false
        }
     },
    parent: 'game',
});
