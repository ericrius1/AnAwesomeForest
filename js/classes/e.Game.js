e.Game = new Class({
  extend: e.EventEmitter,

  construct: function() {
    // Bind render function permenantly
    this.render = this.render.bind(this);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    this.camera.position.y = 10;
    this.camera.position.z = 100;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

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
      player: this.player
    });

    this.start();
  },

  start: function(){
    requestAnimationFrame(this.render);
  },

  render: function() {
    this.controls.update();
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  },

  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }



});