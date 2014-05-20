e.Landscape = new Class({
  extend: e.EventEmitter,

  construct: function(islandRadius, options) {
    var self = this;
    this.game = options.game;
    this.on('snowStarting', function(){
      self.snowCover();
    });

    this.summerGroundColor = new THREE.Color(0x3f3f17);
    this.winterGroundColor = new THREE.Color(0x9c9c9c);
    var groundMat = new THREE.MeshBasicMaterial({
      color: this.summerGroundColor,
      side: THREE.DoubleSide
    });

    var islandGeo = new THREE.CircleGeometry(islandRadius, 100);
    this.ground = new THREE.Mesh(islandGeo, groundMat);
    //pick a point in the distance to create a hill
    var point = new THREE.Vector2(3000, 0);

    this.ground.rotation.x = -Math.PI / 2;
    this.game.scene.add(this.ground);

  },

  snowCover: function() {
    console.log('cover!!!!');
    var curColor = this.ground.material.color;
    var grountTween = new TWEEN.Tween(curColor).
    to(this.winterGroundColor, 10000).
    easing(TWEEN.Easing.Cubic.InOut).
    delay(2000).
    start();
  },

  snowMelt: function() {
    var curColor = this.ground.material.color;
    var grountTween = new TWEEN.Tween(curColor).
    to(this.summerGroundColor, this.game.yearTime * .1).start();

  }

});