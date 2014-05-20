e.SkyWriting = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    var hearthPath = new THREE.Curves.HeartCurve(20);
    var geo = new THREE.TubeGeometry(hearthPath);
    this.word = new THREE.Mesh(geo);
    this.points = geo.parameters.path.getSpacedPoints(50);
    this.word.position.set(0, 700, -this.world.islandRadius * 3);
    this.game.scene.add(this.word);
    this.word.visible = false;



    this.textParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 10
    });

    this.starParams = {
      sizeStart: 200,
      sizeMiddle: 300,
      sizeEnd: 1000,
      sizeEndSpread: 500,
      opacityMiddle: 1,
      acceleration: new THREE.Vector3(0, 0, 200),
      accelerationSpread: new THREE.Vector3(5, 2, 5),
      particles: 50,
      colorStart: new THREE.Color().setRGB(1, 0, 0),
      colorEnd: new THREE.Color(0xf6de12),
    }
    this.createEmitterPoints();

  },


  createEmitterPoints: function() {


    for (var i = 0; i < this.points.length; i++) {
      var emitter = new SPE.Emitter(this.starParams);
      emitter.position = this.points[i] ;
      this.textParticleGroup.addEmitter(emitter);
    }

    this.word.add(this.textParticleGroup.mesh);
  },

  reveal: function() {

  },

  update: function() {
    this.textParticleGroup.tick();

  }
});