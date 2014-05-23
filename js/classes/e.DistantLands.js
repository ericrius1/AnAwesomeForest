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
      particleCount: 10,
      opacityStart: 0.0,
      opacityMiddle: 1,
      opacityEnd: 0,
    }

    var houseEmitter;


    //put lights all around
    var posZ = -this.size/2;
    for(var posX = -this.size/2; posX < this.size/2; posX+=this.spacing){
      houseEmitter = new SPE.Emitter(houseParams);
      houseEmitter.position.set(posX, _.random(0, 2000), _.random(posZ - this.spread, posZ + this.spread));
      houseEmitter.sizeStart = _.random(800, 1800);
      houseEmitter.colorStart.setRGB(Math.random(), Math.random(), Math.random())
      this.cityGroup.addEmitter(houseEmitter);
      this.emitters.push(houseEmitter);
      houseEmitter.disable();
    }

    var posX = this.size/2;
    for(var posZ = this.size/2; posZ > -this.size/2; posZ-=this.spacing){
      var tempX = Math.random() > 0.5 ? posX : -posX;
      houseEmitter = new SPE.Emitter(houseParams);
      houseEmitter.position.set(_.random(tempX -this.spread, tempX + this.spread), _.random(0, 2000), posZ);
      // houseEmitter.sizeStart = _.random(400, 1400);
      houseEmitter.sizeStart = _.random(5000, 7000);
      houseEmitter.colorStart.setRGB(Math.random(), Math.random(), Math.random())
      this.cityGroup.addEmitter(houseEmitter);
      this.emitters.push(houseEmitter);
      houseEmitter.disable();


    }
    this.lightActivationWaitTime = (this.game.yearTime * 0.5) / this.emitters.length;
    this.cityGroup.mesh.renderDepth = -1;
    this.game.scene.add(this.cityGroup.mesh)
    this.shuffledLightOrders = _.shuffle(_.range(0, this.emitters.length));
    this.currentLightIndex =0;
    this.turnOnLights();
  },


  turnOnLights: function(){
    var self = this;
    this.emitters[this.shuffledLightOrders[this.currentLightIndex++]].enable();
    if(this.currentLightIndex === this.emitters.length){
      this.tickTime *= 0.1;
      return;
    }
    setTimeout(function(){
      self.turnOnLights();
    }, 100)

  },

  update: function() {
    this.cityGroup.tick(this.tickTime);
  }

});