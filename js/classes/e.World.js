e.World = new Class({

  construct: function(options) {
    this.game = options.game;

    var groundMat = new THREE.MeshBasicMaterial({color: 0x000000});
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(50000, 50000), groundMat);
    ground.rotation.x = -Math.PI / 2;
    this.game.scene.add(ground);

    ground.castShadow = false;
    ground.receiveShadow = true;

    this.flora = new e.Flora({
      game: this.game
    });
  },

  update: function() {
    this.flora.update();
  }

});