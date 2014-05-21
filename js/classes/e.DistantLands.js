e.DistantLands = new Class({

  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.tickTime = 0.016;
    this.emitters = [];
    this.lightIndex = 0;
    


    this.createCityLights()

  },
  createCityLights: function() {
    this.cityGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/house.png'),
      maxAge: 10
    });

    var houseParams = {
      colorStart: new THREE.Color(0xff0000),
      particleCount: 30,
      opacityStart: 0.5,
      opacityMiddle: 1,
      opacityEnd: 0
    }

    var houseEmitter;
    var startingZ = this.world.size/2
    var pos = new THREE.Vector3(-this.world.size/2, 100, startingZ);
    for(var i = 0; i < 200; i++){
      houseEmitter = new SPE.Emitter(houseParams);
      var zPos = _.random(startingZ - 100, startingZ + 1000)
      houseEmitter.position.set(pos.x, pos.y, zPos);
      houseEmitter.colorStart =  new THREE.Color().setHSL(Math.random(), Math.random(), 0.5);
      houseEmitter.sizeStart = _.random(400, 600);
      pos.x += i ;
      pos.y = Math.abs(Math.sin(pos.x) * 1000);
      this.cityGroup.addEmitter(houseEmitter);
      this.emitters.push(houseEmitter);
      houseEmitter.disable();
    }
    this.cityGroup.mesh.renderDepth = -1;
    this.game.scene.add(this.cityGroup.mesh)
    this.turnOnLights(i);
  },

  turnOnLights: function(){
    var self = this;
    var index = _.random(0, this.emitters.length-1);
    this.emitters[index].enable();
    // if(this.lightIndex === this.emitters.length)return;
    setTimeout(function(){
      self.turnOnLights();
    }, 20)

  },

  update: function() {
    this.cityGroup.tick(this.tickTime);
  }

});