e.World = new Class({
  extend: e.EventEmitter,

  construct: function(options) {
    this.frameCount =0;
    var self = this;
    this.on('fall', function(){
      self.beginFall();
    });
    this.on('winter', function() {
      self.beginWinter();
    });
    this.on('spring', function(){
      self.beginSpring();
    });
    this.game = options.game;

    this.islandRadius = 1000;
    this.size = options.size;
    this.moon = new THREE.Mesh(new THREE.CircleGeometry(20, 200), new THREE.MeshBasicMaterial({
      color: 0xe3e3e3
    }));
    this.moon.scale.multiplyScalar(80);
    this.moon.position.set(-5000, 0, -this.size/2)
    this.moon.scale.x += 2;
    this.moon.lookAt(this.game.scene.position);
    this.game.scene.add(this.moon);
    this.funHeight = 1000;


    //WATER
    var waterNormals = new THREE.ImageUtils.loadTexture('assets/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    this.water = new THREE.Water(this.game.renderer, this.game.camera, this.game.scene, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: waterNormals,
      alpha: 1.0,
      sunDirection: this.moon.position.clone().normalize(),
      sunColor: 0xffffff,
      waterColor: 0x000000,
      distortionScale: 50.0,
    });

    this.ocean = new e.Ocean({
      game: this.game,
      world: this
    });

    this.landscape = new e.Landscape(this.islandRadius, {game: this.game});

    this.forest = new e.Forest({
      game: this.game,
      island: this.landscape.ground,
      world: this
    });

    this.snow = new e.Snow({
      game: this.game,
      world: this
    });

    this.birds = new e.Birds({
      game: this.game,
      world: this,
      forest: this.forest,
      birdHeight: this.funHeight
    });

    this.skywriting = new e.SkyWriting({
      game: this.game,
      world: this,
      messageHeight: this.funHeight
    });

    this.distantlands = new e.DistantLands({
      game: this.game,
      world: this
    });

    this.statue = new e.Statue({
      game: this.game
    });

    // this.fountains = new e.Fountains({
    //   game: this.game,
    //   world: this
    // });


  },

  update: function() {
    var time = performance.now()
    this.water.material.uniforms.time.value += 1.0 / 90.0;
    this.water.render();
    this.forest.update();
    this.birds.update();
    this.moon.position.y += 1;
    this.distantlands.update();
    this.snow.update();
    this.skywriting.update();
  },

  beginFall: function(){
    var self = this;
    console.log('fall')
    this.forest.changeLeafColors();
  },

  beginWinter: function() {
    console.log('winter');
    var self = this;
    this.snow.beginSnowing();
    setTimeout(function(){
      self.birds.hibernate();
    }, 1500);
  },
  beginSpring: function(){
    console.log('spring')
    this.snow.endSnowing();
    this.landscape.snowMelt();
    this.forest.leavesGrowBack();
    var self = this;
    this.game.yearCompleted = true;
    setTimeout(function(){
      self.birds.returnHome();
      self.skywriting.reveal();
    }, 10000)
  },




});