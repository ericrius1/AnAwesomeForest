e.DistantLands = new Class({

  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.size = this.world.size;
    this.tickTime = 0.016;
    this.emitters = [];
    this.lightIndex = 0;
    this.spacing = 500;
    this.spread = 4000;


    this.createCityLights()

  },
  createCityLights: function() {
    this.cityGroup = new SPE.Group({
      texture: THREE.ImageUtils.loadTexture('assets/house.png'),
      maxAge: 6
    });

    var houseParams = {
      colorStart: new THREE.Color().setRGB(1, 0, 0),
      particleCount: 50,
      opacityStart: 0.0,
      opacityMiddle: 1,
      opacityEnd: 0,
    }

    var houseEmitter;


    //put lights all around
    var posZ = this.size/2;
    for(var posX = -this.size/2; posX < this.size/2; posX+=this.spacing){
      var tempZ = Math.random() > 0.5 ? posZ : -posZ;
      houseEmitter = new SPE.Emitter(houseParams);
      houseEmitter.position.set(posX, _.random(0, 2000), _.random(tempZ - this.spread, tempZ + this.spread));
      houseEmitter.sizeStart = _.random(400, 1400);
      houseEmitter.colorStart.setRGB(Math.random(), Math.random(), Math.random())
      this.cityGroup.addEmitter(houseEmitter);
      this.emitters.push(houseEmitter);
    }

    var posX = this.size/2;
    for(var posZ = this.size/2; posZ > -this.size/2; posZ-=this.spacing){
      var tempX = Math.random() > 0.5 ? posX : -posX;
      houseEmitter = new SPE.Emitter(houseParams);
      houseEmitter.position.set(_.random(tempX -this.spread, tempX + this.spread), _.random(0, 2000), posZ);
      houseEmitter.sizeStart = _.random(400, 1400);
      houseEmitter.colorStart.setRGB(Math.random(), Math.random(), Math.random())
      this.cityGroup.addEmitter(houseEmitter);
      this.emitters.push(houseEmitter);


    }

    this.cityGroup.mesh.renderDepth = -1;
    this.game.scene.add(this.cityGroup.mesh)
    this.turnOnLights();
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