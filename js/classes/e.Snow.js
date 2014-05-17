e.Snow = new Class({
  construct: function(options){
    this.game = options.game;
    this.world = options.world;
    this.pathLength = this.world.pathLength;
    this.createSnow();
  },

  createSnow: function(){
    this.snowGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/waterparticle.png'),
      maxAge: 50
    });

    var snowEmitter = new SPE.Emitter({
      position: new THREE.Vector3(0, 5000, 0),
      positionSpread: new THREE.Vector3(this.pathLength * 2, 100, this.pathLength *2),
      velocity: new THREE.Vector3(0, 200, 0),
      velocitySpread: new THREE.Vector3(100, 10, 100),
      acceleration: new THREE.Vector3(0, -50, 0),
      accelerationSpread: new THREE.Vector3(30, 5, 30),
      sizeStart: 50,
      sizeStartSpread: 20,
      particleCount: 30000
    });
    this.snowGroup.addEmitter(snowEmitter);
    this.snowGroup.mesh.renderDepth = -1;
    this.game.scene.add(this.snowGroup.mesh);
  },
  update: function(){
    this.snowGroup.tick();
  }
})