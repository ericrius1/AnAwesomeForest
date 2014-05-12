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



    this.lightGeo = new THREE.PlaneGeometry(200, 200);
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

    var uniforms = {
      height: {
        type: 'f',
        value: 100
      }
    };

    var treeMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexShader').text,
      fragmentShader: document.getElementById('fragmentShader').text,
      side: THREE.DoubleSide
    });

    var angle = Math.PI / 2;
    var treeGeo = new THREE.Geometry();
    var leafGeo = new THREE.Geometry();
    createTree(angle, 0, 0, 0, 100, 0, 10);
    var oldX, oldY, oldZ;

    function createTree(angle, x, y, z, length, count, size) {

      if (count < self.maxSteps - 1) {

        var lengthMultOffset = .1;
        var tempLengthMult = self.lengthMult + self.randFloat(-lengthMultOffset, lengthMultOffset);
        var newLength = Math.max(1, length * tempLengthMult);

        //We want greater angle randomness the deeper we get into the tree structure
        var angleOffset = map(count, 0, self.maxSteps - 1, .1, 1);
        var tempAngle = angle + self.randFloat(-angleOffset, angleOffset);
        var newX = x + Math.cos(tempAngle) * length;
        var newY = y + Math.sin(tempAngle) * length;


        var dir = Math.random() > 0.5 ? 1 : -1;
        var newZ = z + Math.cos(tempAngle) * length * dir;

        var size = Math.max(1, size * 0.7);

        var path = new THREE.SplineCurve3([
          new THREE.Vector3(x, y, z),
          new THREE.Vector3(newX, newY, newZ)
        ]);
        var geo = new THREE.TubeGeometry(path, 5, size, 5);
        treeGeo.merge(geo);
        oldX = x;
        oldY = y;
        oldZ = z;
        createTree(tempAngle - self.angleRight, newX, newY, newZ, newLength, count + 1, size);
        createTree(tempAngle + self.angleLeft, newX, newY, newZ, newLength, count + 1, size);
      } else if (count === self.maxSteps - 1) {
        //add tree here so we have correct leaf position
        //add a leaf

        var geo = new THREE.Geometry();
        geo.vertices.push(new THREE.Vector3(oldX, oldY, oldZ));
        geo.vertices.push(new THREE.Vector3(oldX + 10, oldY, oldZ));
        geo.vertices.push(new THREE.Vector3(oldX + 5, oldY+10, oldZ));
        geo.faces.push(new THREE.Face3(0, 1, 2))
        treeGeo.merge(geo);
      }

    }

    var tree = new THREE.Mesh(treeGeo, treeMaterial);
    tree.side = THREE.DoubleSide;
    tree.position.x = this.randInt(-2000, 2000);
    tree.scale.multiplyScalar(0.01);
    tree.position.z = this.randInt(-2000, 2000);
    tree.geometry.computeBoundingBox();
    var height = tree.geometry.boundingBox.max.y;
    treeMaterial.uniforms.height.value = height;
    this.game.scene.add(tree);


    this.light = new THREE.Mesh(this.lightGeo, this.lightMaterial);
    this.light.position.y = this.randInt(2, 4);
    this.light.rotation.x = -Math.PI / 2;
    this.light.position.x = tree.position.x;
    this.light.position.z = tree.position.z;
    this.game.scene.add(this.light);

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

  update: function() {}
});