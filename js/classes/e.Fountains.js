e.Fountains = new Class({
  construct: function(options){
    this.game = options.game;
    this.world = options.world;

    this.fountainParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 5
    });
    this.emitters = []
    this.createFountains();
    this.fountainParticleGroup.mesh.renderDepth = -1;
    this.game.scene.add(this.fountainParticleGroup.mesh)
  },

  createFountains: function(){

    var emitter = new SPE.Emitter({
      position: new THREE.Vector3(-100, 0, -this.world.islandRadius  - 100),
      positionSpread: new THREE.Vector3(30, 0, 30),
      velocity: new THREE.Vector3(0, 500, 0),
      velocitySpread: new THREE.Vector3(50, 100, 50),
      acceleration: new THREE.Vector3(0, -140, 0),
      accelerationSpread: new THREE.Vector3(40, 40, 40),
      particleCount: 1000,
      opacityStart: 0.8,
      opacityMiddle: 0.8,
      sizeStart: 200,
      sizeStartSpread: 50,
      sizeEnd: 30,
      sizeMiddle: 50
    });
    this.fountainParticleGroup.addEmitter(emitter);


  },

  update: function(){
    this.fountainParticleGroup.tick();

  }

})