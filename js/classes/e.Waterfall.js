e.Waterfall = new Class({
  construct: function(options) {
    this.game = options.game;
    this.cliff = options.cliff;
    var position = new THREE.Vector3(0, 1000, 1000);

    this.createWaterfall(position);


  },

  createWaterfall: function(position) {
    this.particleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/waterparticle.png'),
      maxAge: 5
    });

    //TOP
    var topEmitter = new SPE.Emitter({
      position: position,
      positionSpread: new THREE.Vector3(50, 20, 200),
      velocity: new THREE.Vector3(0, -500, 0),
      velocitySpread: new THREE.Vector3(100, 100, 100),
      acceleration: new THREE.Vector3(-10, -500, 10),
      sizeStart: 200,
      sizeEnd: 700,
      particleCount: 1000
    });


    //BOTTOM
    var bottomEmitter = new SPE.Emitter({
      position: new THREE.Vector3(position.x, 0, position.z),
      positionSpread: new THREE.Vector3(10, 0, 10),
      velocity: new THREE.Vector3(0, 10, 0),
      velocitySpread: new THREE.Vector3(150, 0, 150),
      acceleration: new THREE.Vector3(0, -5, 0),
      accelerationSpread: new THREE.Vector3(10, 10, 10),
      colorStart: new THREE.Color(0x6dbb63),
      colorEnd: new THREE.Color().setRGB(1.0, 1.0, 1.0),
      sizeStart: 100,
      sizeEnd: 300,
      sizeEndSpread: 400,
      particleCount: 1000

    }); 

    this.particleGroup.addEmitter(topEmitter);
    this.particleGroup.addEmitter(bottomEmitter);
    this.particleGroup.mesh.renderDepth = -1;
    this.game.scene.add(this.particleGroup.mesh);

  },

  update: function(){
    this.particleGroup.tick();
  }

});