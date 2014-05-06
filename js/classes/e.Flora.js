e.Flora = new Class({
  randInt: THREE.Math.randInt,
  construct: function(options) {
    var self = this;
    this.game = options.game;
    this.numLevels = 3;
    this.currentLevel = 0;
    this.radius = 0.5;
    this.branchPoint = new THREE.Vector3(0, 0, 0);

    var r = "assets/Park2/";
    var urls = [r + "posx.jpg", r + "negx.jpg",
      r + "posy.jpg", r + "negy.jpg",
      r + "posz.jpg", r + "negz.jpg"
    ];

    var textureCube = THREE.ImageUtils.loadTextureCube(urls);
    textureCube.format = THREE.RGBFormat;

    this.cubeCamera = new THREE.CubeCamera(1, 1000, 128);
    this.cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    this.game.scene.add(this.cubeCamera);
    self.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      ambient: 0xffffff,
      shininess: 5,
      // envMap: self.cubeCamera.renderTarget,
      envMap: textureCube,
      combine: THREE.MixOperation,
      reflectivity: 0.1
    });
    self.generateTrunk();


    this.createBranches(this.currentLevel);

  },

  createBranches: function(currentLevel) {
    for (var i = 0; i < 3; i++) {
      var extrudePath = new THREE.SplineCurve3([
        this.branchPoint,
        new THREE.Vector3(this.randInt(-5, 5), this.randInt(10, 20), this.randInt(-5, 5)),
        new THREE.Vector3(this.randInt(-10, 10), this.randInt(15, 70), this.randInt(-10, 10))
      ]);
      // path, segments, radius, radialSegments, closed
      var geo = new THREE.TubeGeometry(extrudePath, 5, this.radius, 1);
      var mesh = new THREE.Mesh(geo);
      this.game.scene.add(mesh)
    }

  },

  generateTrunk: function() {
    this.newBranchPoint = new THREE.Vector3(this.randInt(-5, 5), 200, 0);
    var extrudePath = new THREE.SplineCurve3([
      this.branchPoint, this.newBranchPoint
    ]);
    this.branchPoint = this.newBranchPoint;

    var geo = new THREE.SphereGeometry(10, 30, 15);



    var mesh = new THREE.Mesh(geo, this.material);
    this.game.scene.add(mesh);

  },

  update: function() {
    this.cubeCamera.updateCubeMap(this.game.renderer, this.game.scene);
  }
});