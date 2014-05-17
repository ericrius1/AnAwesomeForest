e.World = new Class({

  extend: e.EventEmitter,

  construct: function(options) {
    this.on('winter', function(){
      this.beginWinter();
    });
    this.game = options.game;
    this.cyclePoint = this.game.cyclePoint;

    var groundMat = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a
    });
    this.pathLength = 5000;
    this.pathWidth = 5000;
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(this.pathWidth, this.pathLength, 50, 50), groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    var heightMultiplier;
    this.game.scene.add(this.ground);
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

    this.cliff = new e.Cliff({
      game: this.game,
      world: this
    });
    this.waterfall = new e.Waterfall({
      game: this.game,
      cliff: this.cliff
    })
    this.forest = new e.Forest({
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

  },

  update: function() {
    var time = performance.now()
    this.water.material.uniforms.time.value += 1.0 / 60.0;
    this.water.render();
    this.ocean.update();
    this.waterfall.update();
    this.appalapas.update();
    this.forest.update();
    this.birds.update();
    this.moon.position.y+=1;
  },

  beginWinter: function(){
    console.log('Its wintertime!!');
  }

});