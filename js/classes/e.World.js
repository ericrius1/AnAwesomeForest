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
    this.on('summer', function() {
      self.beginSummer();
    });
    this.game = options.game;

    this.islandRadius = 3000;
    this.moon = new THREE.Mesh(new THREE.CircleGeometry(20, 200), new THREE.MeshBasicMaterial({
      color: 0xe3e3e3
    }));
    this.moon.scale.multiplyScalar(80);
    this.moon.position.set(-this.islandRadius * 3, 0, -this.islandRadius * 10)
    this.moon.scale.x += 2;
    this.moon.lookAt(this.game.scene.position);
    this.game.scene.add(this.moon);


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
      world: this
    });

    this.snow = new e.Snow({
      game: this.game,
      world: this
    });

    this.birds = new e.Birds({
      game: this.game,
      world: this,
      forest: this.forest
    });

    this.skywriting = new e.SkyWriting({
      game: this.game,
      world: this
    });

    // this.fountains = new e.Fountains({
    //   game: this.game,
    //   world: this
    // });

    // this.hut = new e.Hut({
    //   game: this.game
    // });

  },

  update: function() {
    var time = performance.now()
    this.water.material.uniforms.time.value += 1.0 / 90.0;
    this.water.render();
    this.forest.update();
    this.birds.update();
    this.moon.position.y += 1;
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
    this.snow.beginSnowing();
  },
  beginSpring: function(){
    console.log('spring')
    this.landscape.snowMelt();
    this.forest.leavesGrowBack();
    this.snow.endSnowing();
    this.birds.returnHome();
    var self = this;
    setTimeout(function(){
      self.skywriting.reveal();
    }, 10000)
  },
  beginSummer: function() {
    console.log('summer');
  }



});