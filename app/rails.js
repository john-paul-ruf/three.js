var rails = function (points) {
  this.points = points
};

rails.prototype = function () {
  var init = function (game) {
    var material = new THREE.LineBasicMaterial({
      color: game.config.railColor
    });

    var geometry = new THREE.Geometry();

    for (let i = 0; i < this.points.length; i++) {
      geometry.vertices.push(this.points[i]);
    }
    this.cube = new THREE.Line(geometry, material);
    game.scene.add(this.cube);
  }
  return {
    init: init
  };
}();