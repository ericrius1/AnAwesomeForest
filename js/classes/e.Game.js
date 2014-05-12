e.Game = new Class({
  extend: e.EventEmitter,


  //Come DOWN TO US REMIX
  construct: function() {
    // Bind render function permenantly
    this.render = this.render.bind(this);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000000);
    this.camera.position.set(0, 50, 0);



    //FOG
    this.scene.fog = new THREE.Fog(0xffffff, 3000000, 100000000);
    this.scene.fog.color.setHSL(0.5, 0.4, 0.4);
    this.renderer.setClearColor(this.scene.fog.color, 1);

    var spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
    spotLight.position.set(0, 1800, 1500);
    spotLight.target.position.set(0, 0, 0);
    spotLight.castShadow = true;
    this.scene.add(spotLight);




    var light = new THREE.PointLight(0xffffff);
    light.position = this.camera.position;
    this.scene.add(light);

    this.player = new e.Player({
      game: this,
      camera: this.camera
    });

    this.world = new e.World({
      game: this
    });

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);


    this.clock = new THREE.Clock();

    this.controls = new e.Controls({
      camera: this.camera,
      player: this.player,
      game: this
    });

    this.start();
  },

  start: function() {
    requestAnimationFrame(this.render);
  },

  render: function() {
    requestAnimationFrame(this.render);


    this.controls.update();
    this.world.update();
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
  },

  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }



});