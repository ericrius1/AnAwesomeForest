e.Flora = new Class({
  randInt: THREE.Math.randInt,
  randFloat: THREE.Math.randFloat,
  construct: function(options) {
    this.game = options.game;
    this.maxSteps = 4;
    this.lengthMult = 0.88;
    this.angleLeft = Math.PI / 4;
    this.angleRight = Math.PI / 4;
    var length = 100;
    var angle = Math.PI / 2;

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

    this.treeGeo = new THREE.Geometry();
    this.drawPart(angle, 0, 0, 0, 100, 0)
    var tree = new THREE.Mesh(this.treeGeo);
    this.game.scene.add(tree);
    // this.tree();



  },

  tree: function() {

  },

  drawPart: function(angle, x, y, z, length, count) {
    var self = this;
    if (count < this.maxSteps) {
      var newLength = length * this.lengthMult;
      var newX = x + Math.cos(angle) * length;
      var newY = y + Math.sin(angle) * length;
      var countSq = Math.min(3.2, count * count);
      var newZ = z + (Math.random() > 0.5 ? 20 : -20);

      var size = 30 - (count * 8);
      if (size > 25) size = 25;
      if (size < 10) size = 10;

      var path = new THREE.SplineCurve3([
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(newX, newY, newZ)
      ]);
      var geo = new THREE.TubeGeometry(path);
      this.treeGeo.merge(geo);
      self.drawPart(angle - self.angleRight, newX, newY, newZ, newLength, count + 1);
      self.drawPart(angle + self.angleLeft, newX, newY, newZ, newLength, count + 1);
    }

  },


  update: function() {
    this.cubeCamera.updateCubeMap(this.game.renderer, this.game.scene);
  }
});