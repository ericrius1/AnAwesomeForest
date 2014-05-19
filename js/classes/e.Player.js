e.Player = new Class({

  construct: function(options) {
    this.camera = options.camera;
    this.controls = options.controls.controls;
    this.pathWidth = options.world.pathWidth;
    var geometry = new THREE.TorusGeometry(1, 0.1, 16, 50);
    this.game = options.game;
    this.camera.position = options.position.clone();
    this.checkBoundaries();
  },

  checkBoundaries: function(){
    var self = this;
    var worldCoord = this.camera.localToWorld(new THREE.Vector3(0,0,0))
    // if(worldCoord.x < -(this.pathWidth/2)){
    //   this.controls.teleport(this.pathWidth/2)
    // }
    // else if( worldCoord.x > this.pathWidth/2){
    //   this.controls.teleport(-this.pathWidth/2);
    // }

    setTimeout(function(){
      self.checkBoundaries();
    }, 200)
  }

});