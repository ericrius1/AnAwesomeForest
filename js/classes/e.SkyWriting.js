e.SkyWriting = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.emitters = [];
    this.currentEmitterIndex = 0;
    this.emitterBatch = 10;

    var textGeo = new THREE.TextGeometry('Happy Birthday Anitra!!');
    var text = new THREE.Mesh(textGeo);
    text.position.y = 100;
    text.scale.z = 0.01;
    var textPoints = THREE.GeometryUtils.randomPointsInGeometry(textGeo, 5000);
    this.game.scene.add(text);
    text.visible = false;

    this.textParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 5
    });

    this.starParams = {
      accelerationSpread: new THREE.Vector3(3, 3, 3),
      colorStart: new THREE.Color(0xff0000),
      colorEnd: new THREE.Color(0x0000ff),
      sizeStart: 20,
      sizeEnd: 5,
      opacityEnd: 1,
      particleCount: 3,
    }
    this.createEmitterPoints(textPoints);
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
    }, 1);

  },


  update: function() {
    if(this.doUpdate){
      this.textParticleGroup.tick();
    }

  }
});