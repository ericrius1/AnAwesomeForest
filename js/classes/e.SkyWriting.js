e.SkyWriting = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.messageHeight = options.messageHeight;
    this.emitters = [];
    this.currentEmitterIndex = 0;
    this.emitterBatch = 10;

    var textGeo = new THREE.TextGeometry('HAPPY BIRTHDAY ANITRA!!', {
      font: 'josefin slab',
      size: 40

    });
    var text = new THREE.Mesh(textGeo);
    text.position.set(-300, this.messageHeight, -this.world.islandRadius - 100)
    // text.position.set(-300, 70, -this.world.islandRadius - 100)
    // text.scale.multiplyScalar(10);
    text.scale.z = 0.01;
    var textPoints = THREE.GeometryUtils.randomPointsInGeometry(textGeo, 4000);
    this.game.scene.add(text);
    text.visible = false;

    this.textParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 1
    });

    this.starParams = {
      colorStart: new THREE.Color(0xff0000),
      colorEnd: new THREE.Color(0x0000ff),
      velocitySpread: new THREE.Vector3(10, 10, 10),
      sizeStart: 40,
      opacityEnd: 1,
      particleCount: 2,
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


  update: function() {
    if(this.doUpdate){
      this.textParticleGroup.tick();
    }

  }
});