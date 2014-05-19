e.Snow = new Class({
  construct: function(options){
    this.game = options.game;
    this.world = options.world;
    this.pathLength = this.world.pathLength;
    this.createSnow();
  },

  createSnow: function(){
    var self = this;
    this.snowGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/waterparticle.png'),
      maxAge: 5
    });

    var texture = THREE.ImageUtils.loadTexture('assets/clouds.png');
    this.cloudGroup = new SPE.Group({
      texture: texture,
      maxAge: 10
    });

    this.cloudEmitter = new SPE.Emitter({
      position: new THREE.Vector3(0, 1000, -this.pathLength),
      velocity: new THREE.Vector3(0, 0, 700),
      positionSpread: new THREE.Vector3(this.pathLength * 2, 100, this.pathLength * 2),
      sizeStart: 5000,
      sizeStartSpread: 2000,
      sizeEndSpread: 1000,
      accelerationSpread: new THREE.Vector3(5, 0, 5),
      opacityStart: 0,
      opacityMiddle: 1,
      opacityEnd: 0,
      particleCount: 700,
    })

    this.snowEmitter = new SPE.Emitter({
      position: self.cloudEmitter.position,
      velocity: self.cloudEmitter.velocity,
      positionSpread: new THREE.Vector3(this.pathLength*2, 100, this.pathLength*2),
      velocitySpread: new THREE.Vector3(100, 10, 100),
      acceleration: new THREE.Vector3(0, -50, 0),
      accelerationSpread: new THREE.Vector3(30, 5, 30),
      sizeStart: 50,
      sizeStartSpread: 20,
      opacityEnd: 1,
      particleCount: 10000
    });
    this.cloudGroup.addEmitter(this.cloudEmitter);
    this.snowGroup.addEmitter(this.snowEmitter);
    this.game.scene.add(this.snowGroup.mesh);
    this.game.scene.add(this.cloudGroup.mesh);
    this.cloudEmitter.disable();
    this.snowEmitter.disable();
  },

  beginSnowing: function(){
    this.snowEmitter.enable();
    this.cloudEmitter.enable();
  },

  endSnowing: function(){
    this.snowEmitter.disable() 
    this.cloudEmitter.disable();
  },
  update: function(){
    this.snowEmitter.position = this.cloudEmitter.position;
    this.snowGroup.tick();
    this.cloudGroup.tick();
  }
})