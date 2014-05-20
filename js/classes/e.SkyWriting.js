e.SkyWriting = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    var hearthPath = new THREE.Curves.HeartCurve(20);
    var geo = new THREE.TubeGeometry(hearthPath);
    this.heart = new THREE.Mesh(geo);
    this.points = geo.parameters.path.getSpacedPoints(100);
    this.heart.position.set(0, 1000, -this.world.islandRadius * 1.5);
    this.game.scene.add(this.heart);
    this.game.scene.add(this.heart2);
    this.heart.visible = false;
    this.velocity = new THREE.Vector3(0, 20, 20);
    this.acceleration = new THREE.Vector3(0, -.1, 0);
    this.emitters = [];



    this.textParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 10
    });

    this.starParams = {
      opacityMiddle: 1,
      positionSpread: new THREE.Vector3(10, 10, 10),
      accelerationSpread: new THREE.Vector3(100, 100, 100),
      colorStart: new THREE.Color(0xff0000),
      colorEnd: new THREE.Color(0x0000ff),
      sizeStart: 100,
      sizeEndSpread: 50,
      particleCount: 50,
    }
    this.createEmitterPoints();

  },


  createEmitterPoints: function() {


    for (var i = 0; i < this.points.length; i++) {
      var emitter = new SPE.Emitter(this.starParams);
      emitter.position = this.points[i] ;
      this.textParticleGroup.addEmitter(emitter);
      this.emitters.push(emitter);
    }
    this.textParticleGroup.mesh.renderDepth = -1;
    this.heart.add(this.textParticleGroup.mesh);
  },

  reveal: function() {
    this.doUpdate = true;

  },

  update: function() {
    if(this.doUpdate){
      this.textParticleGroup.tick();
    }

  }
});