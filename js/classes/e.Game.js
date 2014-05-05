e.Game = new Class({
  extend: e.EventEmitter,

  construct: function() {
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

  }

});