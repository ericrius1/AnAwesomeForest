e.Game = new Class({
  extend: e.EventEmitter,

  construct: function() {
    // Bind render function permenantly
    this.render = this.render.bind(this);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
    this.camera.position.z = 20;

    this.scene = new THREE.Scene();
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);

    this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(10), new THREE.MeshBasicMaterial()));
    this.start();

  },

  start: function(){
    requestAnimationFrame(this.render);
  },

  render: function() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  },

  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }



});