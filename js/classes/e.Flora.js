e.Flora = new Class({
  randInt: THREE.Math.randInt,
  construct: function(options){
    var self = this;
    this.game = options.game;
    this.numLevels = 3;
    this.currentLevel = 0;
    this.radius = 0.5;
    this.generateTrunk()
    this.createBranches(this.currentLevel);


  },

  createBranches: function(currentLevel){
    for(var i = 0; i < 3; i ++){ 
      var extrudePath = new THREE.SplineCurve3([
        this.branchPoint, 
        new THREE.Vector3(this.randInt(-5, 5), this.randInt(10, 15), this.randInt(-5, 5)),
        new THREE.Vector3(this.randInt(-10, 10), this.randInt(15, 20), this.randInt(-10, 10))
      ]);
      var geo = new THREE.TubeGeometry(extrudePath, 10, this.radius);
      var mesh = new THREE.Mesh(geo);
      this.game.scene.add(mesh)
    }

  },

  generateTrunk: function(){
    this.branchPoint = new THREE.Vector3(this.randInt(-5, 5), 10, 0);
    var extrudePath = new THREE.SplineCurve3([
      new THREE.Vector3(0, 0, 0), this.branchPoint
    ]);
    var geo = new THREE.TubeGeometry(extrudePath, 10, 1);
    var mesh = new THREE.Mesh(geo);
    this.game.scene.add(mesh);
  }
});