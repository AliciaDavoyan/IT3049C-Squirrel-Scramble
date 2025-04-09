class mainScene {

    preload() {

        this.load.image('player', 'resources/images/placeholder/player.png');
        this.load.image('acorn', 'resources/images/placeholder/acorn.png');
        this.load.image('platform', 'resources/images/placeholder/platform.png');

    }

    create() {
        this.player = this.physics.add.sprite(100, 500, 'player');

        this.arrow = this.input.keyboard.createCursorKeys();

    }

    update() {

        // Handle horizontal movements
        if (this.arrow.right.isDown) {
            // If the right arrow is pressed, move to the right
            this.player.x += 5;
        } else if (this.arrow.left.isDown) {
            // If the left arrow is pressed, move to the left
            this.player.x -= 5;
        }
    }

}

new Phaser.Game({
    width: 700,
    height: 600,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: { default: 'arcade' },
    parent: 'game',
});
