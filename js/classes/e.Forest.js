e.Forest = new Class({
  randFloat: THREE.Math.randFloat,
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.lengthMult = 0.63;
    this.angleLeft = Math.PI / 5;
    this.angleRight = Math.PI / 5;
    this.numTrees = 1;
    this.maxSteps = 6;



    this.lightGeo = new THREE.CircleGeometry(50, 50);
    this.lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xb8b5b9,
      map: THREE.ImageUtils.loadTexture("assets/light.png"),
      transparent: true
    });


    this.leafMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: "f",
          value: []
        },
        width: {
          type: 'f',
          value: 100
        }
      },
      vertexShader: document.getElementById('leafVertexShader').textContent,
      fragmentShader: document.getElementById('leafFragmentShader').textContent,
      side: THREE.DoubleSide,
      transparent: true,
    });
    for (var i = 0; i < this.numTrees; i++) {
      this.createTree();
    }


  },

  createTree: function() {
    var self = this;
    var randInt = THREE.Math.randInt;
    var maxSteps = this.maxSteps;

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


    createTreeHelper(angle, 0, 0, 0, randInt(80, 120), 0, 10);



    function createTreeHelper(angle, x, y, z, length, count, size) {

      if (count < maxSteps) {

        var lengthMultOffset = .1;
        var tempLengthMult = self.lengthMult + self.randFloat(-lengthMultOffset, lengthMultOffset);
        var newLength = Math.max(1, length * tempLengthMult);

        //We want greater angle randomness the deeper we get into the tree structure
        var angleOffset = map(count, 0, maxSteps - 1, .1, 1);
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
        for (var i = 0; i < geo.faces.length; i++) {
          geo.faces[i].materialIndex = 0;
        }
        treeGeo.merge(geo);
        createTreeHelper(tempAngle - self.angleRight, newX, newY, newZ, newLength, count + 1, size);
        createTreeHelper(tempAngle + self.angleLeft, newX, newY, newZ, newLength, count + 1, size);
        if (count === maxSteps - 1) {
          //add a leaf

          var geo = new THREE.Geometry();
          var width = randInt(3, 6);
          var height = randInt(3, 6);
          var angle = self.randFloat(0, Math.PI);
          geo.vertices.push(new THREE.Vector3(-width, -height, 0));
          geo.vertices.push(new THREE.Vector3(width, -height, 0));
          geo.vertices.push(new THREE.Vector3(width, height, 0));
          geo.vertices.push(new THREE.Vector3(-width, height, 0));
          geo.applyMatrix(new THREE.Matrix4().makeRotationY(angle));
          for (var i = 0; i < geo.vertices.length; i++) {
            var vertex = geo.vertices[i];
            vertex.x = vertex.x + newX;
            vertex.y = vertex.y + newY;
            vertex.z = vertex.z + newZ;
          }

          var face = new THREE.Face3(0, 1, 2);
          var face2 = new THREE.Face3(0, 2, 3);
          geo.faces.push(face);
          geo.faces.push(face2);
          leafGeo.merge(geo);
        }
      }
    }

    var tree = new THREE.Mesh(treeGeo, treeMaterial);
    tree.side = THREE.DoubleSide;
    tree.position.x = Math.random() > 0.5 ? randInt(-100, -1000) : randInt(100, 1000);
    tree.position.z = randInt(-this.world.pathLength / 2, this.world.pathLength / 2);

    tree.geometry.computeBoundingBox();
    var height = tree.geometry.boundingBox.max.y;
    var width = tree.geometry.boundingBox.max.x - tree.geometry.boundingBox.min.x;
    treeMaterial.uniforms.height.value = height;
    this.leafMaterial.uniforms.width.value = width / 2;
    this.game.scene.add(tree);

    var leaves = new THREE.Mesh(leafGeo, this.leafMaterial);
    leaves.position.x = tree.position.x;
    leaves.position.z = tree.position.z;
    this.game.scene.add(leaves);


    var light = new THREE.Mesh(this.lightGeo, this.lightMaterial);
    light.position.y = 1;
    light.rotation.x = -Math.PI / 2;
    light.position.x = tree.position.x;
    light.position.z = tree.position.z;
    light.scale.y = this.randFloat(1.3, 2.0);
    this.game.scene.add(light);


    // tree.scale.multiplyScalar(0.01);
    // var growTween = new TWEEN.Tween(tree.scale).
    // to({
    //   x: 1,
    //   y: 1,
    //   z: 1
    // }, 1000).
    // easing(TWEEN.Easing.Cubic.Out).start();
    // growTween.onComplete(function() {
    //   // self.createForest(zPos - 300);
    // })

  },

  update: function() {
    var time = performance.now();
    this.leafMaterial.uniforms.time.value = time * 0.005;
  }
});