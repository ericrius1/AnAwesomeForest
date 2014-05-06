e.Flora = new Class({
  construct: function(options){
    var self = this;
    this.game = options.game;
    var extrudePath = new THREE.SplineCurve3([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0), new THREE.Vector3(10, 10, 0)
    ]);
    var geo = new THREE.TubeGeometry(extrudePath, 10);
    var mesh = new THREE.Mesh(geo);
    this.game.scene.add(mesh);

    extrudePath = new THREE.SplineCurve3([
      new THREE.Vector3(0, 10, 0), new THREE.Vector3(-10, 10, 0)
    ]);
    geo = new THREE.TubeGeometry(extrudePath)
    mesh = new THREE.Mesh(geo);
    this.game.scene.add(mesh)
  }
});