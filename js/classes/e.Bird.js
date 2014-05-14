e.Bird = new Class({

  construct: function(options) {
    var self = this;
    this.game = options.game;
    this.geo = new THREE.Geometry();
    this.phase = Math.floor( Math.random() * 62.83 );
    v(5, 0, 0);
    v(-5, -2, 1);
    v(-5, 0, 0);
    v(-5, -2, -1);

    //wing tips
    v(0, 2, -6);
    v(0, 2, 6);


    v(2, 0, 0);
    v(-3, 0, 0);

    f(0, 2, 1);

    f(4, 7, 6); 
    f(5, 6, 7);

    this.bird = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({side: THREE.DoubleSide}));
    this.bird.position.y = 50;
    this.game.scene.add(this.bird);

    function v(x, y, z) {
      self.geo.vertices.push(new THREE.Vector3(x, y, z));

    }

    function f(a, b, c){
      self.geo.faces.push(new THREE.Face3(a,b,c));
    }
  },

  update: function(){
    var time = performance.now();
    this.phase = (this.phase + 0.001 ) ;
    this.bird.geometry.verticesNeedUpdate = true;
    this.bird.geometry.vertices[5].y = this.bird.geometry.vertices[4].y = Math.sin(this.phase) * 5; 
  }

});