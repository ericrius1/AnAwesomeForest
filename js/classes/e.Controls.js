e.Controls = new Class({
  construct: function(options) {
    this.camera = options.camera;
    this.player = options.player;
    this.keyboard = new e.Keyboard();

  },

  update: function(delta) {
    if (this.keyboard.pressed('left')) {
      this.player.mesh.rotation.y -= .1;
    }
    if (this.keyboard.pressed('right')) {
      this.player.mesh.rotation.y += .1;
    }
    if (this.keyboard.pressed('w')) {
      this.camera.position.y += .1;
    }
    if (this.keyboard.pressed('a')) {
      this.camera.position.x -= .1;
    }
    if (this.keyboard.pressed('s')) {
      this.camera.position.y -= .1;
    }
    if (this.keyboard.pressed('d')) {
      this.camera.position.x += .1;
    }
    this.camera.position.z -= .1;
  }
})