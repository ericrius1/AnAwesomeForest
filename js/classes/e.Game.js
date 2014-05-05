e.Game = new Class({
  extend: e.EventEmitter,

  construct: function() {
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);

    this.scene = new THREE.Scene();
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);

  },

  animate: function() {
    this.renderer.render(this.scene, this.camera);
  },

  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }



});