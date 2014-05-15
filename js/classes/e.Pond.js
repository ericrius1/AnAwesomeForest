e.Pond = new Class({
  construct: function(options) {
    this.game = options.game;
    this.water = options.water;
    var pondShape = new THREE.Shape();
    var x = 0,
      y = 0;
    pondShape.moveTo(x + 25, y + 25);
    pondShape.bezierCurveTo(x + 25, y + 25, x + 20, y, x, y);
    pondShape.bezierCurveTo(x - 30, y, x - 30, y + 35, x - 30, y + 35);
    pondShape.bezierCurveTo(x - 30, y + 55, x - 10, y + 77, x + 25, y + 95);
    pondShape.bezierCurveTo(x + 60, y + 77, x + 80, y + 55, x + 80, y + 35);
    pondShape.bezierCurveTo(x + 80, y + 35, x + 80, y, x + 50, y);
    pondShape.bezierCurveTo(x + 35, y, x + 25, y + 25, x + 25, y + 25);

    //Extrude Geometry
    var extrudeSettings = {
      amount: 1
    }; 

    var pondGeo = new THREE.CircleGeometry(50, 100);
    console.log(pondGeo.vertices.length);
    var pondMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      wireframe: true
    });
    var pond = new THREE.Mesh(pondGeo, this.water.material);
    pond.scale.x =10; 
    pond.scale.y =10; 
    pond.position.y = 1;
    pond.rotation.x = -Math.PI/2;
    pondGeo.computeBoundingBox();

    var boundingBox = pond.geometry.boundingBox;

    var position = new THREE.Vector3();
    position.subVectors(boundingBox.max, boundingBox.min);
    position.multiplyScalar(0.5);
    position.add(boundingBox.min);
    position.applyMatrix4(pond.matrixWorld);
    this.center = position;
    this.game.scene.add(pond);

  }
});