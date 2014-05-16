e.Cliff = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world
    var pathWidth = this.world.pathWidth;
    var stepHeight = 100;
    var stepDepth = 100;
    var geo = new THREE.Geometry();
    var numSteps = 2;

    for (var i = 0; i < numSteps; i++) {

      v(-pathWidth / 2, i * stepHeight, i * stepDepth);
      v(pathWidth / 2, i * stepHeight, i * stepDepth);
      v(pathWidth / 2, (i + 1) * stepHeight, i * stepDepth);
      v(-pathWidth / 2, (i + 1) * stepHeight, i * stepDepth);
      f(i * 8, i * 8 + 1, i * 8 + 2);
      f(i * 8, i * 8 + 2, i * 8 + 3);

      v(-pathWidth / 2, (i+1) * stepHeight, i * stepDepth);
      v(pathWidth / 2, (i+1) * stepHeight, i * stepDepth);
      v(pathWidth/2, (i+1) * stepHeight, (i+1) * stepDepth); 
      v(-pathWidth/2, (i+1) * stepHeight, (i+1) * stepDepth);
      f( i * 8 + 4, i * 8 + 5, i*8 + 6);
      f( i * 8 + 4, i * 8 + 6, i*8+7); 
    }

    geo.computeFaceNormals();


    var cliffMat = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xff00ff,
    });
    var cliff = new THREE.Mesh(geo, cliffMat);
    cliff.position.z = pathWidth / 2;
    this.game.scene.add(cliff);

    function v(x, y, z) {
      geo.vertices.push(new THREE.Vector3(x, y, z));

    }

    function f(a, b, c) {
      geo.faces.push(new THREE.Face3(a, b, c));
    }

  }


});