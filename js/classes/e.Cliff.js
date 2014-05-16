e.Cliff = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world
    var pathWidth = this.world.pathWidth;
    var stepHeight = 100;
    var stepDepth = 100;
    var geo = new THREE.Geometry();
    

    v(-pathWidth/2, 0, 0);
    v(pathWidth/2, 0, 0)
    v(pathWidth/2, stepHeight, 0)
    v(-pathWidth/2, stepHeight, 0)
    f(0,1,2);
    f(0,2,3);

    v(-pathWidth/2, stepHeight, 0);
    v(pathWidth/2, stepHeight, 0);
    v(pathWidth/2, stepHeight, stepDepth);
    v(-pathWidth/2, stepHeight, stepDepth);
    f(4, 5, 6);
    f(4, 6, 7);

    var cliffMat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
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