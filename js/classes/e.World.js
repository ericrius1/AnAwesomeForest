e.World = new Class({

  construct: function(options) {
    this.game = options.game;
    var maxAnisotropy = this.game.renderer.getMaxAnisotropy();
    var texture = THREE.ImageUtils.loadTexture("assets/grass.jpg");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(512, 512);
    texture.anistropy = maxAnisotropy;

    var groundBasic = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      map: texture
    });
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(50000, 50000), groundBasic);
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