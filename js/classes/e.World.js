e.World = new Class({

  construct: function(options) {
    this.game = options.game;

    var groundMat = new THREE.MeshLambertMaterial({
      color: 0x3a5938
    });
    this.pathLength = 5000;
    this.pathWidth = 10000;
    this.ground = new THREE.Mesh(new THREE.PlaneGeometry(this.pathWidth, this.pathLength, 50, 50), groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    var heightMultiplier;
    // _.each(this.ground.geometry.vertices, function(vertex) {
    //   if (Math.random() > 0.4 && Math.abs(vertex.x) > 1000) {
    //     heightMultiplier = 1;
    //     if (Math.abs(vertex.x) > 3000) {
    //       heightMultiplier = 4;
    //     }
    //     vertex.z = THREE.Math.randInt(400, 600) * heightMultiplier;
    //   }
    // })
    this.game.scene.add(this.ground);
    this.moon = new THREE.Mesh(new THREE.CircleGeometry(20, 200), new THREE.MeshBasicMaterial({
      color: 0xf2f2f2
    }));
    this.moon.scale.multiplyScalar(200);
    this.moon.position.set(-this.pathWidth * 2, 0, -this.pathLength * 10)
    this.moon.scale.x += 2;
    this.moon.lookAt(this.game.scene.position);
    //color, intensity, distance, angle, exponent
    this.light = new THREE.SpotLight(0xf2f2f2, 1, 0, Math.PI / 2, 1);
    this.light.position.set(-5000, 7000, -this.pathLength);
    this.light.target.position.set(0, 0, 0);
    this.game.scene.add(this.light);


    this.game.scene.add(this.moon);


    this.player = new e.Player({
      game: this,
      camera: this.game.camera,
      position: new THREE.Vector3(0, 70, 0)
    });

    this.forest = new e.Forest({
      game: this.game,
      world: this
    });

    this.bird = new e.Bird({
      game: this.game,
      world: this,
      forest: this.forest
    });


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
      distortionScale: 20.0,
    });

    this.ocean = new e.Ocean({
      game: this.game,
      world: this
    });

    this.pond = new e.Pond({
      game: this.game,
      water: this.water
    });



  },

  update: function() {
    var time = performance.now()
    this.water.material.uniforms.time.value += 1.0 / 90.0;
    this.water.render();
    this.ocean.update();
    this.forest.update();
    this.bird.update();
    this.moon.position.y+=1;
  }

});