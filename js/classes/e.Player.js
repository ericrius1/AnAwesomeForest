e.Player = new Class({

  construct: function(options) {
    this.camera = options.camera;
    this.center = new THREE.Vector3(0, 0, 0);
    this.controls = options.controls.controls;
    var geometry = new THREE.TorusGeometry(1, 0.1, 16, 50);
    this.game = options.game;
    this.camera.position = options.position.clone();
    // this.controls.teleport(new THREE.Vector3(0, this.camera.position.y, 1000))
  },

  update: function() {
    var worldCoord = this.camera.localToWorld(new THREE.Vector3(0, 0, 0));
    if (worldCoord.distanceTo(this.center) > 5000) {
      // this.controls.teleport(new THREE.Vector3(0, 4500, 0)); 
    }
  }
});