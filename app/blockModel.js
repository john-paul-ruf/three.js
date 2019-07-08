var blockModel = function (color, row, column) {
  this.enabled = true;
  this.hexColor = color;
  this.column = column;
  this.row = row;
};

blockModel.prototype = (function () {
  var init = function (game) {
    var outerGeometry = new THREE.PlaneGeometry(
      game.config.blockWidth,
      game.config.blockHeight
    );
    var outerMaterial = new THREE.MeshBasicMaterial({
      color: game.config.blockHightlight
    });
    var outerCube = new THREE.Mesh(outerGeometry, outerMaterial);

    var geometry = new THREE.PlaneGeometry(
      game.config.blockWidth - 1,
      game.config.blockHeight - 1
    );
    var material = new THREE.MeshBasicMaterial({ color: this.hexColor });
    var cube = new THREE.Mesh(geometry, material);

    outerCube.add(cube);

    outerCube.position.set(
      this.column * game.config.blockWidth +
      this.column * game.config.blockBuffer,
      this.row * game.config.blockHeight +
      this.row * (game.config.blockBuffer / 2),
      0
    );
    this.cube = outerCube;
    game.scene.add(outerCube);
  };

  var move = function (game) {
    if (this.cube.visible && this.row === 0) {
      this.cube.position.y -= game.config.blockFallSpeed;

      if (this.cube.position.y < game.config.bottomBound) {
        this.cube.position.set(
          this.column * game.config.blockWidth +
          this.column * game.config.blockBuffer,
          this.row * game.config.blockHeight +
          this.row * (game.config.blockBuffer / 2),
          0
        );
      }
    }
  };

  var logHit = function (game) {
    this.cube.visible = false;
    this.cube.position.set(
      this.column * game.config.blockWidth +
      this.column * game.config.blockBuffer,
      this.row * game.config.blockHeight +
      this.row * (game.config.blockBuffer / 2),
      0
    );

    this.timeoutSet = setTimeout(() => {
      this.cube.visible = true;
      clearTimeout(this.timeoutSet);
    }, 3000);
  };

  return {
    init: init,
    move: move,
    logHit: logHit
  };
})();
