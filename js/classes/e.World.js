e.World = new Class({

  construct: function(options) {
    this.game = options.game;

    var groundMat = new THREE.MeshBasicMaterial({
      color: 0xff00ff
    });
    var pathLength = 50000;
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(5000, pathLength), groundMat);
    ground.position.z -= pathLength/2;
    ground.rotation.x = -Math.PI / 2;
    this.game.scene.add(ground);

    ground.castShadow = false;
    ground.receiveShadow = true;


    this.player = new e.Player({
      game: this,
      camera: this.game.camera,
      position: new THREE.Vector3(0, 100, 0)
    });

    this.flora = new e.Flora({
      game: this.game
    });
  },

  update: function() {
    this.flora.update();
  }

});