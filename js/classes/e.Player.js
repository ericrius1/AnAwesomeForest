e.Player = new Class({

  construct: function(options){
    this.camera = options.camera;
    var geometry = new THREE.TorusGeometry(4, 1, 16, 100);
    this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xff00ff}));
    this.game = options.game;
    this.camera.add(this.mesh);
    this.mesh.position.z -= 30;
  }

});