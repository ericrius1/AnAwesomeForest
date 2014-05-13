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


    this.renderer.setClearColor(0x320a44 , 1);





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