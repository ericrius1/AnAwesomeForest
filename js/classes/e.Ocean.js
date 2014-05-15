e.Ocean = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.water = this.world.water;
    this.mirrorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5000, 5000, 5, 5),
      this.water.material
    );


    this.mirrorMesh.add(this.water);
    this.mirrorMesh.rotation.x = -Math.PI * 0.5;
    this.mirrorMesh.position.y = 5;
    this.mirrorMesh.position.z = -this.world.pathLength + 500;
    this.game.scene.add(this.mirrorMesh);
    this.createWaveFront();
  },

  createWaveFront: function(){
    this.particleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/waterparticle.png'),
      maxAge: 1
    });
    this.emitter = new SPE.Emitter({
      position: new THREE.Vector3(0, this.mirrorMesh.y, 0),
      positionSpread: new THREE.Vector3(2000, 20, 100),
      velocity: new THREE.Vector3(0, 50, 0),
      velocitySpread: new THREE.Vector3(100,100, 100),
      acceleration: new THREE.Vector3(0, -100, 0),
      sizeStart: 40,
      sizeEnd: 10,
      particleCount: 40000
    });
    this.particleGroup.addEmitter(this.emitter);
    this.particleGroup.mesh.renderDepth = -1; 
    this.game.scene.add(this.particleGroup.mesh);


  },

  update: function(){
    var time = performance.now() * 0.0005;
    this.mirrorMesh.position.z += Math.sin(time) * 2;
    this.emitter.position.z = this.mirrorMesh.position.z + 2450;
    this.particleGroup.tick();

  }

});