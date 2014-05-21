e.SkyWriting = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    var hearthPath = new THREE.Curves.HeartCurve(30);
    var geo = new THREE.TubeGeometry(hearthPath);
    this.heart = new THREE.Mesh(geo);
    this.points = geo.parameters.path.getSpacedPoints(100);
    this.heart.position.set(0, 1000, -this.world.islandRadius * 1.5);
    this.game.scene.add(this.heart);
    this.heart.visible = false;
    this.velocity = new THREE.Vector3(0, 20, 20);
    this.acceleration = new THREE.Vector3(0, -.1, 0);
    this.emitters = [];

    var textGeo = new THREE.TextGeometry('hello');
    var text = new THREE.Mesh(textGeo);
    text.position.y = 100;
    var textPoints = THREE.GeometryUtils.randomPointsInGeometry(textGeo, 100);
    this.game.scene.add(text);
    text.visible = false;




    this.textParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 5
    });

    this.starParams = {
      opacityMiddle: 1,
      accelerationSpread: new THREE.Vector3(1, 1, 1),
      colorStart: new THREE.Color(0xff0000),
      colorEnd: new THREE.Color(0x0000ff),
      sizeStart: 20,
      particleCount: 10,
    }
    this.createEmitterPoints(textPoints);
    text.add(this.textParticleGroup.mesh);

  },


  createEmitterPoints: function(points) {


    for (var i = 0; i < points.length; i++) {
      var emitter = new SPE.Emitter(this.starParams);
      emitter.position = points[i] ;
      this.textParticleGroup.addEmitter(emitter);
      this.emitters.push(emitter);
    }
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