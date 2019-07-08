var config = function () {
  //Const - Could Configure
  this.colors = [
    0xFFFF00,
    0xFF00FF,
    0x0000FF,
    0x000000,
    0xFF0000,
  ];

  this.blockHightlight = 0x00FF00;

  this.railColor = 0x00FF00;

  this.paddleColorOuter = 0x00FF00;
  this.paddleColorInner = 0x000000;

  this.breakerColorOuter = 0x00FF00;
  this.breakerColorInner = 0x000000;

  this.scoreColor = 0x00FF00;

  this.playerNotificationColor = '#00FF00';

  this.colorCount = this.colors.length;
  this.rowCount = 5;
  this.columnCount = 12;

  this.blockWidth = 20;
  this.blockHeight = 3;
  this.blockBuffer = 5;

  this.velocity = 0.5;
  this.blockFallSpeed = 0.1;
  this.paddleSpeed = 0;

  this.breakerWidth = 3;
  this.breakerHeight = 2;

  this.paddleHeight = 4;
  this.paddleWidth = 30;

  this.breakerStart = -30;
  this.paddleStart = -100;

  this.railBuffer = 15;

  this.blockSpaceWidth = (this.columnCount * this.blockWidth) + (this.columnCount * this.blockBuffer);
  this.blockSpaceHeight = (this.rowCount * this.blockHeight) + (this.rowCount * (this.blockBuffer / 2));

  this.railSpaceWidth = this.blockSpaceWidth;
  this.railSpaceHeight = this.blockSpaceHeight + this.railBuffer;

  this.leftBound = -this.railBuffer - ((this.blockWidth + this.blockBuffer) / 2);
  this.rightBound = this.railSpaceWidth;
  this.bottomBound = this.paddleStart - 20;

  this.numberOfLives = 3;

  this.gamebuffer = 20;
  this.gameWidth = Math.abs(this.rightBound) + (this.leftBound) + this.gamebuffer;
  this.gameHeight = Math.abs(this.bottomBound) + (this.railSpaceHeight) + this.gamebuffer;
};

config.prototype = function () {

  return {
  };
}();