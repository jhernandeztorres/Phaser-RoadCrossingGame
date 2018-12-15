// create a new scene
let gameScene = new Phaser.Scene('Game');

// initiate scene parameters
gameScene.init = function(){
  // player speed
  this.playerSpeed = 3;

  // enemy speed
  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 4;

  // boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;
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
  gameScene.create = function(){
    
    // create background sprite
    let bg = this.add.sprite(0, 0, 'background');
    
    // set top-left as origin point
    bg.setOrigin(0,0);
    
    // create player
    this.player = this.add.sprite(35,180, 'player');

    this.player.setScale(0.5);

    // goal
    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');
    this.goal.setScale(0.5);

    // enemy
    this.enemies = this.add.group({   // code to add groups
      key: 'enemy',                   // name from preload
      repeat: 5,                      // how many are going to be added
      setXY: {                        // setting the groups positions
        x: 90,
        y: 100,
        stepX: 75,                    
        stepY: 20,                    // distance from the previous 
      }
    });

    // 
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

    // set speed and flip to true
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
      // flipx
      enemy.flipX = true;
    }, this);

    // set enemy speed
    let dir = Math.random() < 0.5 ? 1 : -1;
    let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
    this.enemy.speed = dir * speed;
  }

  // update command that refreshes at 60 frames per second
  gameScene.update = function(){
    
    // check for active input
    if (this.input.activePointer.isDown){
      // player walks
      this.player.x += this.playerSpeed;
    }

    // check treasure overlap
    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)){
      console.log("Goal reached!");
      this.scene.restart();
      return;
    }

    // enemy movement
    this.enemy.y += this.enemy.speed;


    let conditionUp = this.enemy.speed < 0 && this.enemy.y <= this.enemyMinY;
    let conditionDown = this.enemy.speed > 0 && this.enemy.y >= this.enemyMaxY;

    // enemy movement
    if(conditionUp || conditionDown){
      this.enemy.speed *= -1;
    }

  }

// set the configuration of the game
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
};
// create a new game, pass the configuration
let game = new Phaser.Game(config);
