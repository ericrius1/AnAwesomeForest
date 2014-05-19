e.Forest = new Class({
  randFloat: THREE.Math.randFloat,
  construct: function(options) {
    this.game = options.game;
    this.world = options.world;
    this.lengthMult = 0.5;
    this.trees = [];
    this.numTrees = 20;
    this.maxSteps = 7;
    this.timeMultiplier = 0.005;


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
          value: 0.0
        },
        startingTime: {
          type: 'f',
          value: performance.now() * this.timeMultiplier
        },
        width: {
          type: 'f',
          value: 100
        },
        green: {
          type: 'f',
          value: 1.0
        },
        alpha: {
          type: 'f',
          value: 0.5
        },
        fallTime: {
          type: 'f',
          value: 0
        },
        velocity: {
          type: 'v3',
          value: new THREE.Vector3(0, 0, 0)
        },
      },
      attributes: {
        pivotPoint: {
          type: 'f',
          value: null
        },
        wind: {
          type: 'f',
          value: null
        }
      },
      vertexShader: document.getElementById('leafVertexShader').textContent,
      fragmentShader: document.getElementById('leafFragmentShader').textContent,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.pivotPoint = new THREE.Float32Attribute(Math.pow(2, this.maxSteps - 1) * 3, 1);
    var numPoints = this.pivotPoint.array.length;
    for (var i = 0; i < numPoints; i++) {
      if (i % 3 === 0) {
        this.pivotPoint.setX(i, 1.0);
      } else {
        this.pivotPoint.setX(i, 0.0);
      }
    }

    this.wind = new THREE.Float32Attribute(Math.pow(2, this.maxSteps - 1) * 3, 1);
    var numWinds = this.wind.array.length;
    for (var i = 0; i < numWinds; i++) {
      this.wind.setX(i, Math.random());
    }



    for (var i = 0; i < this.numTrees; i++) {
      this.createTree();
    }


  },

  createTree: function() {
    var self = this;
    var randInt = THREE.Math.randInt;
    var maxSteps = this.maxSteps;
    var currentLeafIndex = 0;

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
    var leafGeo = new THREE.BufferGeometry();
    var numLeaves = Math.pow(2, maxSteps - 1);
    var leafVertices = new THREE.Float32Attribute(numLeaves * 3, 3);


    createTreeHelper(angle, 0, 0, 0, randInt(80, 120), 0, 10);



    function createTreeHelper(angle, x, y, z, length, count, size) {

      if (count < maxSteps) {

        var lengthMultOffset = .1;
        var tempLengthMult1 = self.lengthMult + self.randFloat(-lengthMultOffset, lengthMultOffset);
        var tempLengthMult2 = self.lengthMult + self.randFloat(-lengthMultOffset, lengthMultOffset);
        var tempLengthMult3 = self.lengthMult + self.randFloat(-lengthMultOffset, lengthMultOffset);
        var newLength1 = Math.max(1, length * tempLengthMult1);
        var newLength2 = Math.max(1, length * tempLengthMult2);
        var newLength3 = Math.max(1, length * tempLengthMult2);
        var angle1 = self.randFloat(0.52, 0.78);
        var angle2 = -self.randFloat(0.52, 0.78);
        var angle3 = -self.randFloat(0.52, 0.78);

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
        // path, segments, radius, radialSegments, closed 
        var geo = new THREE.TubeGeometry(path, 2, size, 3);
        for (var i = 0; i < geo.faces.length; i++) {
          geo.faces[i].materialIndex = 0;
        }
        treeGeo.merge(geo);
        createTreeHelper(tempAngle + angle1, newX, newY, newZ, newLength1, count + 1, size);
        createTreeHelper(tempAngle + angle2, newX, newY, newZ, newLength2, count + 1, size);
     

        if (count === maxSteps - 1) {
          //add a leaf

          var geo = new THREE.Geometry();
          var width = randInt(3, 6);
          var height = randInt(3, 6);
          var angle = self.randFloat(0, Math.PI);
          geo.vertices.push(new THREE.Vector3(-width, -height, 0));
          geo.vertices.push(new THREE.Vector3(width, -height, 0));
          geo.vertices.push(new THREE.Vector3(width, height, 0));

          geo.applyMatrix(new THREE.Matrix4().makeRotationY(angle));
          for (var i = 0; i < geo.vertices.length; i++) {
            var vertex = geo.vertices[i];
            vertex.x = vertex.x + newX;
            vertex.y = vertex.y + newY;
            vertex.z = vertex.z + newZ;
            leafVertices.setXYZ(currentLeafIndex, vertex.x, vertex.y, vertex.z);
            currentLeafIndex++;
          }
        }
      }
    }

    leafGeo.addAttribute('position', leafVertices);
    leafGeo.addAttribute('pivotPoint', this.pivotPoint);
    leafGeo.addAttribute('wind', this.wind);


    var tree = new THREE.Mesh(treeGeo, treeMaterial);
    tree.side = THREE.DoubleSide;
    tree.position.x = randInt(-this.world.islandRadius / 2, this.world.islandRadius / 2);
    tree.position.z = randInt(-this.world.islandRadius / 2, this.world.islandRadius / 2);

    tree.geometry.computeBoundingBox();
    var height = tree.geometry.boundingBox.max.y;
    var width = tree.geometry.boundingBox.max.x - tree.geometry.boundingBox.min.x;
    treeMaterial.uniforms.height.value = height;
    this.leafMaterial.uniforms.width.value = width / 2;
    this.game.scene.add(tree);
    tree.matrixAutoUpdate = false;
    tree.updateMatrix();
    this.trees.push(tree);

    var leaves = new THREE.Mesh(leafGeo, this.leafMaterial);
    leaves.position.x = tree.position.x;
    leaves.position.z = tree.position.z;
    // leaves.matrixAutoUpdate = false;
    leaves.updateMatrix();
    this.game.scene.add(leaves);


    var light = new THREE.Mesh(this.lightGeo, this.lightMaterial);
    light.position.y = 1;
    light.rotation.x = -Math.PI / 2;
    light.position.x = tree.position.x;
    light.position.z = tree.position.z;
    light.scale.y = this.randFloat(1.3, 2.0);
    light.position.y = this.randFloat(1.0, 3.0);
    this.game.scene.add(light);

  },

  leavesGrowBack: function(){
    var self = this;
    this.leafMaterial.uniforms.fallTime.value = 0;
    this.leafMaterial.uniforms.velocity.value.set(0,0,0);
    this.leafMaterial.uniforms.green.value = 1.0;
    this.leafMaterial.uniforms.alpha.value = 0.0
    var curAlpha = {a: 0}
    var finalAlpha = {a: 0.5}
    var fadeTween = new TWEEN.Tween(curAlpha).
      to(finalAlpha, this.game.seasonTime).
      onUpdate(function(){
        self.leafMaterial.uniforms.alpha.value = curAlpha.a
      }).start()

  },

  changeLeafColors: function(){
    var self = this;
    var curCol = {g: 1.0}
    var finalCol = {g: 0.0}
    var colorChangeTween = new TWEEN.Tween(curCol).
      to(finalCol, this.game.seasonTime).
      onUpdate(function(){
        self.leafMaterial.uniforms.green.value = curCol.g;
      }).start();
    // this.leafMaterial.uniforms.fallTime.value = 0;
    // this.leafMaterial.uniforms.velocity.value.set(0, -200, 1000);
  },


  update: function() {
    var time = performance.now() * this.timeMultiplier;
    this.leafMaterial.uniforms.time.value = time;
    this.leafMaterial.uniforms.fallTime.value += this.game.clock.getDelta();
  }
});