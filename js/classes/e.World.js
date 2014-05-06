e.World = new Class({

  construct: function(options) {
    this.game = options.game;

    var mat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});

    var groundGeo = new THREE.PlaneGeometry(100, 100);
    var groundMesh = new THREE.Mesh(groundGeo);
    groundMesh.rotation.x = -Math.PI / 2;
    this.game.scene.add(groundMesh);

    mat.color.setRGB(Math.random(), Math.random(), Math.random());
    groundMesh = new THREE.Mesh(groundGeo, mat);
    groundMesh.position.z = -50;
    this.game.scene.add(groundMesh);

    mat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
    mat.color.setRGB(Math.random(), Math.random(), Math.random());
    groundMesh = new THREE.Mesh(groundGeo, mat);
    groundMesh.position.x = 50;
    groundMesh.rotation.y = Math.PI/2;
    this.game.scene.add(groundMesh);

    this.flora = new e.Flora({
      game: this.game
    });
  },

  update: function() {
    this.flora.update();
  }

});