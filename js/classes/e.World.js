e.World = new Class({

  construct: function(options){
    this.game = options.game;

    var groundGeo = new THREE.PlaneGeometry(1000, 1000);
    var groundMesh = new THREE.Mesh(groundGeo);
    groundMesh.rotation.x = -Math.PI/2;
    this.game.scene.add(groundMesh);

    this.flora = new e.Flora({game: this.game});
  }

});