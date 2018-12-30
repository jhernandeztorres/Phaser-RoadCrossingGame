// create a new scene
let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function () {
  // player speed
  this.playerSpeed = 3;

  // enemy speed
  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 4;

  // boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;

  // not terminating
  isTerminating = false;
}

// load assets
gameScene.preload = function () {
  // load images
  this.load.image('background', 'assets/images/background.png');
  this.load.image('player', 'assets/images/player.png');
  this.load.image('enemy', 'assets/images/dragon.png');
  this.load.image('goal', 'assets/images/treasure.png');
};

// called once after the preload ends
gameScene.create = function () {

  // create background sprite
  let bg = this.add.sprite(0, 0, 'background');

  // set top-left as origin point
  bg.setOrigin(0, 0);

  // create player
  this.player = this.add.sprite(35, 180, 'player');

  this.player.setScale(0.5);

  // goal
  this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');
  this.goal.setScale(0.5);

  // enemy
  this.enemies = this.add.group({ // code to add groups
    key: 'enemy', // name from preload
    repeat: 5, // how many are going to be added
    setXY: { // setting the groups positions
      x: 90,
      y: 100,
      stepX: 86,
      stepY: 20, // distance from the previous 
    }
  });

  // Set scale to all group elements
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

  // set flipx and speed
  Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {

    // flip enemy
    enemy.flipX = true;

    // set enemy speed
    let dir = Math.random() < 0.5 ? 1 : -1;
    let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
    enemy.speed = dir * speed;

  }, this);
}

// update command that refreshes at 60 frames per second
gameScene.update = function () {

  // check for active input
  if (this.input.activePointer.isDown) {
    // player walks
    this.player.x += this.playerSpeed;
  }

  // check treasure overlap
  let playerRect = this.player.getBounds();
  let treasureRect = this.goal.getBounds();

  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
    console.log("Goal reached!");
    // end game
    return this.gameOver();
  }

  // get enemies
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for (let i = 0; i < numEnemies; i++) {
    // enemy movement
    enemies[i].y += enemies[i].speed;

    let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
    let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

    // enemy movement
    if (conditionUp || conditionDown) {
      enemies[i].speed *= -1;
    }

    // check enemy overlap
    let enemyRect = enemies[i].getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
      console.log("Game Over!");
      
      return this.gameOver();
    }
  }
}

gameScene.gameOver = function(){
  // initiated game over sequence
  this.isTerminating = true;
  // camera shake
  this.cameras.main.shake(500);
  // 
  this.cameras.main.on('camerashakecomplete', function(camera, effect){
  // camera fade
  this.cameras.main.fade(500);
  }, this);
  // 
  this.cameras.main.on('camerafadeoutcomplete', function(camera, effect){
    // restart the scene
    this.scene.restart();
  }, this);
  
};

// set the configuration of the game
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};
// create a new game, pass the configuration
let game = new Phaser.Game(config);