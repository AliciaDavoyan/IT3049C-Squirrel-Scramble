class mainScene {

    preload() {

        this.load.image('player', 'resources/images/placeholder/player.png');
        this.load.image('acorn', 'resources/images/placeholder/acorn.png');
        this.load.image('platform', 'resources/images/placeholder/platform.png');

    }

    create() {
        
    }

    update() {

    }
    
}

new Phaser.Game({
    width: 700,
    height: 400,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: { default: 'arcade' },
    parent: 'game',
});
