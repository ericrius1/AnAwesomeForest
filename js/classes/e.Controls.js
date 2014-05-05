e.Controls = new Class({
  construct: function(options) {
    this.camera = options.camera;
    this.keyboard = new e.Keyboard();

  },

  update: function(delta) {
    if (this.keyboard.pressed('left')) {
      this.camera.position.x -= .1;
    }
    if (this.keyboard.pressed('right')) {
      this.camera.position.x += .1;
    }
    if (this.keyboard.pressed('down')) {
      this.camera.position.y -= .1;
    }
    if (this.keyboard.pressed('up')) {
      this.camera.position.y += .1;
    }
    this.camera.position.z -=.1;
  }
})