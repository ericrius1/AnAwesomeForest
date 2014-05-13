e.Flora = new Class({
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


    var attributes = {
      color: {
        type: 'c',
        value: []
      }
    };
    this.leafMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: "f",
          value: 1.0
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
    this.treeGeo = new THREE.Geometry();
    this.createForest();



  },

  createForest: function() {
    var self = this;
    var randInt = THREE.Math.randInt;

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

    var materials = [
      treeMaterial,
      this.leafMaterial
    ];
    var multiMat = new THREE.MeshFaceMaterial(materials);
    var angle = Math.PI / 2;
    var treeGeo = new THREE.Geometry();
    createTree(angle, 0, 0, 0, 100, 0, 10);


    function createTree(angle, x, y, z, length, count, size) {

      if (count < self.maxSteps) {

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
        for (var i = 0; i < geo.faces.length; i++) {
          geo.faces[i].materialIndex = 0;
        }
        treeGeo.merge(geo);
        createTree(tempAngle - self.angleRight, newX, newY, newZ, newLength, count + 1, size);
        createTree(tempAngle + self.angleLeft, newX, newY, newZ, newLength, count + 1, size);
        if (count === self.maxSteps - 1) {
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
          for(var i = 0; i < geo.vertices.length; i++){
            var vertex = geo.vertices[i];
            vertex.x = vertex.x + newX;
            vertex.y = vertex.y + newY;
            vertex.z = vertex.z + newZ;
          }
          
          var face = new THREE.Face3(0, 1, 2);
          var face2 = new THREE.Face3(0, 2, 3);
          face.materialIndex = 1;
          face2.materialIndex = 1;
          geo.faces.push(face);
          geo.faces.push(face2);
          treeGeo.merge(geo);
        }
      }
    }

    var tree = new THREE.Mesh(treeGeo, multiMat);
    tree.side = THREE.DoubleSide;
    tree.position.x = randInt(-2000, 2000);
    tree.scale.multiplyScalar(0.01);
    tree.position.z = randInt(-2000, 2000);

    tree.geometry.computeBoundingBox();
    var height = tree.geometry.boundingBox.max.y;
    var width = tree.geometry.boundingBox.max.x - tree.geometry.boundingBox.min.x;
    treeMaterial.uniforms.height.value = height;
    this.leafMaterial.uniforms.width.value = width / 2;
    this.game.scene.add(tree);


    this.light = new THREE.Mesh(this.lightGeo, this.lightMaterial);
    this.light.position.y = randInt(2, 4);
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

  update: function() {
    var time = performance.now();
    this.leafMaterial.uniforms.time.value = time * 0.005;
  }
});