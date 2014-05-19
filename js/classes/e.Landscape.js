e.Landscape = new Class({
  construct: function(pathWidth, pathLength, options) {
    this.game = options.game;

    this.summerGroundColor = new THREE.Color(0x136e1e);
    this.winterGroundColor = new THREE.Color(0xf0f0f0);
    var groundMat = new THREE.MeshBasicMaterial({
      color: this.summerGroundColor,
      side: THREE.DoubleSide
    });

    var islandGeo = new THREE.CircleGeometry(10000);
    //path length and width is where shit goes, the rest is rolling hills
    // this.ground = new THREE.Mesh(new THREE.PlaneGeometry(pathWidth * 5, pathLength, 500, 1), groundMat);
    this.ground = new THREE.Mesh(islandGeo, groundMat);
    //pick a point in the distance to create a hill
    var point = new THREE.Vector2(3000, 0);

    this.ground.rotation.x = -Math.PI / 2;
    this.game.scene.add(this.ground);

  },

  snowCover: function() {
    var curColor = this.ground.material.color;
    var grountTween = new TWEEN.Tween(curColor).
    to(this.winterGroundColor, this.game.yearTime * .1).
    delay(2000).start();
  },

  snowMelt: function() {
    var curColor = this.ground.material.color;
    var grountTween = new TWEEN.Tween(curColor).
    to(this.summerGroundColor, this.game.yearTime * .1).
    delay(2000).start();

  }

});