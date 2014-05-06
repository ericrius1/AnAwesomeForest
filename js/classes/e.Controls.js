e.Controls = new Class({
  construct: function(options) {
    this.camera = options.camera;
    this.player = options.player;
    this.keyboard = new e.Keyboard();
    this.controls = new THREE.OrbitControls(this.camera);

  },
  update: function(){
    this.controls.update();

  }
})