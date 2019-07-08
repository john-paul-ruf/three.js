var utils = new utils();

var gameModel = function () {
  this.config = new config();
  this.blocks = [];
  this.document = undefined;
  this.playerReady = false;
  this.gameReady = false;
  this.gameOver = false;
  this.gameEnd = false;

  this.beginGame = function () {
    this.document.addEventListener(
      "keydown",
      event => {
        this.onKeyDown(event);
      },
      false
    );

    this.inputHandler = new inputHandler();

    this.gameElement = this.document.getElementById("game");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);

    this.camera = new THREE.OrthographicCamera(
      this.config.leftBound - this.config.gamebuffer,
      this.config.rightBound + this.config.gamebuffer,
      this.config.railSpaceHeight + this.config.gamebuffer,
      this.config.bottomBound - this.config.gamebuffer,
      0,
      1000
    );
    this.camera.position.set(0, 0, 0);
    this.camera.up = new THREE.Vector3(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.gameElement.offsetWidth - this.config.gamebuffer,
      this.gameElement.offsetHeight - this.config.gamebuffer
    );
    this.gameElement.appendChild(this.renderer.domElement);

    for (var c = 0; c < this.config.columnCount; c++) {
      for (var r = 0; r < this.config.rowCount; r++) {
        this.blocks.push(
          new blockModel(this.config.colors[utils.random(5)], r, c)
        );
      }
    }
    _.forEach(this.blocks, b => {
      b.init(this);
    });

    this.breaker = new breakerModel(
      new THREE.Vector3(
        this.config.blockSpaceWidth / 2,
        this.config.breakerStart,
        0
      ),
      new THREE.Vector3(0, -this.config.velocity, 0)
    );
    this.breaker.init(this);

    this.paddle = new paddleModel(
      new THREE.Vector3(
        this.config.blockSpaceWidth / 2,
        this.config.paddleStart,
        0
      ),
      new THREE.Vector3(0, 1, 0)
    );
    this.paddle.init(this);

    this.scoreBoard = new scoreBoard(
      {
        x: this.config.leftBound,
        y: this.config.paddleStart + this.config.railSpaceHeight,
        z: 0
      },
      this.config.numberOfLives
    );
    this.scoreBoard.init(this);

    this.rails = new rails([
      new THREE.Vector3(this.config.leftBound, this.config.bottomBound, 0),
      new THREE.Vector3(this.config.leftBound, this.config.railSpaceHeight, 0),
      new THREE.Vector3(this.config.rightBound, this.config.railSpaceHeight, 0),
      new THREE.Vector3(this.config.rightBound, this.config.bottomBound, 0)
    ]);
    this.rails.init(this);

    this.gameReady = true;
  };
};

gameModel.prototype = (function () {
  var init = function (document) {
    this.document = document;

    this.StartElement = this.document.getElementById("start");
    this.StartElement.addEventListener(
      "mousedown",
      event => {
        if (!this.playerReady) {
          this.playerReady = true;
          this.StartElement.innerText = "Pause";
        } else {
          this.playerReady = false;
          this.StartElement.innerText = "Start";
        }
      },
      false
    );

    this.beginGame();
    this.renderer.setAnimationLoop(() => {
      update(this);
      render(this);
    });
  };

  var update = function (game) {
    if (game.gameOver && !game.gameEnd) {
      game.gameEnd = true;
    }

    if (game.gameReady && game.playerReady && !game.gameOver) {
      game.breaker.move(game);
      game.paddle.move(game);
      _.forEach(game.blocks, b => {
        b.move(game);
      })
    }
  };

  var render = function (game) {
    if (game.gameReady) {
      game.renderer.render(game.scene, game.camera);
    }
  };

  var onKeyDown = function (event) {
    this.inputHandler.handleInput(event, this);
  };

  var moveToGameOver = function () {
    this.gameOver = true;
  };

  return {
    init: init,
    onKeyDown: onKeyDown,
    moveToGameOver: moveToGameOver
  };
})();
