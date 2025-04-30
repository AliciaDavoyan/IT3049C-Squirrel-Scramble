class mainScene {

    preload() {
        this.load.spritesheet("player", "resources/images/squirrel.png", {
            frameWidth: 126,
            frameHeight: 108
        });
        this.load.image('acorn', 'resources/images/acorn.png');
        this.load.image('platform', 'resources/images/platform.png');
        this.load.image('ground', 'resources/images/grass.png');
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
            const y = 140 * i; // Determines how high a platform is
            const platform = this.platforms.create(x, y, "platform");
            platform.scale = 0.5;
            const body = platform.body;
            body.updateFromGameObject();
        }

        this.ground.create(400, 700, 'ground').setScale(1.8).refreshBody();
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.ground, this.player);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
        this.cameras.main.startFollow(this.player);

        this.initialY = this.player.y; // Starting Y position (ref)
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;

        this.scoreText = this.add.text(20, 20, `Score: 0\nHigh Score: ${this.highScore}`, {
            font: '24px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0); // Text stays still

        // Game over text display (center of screen)
        this.gameOverText = this.add.text(350, 300, '', {
            font: '48px Arial',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0); // Text stays still

        // Countdown text display (center of screen)
        this.countdownText = this.add.text(350, 400, '', {
            font: '36px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0); // Text stays still
    }

    update() {
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
                platform.x = Phaser.Math.Between(-30, 750); // Randomize X
                platform.y = scrollUp - Phaser.Math.Between(50, 100);
                platform.body.updateFromGameObject();
            }
        });

        const currentScore = Math.max(this.score, Math.floor(this.initialY - this.player.y));
        if (currentScore > this.score) {
            this.score = currentScore;
            this.scoreText.setText(`Score: ${this.score}\nHigh Score: ${this.highScore}`);
        }

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            this.scoreText.setText(`Score: ${this.score}\nHigh Score: ${this.highScore}`);
        }

        // Check if player has fallen below the ground level
        if (this.player.y > 700) {
            this.gameOverText.setText('Game Over');
            this.countdownText.setText('Game will restart in 5 seconds ...');
            this.player.setActive(false).setVisible(false); // Hide player

            // Restart the game after 5 seconds
            this.time.delayedCall(5000, () => {
                this.scene.restart();
            });
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
            gravity: { y: 4000 },
            debug: false
        }
    },
    parent: 'game',
});
