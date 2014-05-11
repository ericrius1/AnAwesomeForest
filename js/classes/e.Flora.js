e.Flora = new Class({
  randInt: THREE.Math.randInt,
  randFloat: THREE.Math.randFloat,
  construct: function(options) {
    this.game = options.game;
    this.maxSteps = 8;
    this.lengthMult = 0.63;
    this.angleLeft = Math.PI / 5;
    this.angleRight = Math.PI / 5;
    var length = 20;

    var uniforms = {
      height: {
        type: 'f',
        value: 100
      }
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexShader').text,
      fragmentShader: document.getElementById('fragmentShader').text
    });


    this.lightGeo = new THREE.PlaneGeometry(400, 400);
    this.lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      map: THREE.ImageUtils.loadTexture("assets/light.png"),
      transparent: true
    });



    this.treeGeo = new THREE.Geometry();
    this.createForest();



  },

  createForest: function() {
    var self = this;
    var angle = Math.PI / 2;
    var treeGeo = new THREE.Geometry();
    this.createTree(angle, 0, 0, 0, 100, 0, treeGeo, 10)
    var tree = new THREE.Mesh(treeGeo, this.material);
    // tree.scale.multiplyScalar(0.01);
    tree.position.x = this.randInt(-2000, 2000);
    tree.position.z = this.randInt(-2000, 2000);
    tree.geometry.computeBoundingBox();
    var height = tree.geometry.boundingBox.max.y;
    this.material.uniforms.height.value = height;
    this.game.scene.add(tree);

    this.light = new THREE.Mesh(this.lightGeo, this.lightMaterial);
    this.light.position.y = 2;
    this.light.rotation.x = -Math.PI / 2;
    this.light.position.x = tree.position.x;
    this.light.position.z = tree.position.z;
    this.game.scene.add(this.light);

    tree.scale.multiplyScalar(0.01);
    var growTween = new TWEEN.Tween(tree.scale).
    to({
      x: 1,
      y: 1,
      z: 1
    }, 5000).
    easing(TWEEN.Easing.Cubic.Out).start();
    growTween.onComplete(function() {
      self.createForest();
    })

  },

  createTree: function(angle, x, y, z, length, count, treeGeo, size) {
    var self = this;
    if (count < this.maxSteps) {

      var lengthMultOffset = .1;
      var tempLengthMult = this.lengthMult + this.randFloat(-lengthMultOffset, lengthMultOffset);
      var newLength = Math.max(1, length * tempLengthMult);

      //We want greater angle randomness the deeper we get into the tree structure
      var angleOffset = map(count, 0, this.maxSteps - 1, .1, 1);
      var tempAngle = angle + this.randFloat(-angleOffset, angleOffset);
      var newX = x + Math.cos(tempAngle) * length;
      var newY = y + Math.sin(tempAngle) * length;

      var newZ = z;

      var size = Math.max(1, size * 0.7);

      var path = new THREE.SplineCurve3([
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(newX, newY, newZ)
      ]);
      var geo = new THREE.TubeGeometry(path, 5, size, 5);
      treeGeo.merge(geo);
      self.createTree(tempAngle - self.angleRight, newX, newY, newZ, newLength, count + 1, treeGeo, size);
      self.createTree(tempAngle + self.angleLeft, newX, newY, newZ, newLength, count + 1, treeGeo, size);
    }


  },


  update: function() {}
});