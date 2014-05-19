e.World = new Class({
  extend: e.EventEmitter,

  construct: function(options) {
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

    this.pathLength = 5000;
    this.pathWidth = 5000;
    this.landscape = new e.Landscape(this.pathWidth, this.pathLength, {game: this.game});
    this.moon = new THREE.Mesh(new THREE.CircleGeometry(20, 200), new THREE.MeshBasicMaterial({
      color: 0xf2f2f2
    }));
    this.moon.scale.multiplyScalar(200);
    this.moon.position.set(-this.pathWidth * 2, 0, -this.pathLength * 10)
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

    this.pond = new e.Pond({
      game: this.game,
      water: this.water,
      world: this
    });

    // this.waterfall = new e.Waterfall({
    //   game: this.game,
    //   cliff: this.cliff
    // })
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

    this.appalapas = new e.Appalapas({
      game: this.game,
      pond: this.pond
    });

    // this.hut = new e.Hut({
    //   game: this.game
    // });

  },

  update: function() {
    var time = performance.now()
    this.water.material.uniforms.time.value += 1.0 / 60.0;
    this.water.render();
    this.ocean.update();
    // this.waterfall.update();
    this.appalapas.update();
    this.forest.update();
    this.birds.update();
    this.moon.position.y += 1;
    this.snow.update();
  },

  beginFall: function(){
    this.forest.changeLeafColors();
    this.birds.headSouth();
  },

  beginWinter: function() {
    this.snow.beginSnowing();
  },
  beginSpring: function(){
    this.birds.headNorth();
    this.snow.endSnowing();
    this.landscape.snowMelt();
    this.forest.leavesGrowBack();
  },
  beginSummer: function() {
    this.snow.endSnowing();
  }



});