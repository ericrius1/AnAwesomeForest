e.Ocean = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.water = this.world.water;
    this.mirrorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(50000, 50000, 1, 1),
      this.water.material
    );


    this.mirrorMesh.add(this.water);
    this.mirrorMesh.rotation.x = -Math.PI * 0.5;
    this.mirrorMesh.position.y = -5;
    this.game.scene.add(this.mirrorMesh);
  }

});