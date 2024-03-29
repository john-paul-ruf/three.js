var breakerModel = function (origin, angle) {
  this.origin = origin;
  this.angle = angle;
  this.blockReady = true;
  this.paddleReady = true;
};

breakerModel.prototype = function () {
  var logHit = function () {
    this.blockReady = false;
    this.paddleReady = false;


    this.blockTimer = setTimeout(() => {
    this.blockReady = true;
      clearTimeout(this.blockTimer);
    }, 10);
    this.paddelTimer = setTimeout(() => {
    this.paddleReady = true;
      clearTimeout(this.paddelTimer);
    }, 50);
  }

  var init = function (game) {
    var outerGeometry = new THREE.PlaneGeometry(game.config.breakerWidth, game.config.breakerHeight);
    var outerMaterial = new THREE.MeshBasicMaterial({ color: game.config.breakerColorOuter });
    var outerCube = new THREE.Mesh(outerGeometry, outerMaterial);

    var geometry = new THREE.PlaneGeometry(game.config.breakerWidth - 1, game.config.breakerHeight - 1);
    var material = new THREE.MeshBasicMaterial({ color: game.config.breakerColorInner });
    var cube = new THREE.Mesh(geometry, material);

    outerCube.add(cube);

    outerCube.position.set(this.origin.x, this.origin.y, this.origin.z);
    this.cube = outerCube;
    game.scene.add(outerCube);

    this.isInGame = () => { return this.cube.position.y > game.paddle.cube.position.y + game.config.paddleHeight / 2 }
  }

  this.move = function (game) {

    let intersected = false;
    _.forEach(game.blocks, b => {
      if (game.inputHandler.handleIntersection(b.cube, this.cube)) {
        if (this.blockReady) {
          this.logHit();
          game.scoreBoard.logHit();

          intersected = true;
          b.logHit(game);

          let halfWidth = (game.config.blockWidth / 2);
          let leftBreakerX = this.cube.position.x - halfWidth;
          let rightBreakerX = this.cube.position.x + halfWidth;
          let blockX = b.cube.position.x
          if (blockX > leftBreakerX && blockX < rightBreakerX) {
            this.angle.y *= -1;
          } else {
            this.angle.x *= -1;
          }
        }
      }
    });

    if (game.inputHandler.handleIntersection(this.cube, game.paddle.cube)) {

      if (this.paddleReady && this.isInGame()) {
        this.logHit();

        let halfPaddleHeight = (game.config.paddleHeight / 2) - 1;
        let halfBreakerHeight = (game.config.breakerHeight / 2);
        let breakerY = this.cube.position.y
        let paddleY = game.paddle.cube.position.y

        let breakerX = this.cube.position.x
        let paddleX = game.paddle.cube.position.x

        if (paddleY + halfPaddleHeight < breakerY - halfBreakerHeight) {
          this.angle.y *= -1;
          if (breakerX > paddleX) {
            this.angle.x = game.config.velocity;
          } else {
            this.angle.x = -game.config.velocity;
          }
        }

      }
    }



    let tempPostion = this.cube.position.clone();

    if (tempPostion.x < game.config.leftBound + game.config.breakerWidth / 2 || tempPostion.x > game.config.rightBound - game.config.breakerWidth / 2) {
      this.angle.x *= -1;
    }

    if (tempPostion.y > game.config.railSpaceHeight - game.config.breakerWidth / 2) {
      this.angle.y *= -1;
    }

    tempPostion = tempPostion.add(this.angle)

    if (tempPostion.y < game.config.bottomBound) {
      game.scoreBoard.logLoss(game);
      tempPostion = this.origin;
      this.angle = new THREE.Vector3(0, -game.config.velocity, 0);
    }

    this.cube.position.set(tempPostion.x, tempPostion.y, tempPostion.z);
  }

  return {
    logHit: logHit,
    init: init,
    move: move
  };
}();

