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
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    this.camera.position.z = 100;
    this.scene.add(this.camera);

    this.player = new e.Player({
      game: this,
      camera: this.camera
    });

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    for(var i = 0; i < 500; i ++){
      var sphere = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial());
      sphere.position.set(THREE.Math.randInt(-10, 10), THREE.Math.randInt(-10, 10), THREE.Math.randInt(100, -1000));
      this.scene.add(sphere);
    }

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
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  },

  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }



});