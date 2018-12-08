// create a new scene
let gameScene = new Phaser.Scene('Game');

// load assets
gameScene.preload = function () {
    // load images
    this.load.image('background', 'assets/images/background.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('enemy', 'assets/images/dragon.png');
    this.load.image('goal', 'assets/images/treasure.png');
  };

  // called once after the preload ends
  gameScene.create = function(){
      // create background sprite
      this.add.sprite(0, 0, 'background');
  }

// set the configuration of the game
let config = {
    type: Phaser.Auto,
    width: 640,
    height: 360,
    scene: gameScene
};
// create a new game, pass the configuration
let game = new Phaser.Game(config);
