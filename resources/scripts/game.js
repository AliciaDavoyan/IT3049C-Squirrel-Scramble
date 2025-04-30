class mainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'mainScene' });
    }

    preload() {
        this.load.spritesheet("player", "resources/images/squirrel.png", {
            frameWidth: 126,
            frameHeight: 108
        });
        this.load.image('acorn', 'resources/images/acorn.png');
        this.load.image('platform', 'resources/images/platform.png');
        this.load.image('ground', 'resources/images/grass.png');
        this.load.image('dayBackground', 'resources/images/dayBackground.png');
        this.load.image('nightBackground', 'resources/images/nightBackground.png');
    }

    create() {
        // Fetch current time from worldtimeapi.org
        fetch('http://worldtimeapi.org/api/timezone/Etc/UTC')
            .then(response => response.json())
            .then(data => {
                // Extract hours from the datetime field (e.g., "2025-04-30T22:16:00.123456+00:00")
                const dateTime = new Date(data.datetime);
                const hours = dateTime.getUTCHours(); // Use UTC hours

                // Set background based on time (6 AM to 6 PM = day, else night)
                if (hours >= 6 && hours < 18) {
                    this.add.image(350, 300, 'dayBackground').setScale(2).setDepth(-1);
                } else {
                    this.add.image(350, 300, 'nightBackground').setScale(2).setDepth(-1);
                }
            })
            .catch(error => {
                console.error('Error fetching time:', error);
                // Fallback to local time if API fails
                const localHours = new Date().getHours();
                if (localHours >= 6 && localHours < 18) {
                    this.add.image(350, 300, 'dayBackground').setScale(2).setDepth(-1);
                } else {
                    this.add.image(350, 300, 'nightBackground').setScale(2).setDepth(-1);
                }
            });

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
            const x = Phaser.Math.Between(0, 600);
            const y = 140 * i; // Determines how high a platform is
            const platform = this.platforms.create(x, y, "platform");
            platform.scale = 0.5;
            const body = platform.body;
            body.updateFromGameObject();
        }

        this.ground.create(200, 600, 'ground');
        this.ground.create(500, 600, 'ground');
        this.physics.add.collider(this.platforms, this.player);
        this.physics.add.collider(this.ground, this.player);
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;

        this.initialY = this.player.y; // Starting Y position (ref)
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;

        this.scoreText = this.add.text(20, 20, `Score: 0\nHigh Score: ${this.highScore}`, {
            font: '24px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
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

        const playerY = this.player.y;

        if (playerY < 300) {
            const offset = 300 - playerY;
            this.player.y += offset;

            this.platforms.children.iterate(child => {
                const platform = child;
                platform.y += offset;
                platform.body.updateFromGameObject();
            });

            this.ground.children.iterate(child => {
                const ground = child;
                ground.y += offset;
                ground.body.updateFromGameObject();
            });

            this.score += Math.floor(offset / 10);
        }

        this.platforms.children.iterate(child => {
            const platform = child;
            const scrollUp = this.cameras.main.scrollY;
            if (platform.y >= scrollUp + 650) {
                platform.y = scrollUp - Phaser.Math.Between(50, 100);
                platform.body.updateFromGameObject();
            }
        });

        if (this.player.y > 600) {
            this.scene.start('GameOverScene');
        }

        this.scoreText.setText(`Score: ${this.score}\nHigh Score: ${this.highScore}`);

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            this.scoreText.setText(`Score: ${this.score}\nHigh Score: ${this.highScore}`);
        }
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.add.text(350, 200, 'Game Over!', {
            fontSize: '40px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        const restartButton = this.add.text(350, 300, 'Restart', {
            fontSize: '30px',
            fill: '#fff',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('mainScene');
        });
    }
}

new Phaser.Game({
    width: 700,
    height: 600,
    backgroundColor: '#3498db',
    scene: [mainScene, GameOverScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 4000 },
            debug: false
        }
    },
    parent: 'game',
});
