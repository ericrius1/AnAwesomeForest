e.Flowers = new Class({
  extend: e.EventEmitter,
  construct: function(options){
    var self = this;
    this.game = options.game;
    this.island = options.island;
    this.numFlowers = 100;
    var gardenGeo = new THREE.CircleGeometry(400);
    this.points = THREE.GeometryUtils.randomPointsInGeometry(gardenGeo, this.numFlowers);
    this.flowerGrowTime = 100;
    this.currentPointIndex = 0;
    this.on('growFlowers', function(){
      self.growFlowers();
    })
  },

  growFlowers: function(){
    this.growFlower();
  },

  growFlower: function(){
    //We are done growing flowers
    if(this.currentPointIndex >= this.points.length){
      return;
    }
    var self = this;
    var point = this.points[this.currentPointIndex++];
    // radiusTop, radiusBottom, height, radialSegments(8), heightSegments(1), openEnded
    var height = _.random(20, 60);
    var radiusTop = THREE.Math.randFloat(3, 5);
    var radiusBottom = THREE.Math.randFloat(1, 3);
    var flowerGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 6, 1, true);
    console.log(flowerGeo.vertices.length);
    var flowerMat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
    flowerMat.color = new THREE.Color().setRGB(Math.random(), Math.random(), Math.random());
    var flower = new THREE.Mesh(flowerGeo, flowerMat);
    flower.position.y = height/2;
    flower.position.x = point.x
    flower.position.z = point.y;
    console.log(point.z)
    this.game.scene.add(flower);

    var curScale = {s: 0.01}
    var finalScale = {s: 1}
    var growTween = new TWEEN.Tween(curScale).
      to(finalScale, this.flowerGrowTime).
      easing(TWEEN.Easing.Cubic.InOut).
      onUpdate(function(){
        flower.scale.set(curScale.s, curScale.s, curScale.s);
      }).start();
    growTween.onComplete(function(){
      flower.matrixAutoUpdate = false;
      self.growFlower();
    })



  },

  update: function(){

  }
});