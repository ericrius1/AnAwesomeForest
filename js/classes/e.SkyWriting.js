e.SkyWriting = new Class({
  extend: e.EventEmitter,
  construct: function(options) {
    var self = this;
    this.game = options.game;
    this.world = options.world;
    this.messageHeight = options.messageHeight;
    this.emitters = [];
    this.currentEmitterIndex = 0;
    this.emitterBatch = 10;
    this.rainEmitters = [];
    this.on('birdFliesThroughMessage', function(){
      self.letItRain();
    });

    var textGeo = new THREE.TextGeometry('HAPPY BIRTHDAY ANITRA!!', {
      font: 'josefin slab',
      size: 40

    });
    var text = new THREE.Mesh(textGeo);
    text.position = options.position;
    // text.position.set(-300, 70, -this.world.islandRadius - 100)
    // text.scale.multiplyScalar(10);
    text.scale.z = 0.01;
    var textPoints = THREE.GeometryUtils.randomPointsInGeometry(textGeo, 4000);
    this.game.scene.add(text);
    text.visible = false;

    this.textParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 5
    });

    this.starParams = {
      colorStart: new THREE.Color(0xff0000),
      colorEnd: new THREE.Color(0x0000ff),
      velocitySpread: new THREE.Vector3(2, 2, 2),
      sizeStart: 20,
      opacityEnd: 1,
      particleCount: 10,
    }
    this.createEmitterPoints(textPoints);
    this.textParticleGroup.mesh.renderDepth = -1;
    text.add(this.textParticleGroup.mesh);

  },

  createEmitterPoints: function(points) {
    for (var i = 0; i < points.length; i++) {
      var emitter = new SPE.Emitter(this.starParams);
      emitter.position = points[i] ;
      emitter.disable();
      this.textParticleGroup.addEmitter(emitter);
      this.emitters.push(emitter);
    }

    //RAIN PARAMS
    for(var i = 0; i < 10; i++){
      var emitter = new SPE.Emitter({
        colorStart: new THREE.Color().setRGB(.11, .0, .83),
        colorStartSpread: new THREE.Vector3(0, .90, .83),
        velocity: new THREE.Vector3(0, -20, 40000  ),
        velocitySpread: new THREE.Vector3(0, 100, 30000),
        positionSpread: new THREE.Vector3(500, 0, 0),
        acceleration: new THREE.Vector3(0, _.random(-200, -100), 0),
        sizeStart: 70,
        sizeStartSpread: 50,
        opacityEnd: 1,
        particleCount: 500
      });
      emitter.velocity.z = _.random(emitter.velocity.z - 30000, emitter.velocity.z + 30000);
      emitter.disable();
      emitter.position = points[i];
      this.textParticleGroup.addEmitter(emitter);
      this.rainEmitters.push(emitter);
    }
  },

  reveal: function() {
    this.doUpdate = true;
    this.writeMessage();
  },
  writeMessage: function(){
    var self = this;
    for(var i = 0; i < this.currentEmitterIndex + this.emitterBatch; i++){
      this.emitters[i].enable()
    }
    this.currentEmitterIndex += this.emitterBatch;
    if(this.currentEmitterIndex >= this.emitters.length){
      console.log('DONE!!')
      return;
    }

    setTimeout(function(){
      self.writeMessage();
    }, 100);

  },

  letItRain: function(){
    for(var i = 0; i < this.rainEmitters.length; i++){
      this.rainEmitters[i].enable();
    }
  },


  update: function() {
    if(this.doUpdate){
      this.textParticleGroup.tick();
    }

  }
});