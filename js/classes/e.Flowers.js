e.Flowers = new Class({
  extend: e.EventEmitter,
  construct: function(options){
    var self = this;
    this.game = options.game;
    this.island = options.island;
    this.points = THREE.GeometryUtils.randomPointsInGeometry(this.island.geometry, 10);
    this.currentPointIndex = 0;
    this.on('growFlowers', function(){
      self.growFlowers();
    })
  },

  growFlowers: function(){
    this.growFlower();
  },

  growFlower: function(){
    var self = this;
    var point = this.points[this.currentPointIndex++];
    // radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded
    var height = 40;
    var flowerGeo = new THREE.CylinderGeometry(2, 5, height);
    var flowerMat = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
    var flower = new THREE.Mesh(flowerGeo, flowerMat);
    flower.position.y = height/2;
    flower.position.x = point.x
    flower.position.z = point.z;
    this.game.scene.add(flower);

    // var curScale = {s: 0.01}
    // var finalScale = {s: 1}
    // var growTween = new TWEEN.Tween(curScale).
    //   to(finalScale, 5000).
    //   easing(TWEEN.Easing.Cubic.InOut).
    //   onUpdate(function(){
    //     flower.scale.set(curScale.s, curScale.s, curScale.s);
    //   }).start();



  },

  update: function(){

  }
});