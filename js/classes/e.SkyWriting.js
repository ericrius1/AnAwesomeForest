e.SkyWriting = new Class({
  construct: function(options){
    this.game = options.game;
    var hearthPath = new THREE.Curves.HeartCurve(20);
    var geo = new THREE.TubeGeometry(hearthPath);
    this.word = new THREE.Mesh(geo);
    this.points = geo.parameters.path.getSpacedPoints(100);
    this.word.position.set(0, 1000, -1000);
    this.word.lookAt(this.game.camera.localToWorld(new THREE.Vector3(0, 0, 0)));
    this.game.scene.add(this.word);
    this.word.visible = false;
 


    this.textParticleGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/star.png'),
      maxAge: 50
    });
    this.createEmitterPoints();

  },

  createEmitterPoints: function(){


    for(var i = 0; i < this.points.length; i++){
      var point = this.points[i];
      var emitter = new SPE.Emitter({
        position: point,
        sizeStart: 100,
        sizeMiddle: 100,
        sizeEnd: 2000,
        opacityMiddle: 1,
        opacityEnd: 0,
        accelerationSpread: new THREE.Vector3(10, 10, 10),
        particles: 100,
        colorStart: new THREE.Color().setRGB(1, 0, 0),
        colorMiddle: new THREE.Color().setRGB(1, 0, 1),


      });
      this.textParticleGroup.addEmitter(emitter);
    }

    this.word.add(this.textParticleGroup.mesh);
  },

  reveal: function(){

  },

  update: function(){
    this.textParticleGroup.tick();

  }
});