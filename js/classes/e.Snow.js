e.Snow = new Class({
  extend: e.EventEmitter,

  construct: function(options){
    this.game = options.game;
    this.world = options.world;
    this.maxAge = 5;
    this.createSnow();
    this.shouldUpdate = false;
  },

  createSnow: function(){
    var self = this;
    this.snowGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/waterparticle.png'),
      maxAge: this.maxAge
    });

    var texture = THREE.ImageUtils.loadTexture('assets/clouds.png');
    this.cloudGroup = new SPE.Group({
      texture: texture,
      maxAge: this.maxAge
    });

    this.cloudEmitter = new SPE.Emitter({
      position: new THREE.Vector3(0, 1000, 0),
      positionSpread: new THREE.Vector3(this.world.islandRadius * 8, 100, this.world.islandRadius * 8),
      velocity: new THREE.Vector3(0, 0, 200),
      velocitySpread: new THREE.Vector3(0, 10, 100),
      colorStart: new THREE.Color(0x9c9c9c),
      sizeStart: 5000,
      sizeStartSpread: 2000,
      sizeEndSpread: 1000,
      accelerationSpread: new THREE.Vector3(5, 0, 5),
      opacityStart: 0,
      opacityMiddle: 1,
      opacityEnd: 0,
      particleCount: 300,
    })

    this.snowEmitter = new SPE.Emitter({
      position: this.cloudEmitter.position,
      positionSpread: new THREE.Vector3(this.world.islandRadius * 4, 100, this.world.islandRadius * 4),
      velocity: new THREE.Vector3(0, -200, 0),
      velocitySpread: new THREE.Vector3(100, 10, 100),
      acceleration: new THREE.Vector3(0, -20, 0),
      accelerationSpread: new THREE.Vector3(60, 10, 60),
      sizeStart: 30,
      sizeStartSpread: 20,
      opacityStart: 0,
      opacityMiddle: 0.9,
      particleCount: 10000
    });
    this.cloudGroup.addEmitter(this.cloudEmitter);
    this.snowGroup.addEmitter(this.snowEmitter);
    this.snowGroup.mesh.renderDepth = -1;
    this.game.scene.add(this.snowGroup.mesh);
    this.game.scene.add(this.cloudGroup.mesh);
    this.cloudEmitter.disable();
    this.snowEmitter.disable();
  },

  beginSnowing: function(){
    var self = this;
    this.shouldUpdate = true;
    this.cloudEmitter.enable();
    setTimeout(function(){
      self.trigger('snowStarting');
      self.snowEmitter.enable();
    }, 5000);

  },

  endSnowing: function(){
    this.snowEmitter.disable() 
    this.cloudEmitter.disable();
    var delay = this.maxAge + 1000;
    setTimeout(function(){
      self.shouldUpdate = false;
    }, delay)
  },
  update: function(){
    if(!this.shouldUpdate){
      return;
    }
    this.snowGroup.tick();
    this.cloudGroup.tick();
  }
})