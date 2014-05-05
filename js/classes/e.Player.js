e.Player = new Class({

  construct: function(options){
    this.camera = options.camera;
    var geometry = new THREE.TorusGeometry(1, 0.1, 16, 50);
    this.game = options.game;
    this.camera.add(this.mesh);
  }

});