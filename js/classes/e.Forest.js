e.Forest = new Class({
  extend: e.EventEmitter,
  randFloat: THREE.Math.randFloat,
  construct: function(options) {
    var self = this;
    this.game = options.game;
    this.island = options.island;
    this.world = options.world;
    this.lengthMult = 0.5;
    this.trees = [];
    this.numTrees =50;
    this.doUpdate = true;
    this.maxSteps = 6;
    this.timeMultiplier = 0.005;
    this.noTreeRadius = 400;
    this.leafVelocity = 1100;
    this.numLeaves = Math.pow(2, this.maxSteps-1);
    this.potentialLeafColors = [
      new THREE.Color(0xd58b17),
      new THREE.Color(0xd55e17),
      new THREE.Color(0xd53a17),
      new THREE.Color(0xdfcc28),
      new THREE.Color(0xd71069),
      new THREE.Color(0xba1bb1),
      new THREE.Color(0xC7851C),
      new THREE.Color(0xBF1717),
      new THREE.Color(0xD6AD31),
      new THREE.Color(0xd52d17),

    ]

    this.on('birdsPassedIsland', function(){
      self.beginLeafFall();
    })

    this.lightGeo = new THREE.CircleGeometry(50, 50);


    this.leafMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: "f",
          value: 0.0
        },
        changePoint: {
          type: "f",
          value: 0.0
        },
        width: {
          type: 'f',
          value: 100
        },
        alpha: {
          type: 'f',
          value: 0.8
        },
        fallTime: {
          type: 'f',
          value: 0
        },
        originalColor: {
          type: 'c',
          value: new THREE.Color(0x0c761e)
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
        },
        color: {
          type: 'vec3',
          value: null
        }
      },
      vertexShader: document.getElementById('leafVertexShader').textContent,
      fragmentShader: document.getElementById('leafFragmentShader').textContent,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.pivotPoint = new THREE.Float32Attribute(this.numLeaves * 3, 1);
    var numPoints = this.pivotPoint.array.length;
    for (var i = 0; i < numPoints; i++) {
      if (i % 3 === 0) {
        this.pivotPoint.setX(i, 1.0);
      } else {
        this.pivotPoint.setX(i, 0.0);
      }
    }

    this.wind = new THREE.Float32Attribute(this.numLeaves * 3, 1);
    var numWinds = this.wind.array.length;
    for (var i = 0; i < numWinds; i += 3) {
      var windSpeed = Math.random()
      this.wind.setX(i, windSpeed);
      this.wind.setX(i + 1, windSpeed);
      this.wind.setX(i + 2, windSpeed);
    }

    this.color = new THREE.Float32Attribute(this.numLeaves*3, 3);
    var numColors = this.color.array.length;
    for(var i = 0; i < numColors; i+=3){
      var color = _.sample(this.potentialLeafColors);
      this.color.setXYZ(i, color.r, color.g, color.b);
      this.color.setXYZ(i+1, color.r, color.g, color.b);
      this.color.setXYZ(i+2, color.r, color.g, color.b);
    }

    var centerPos = new THREE.Vector2(0, 0)
    var points = THREE.GeometryUtils.randomPointsInGeometry(this.island.geometry, this.numTrees);
    for (var i = 0; i < this.numTrees; i++) {
      var treePos = new THREE.Vector2(points[i].x, points[i].y)
      if (treePos.distanceTo(centerPos) > this.noTreeRadius){
        this.createTree(treePos);
      }
    }
  },

  createTree: function(treePos) {
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

    var length = randInt(30, 150);
    size = map(length, 30, 150, 5, 15);
    size *= (THREE.Math.randFloat(0.9, 1.1));
    createTreeHelper(angle, 0, 0, 0, length, 0, size);



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

        //We want greater angle randomness the deeper we get into the tree structure
        var angleOffset = map(count, 0, maxSteps - 1, .1, 1);
        var tempAngle = angle + self.randFloat(-angleOffset, angleOffset);
        var newX = x + Math.cos(tempAngle) * length;
        var newY = y + Math.sin(tempAngle) * length;


        var dir = Math.random() > 0.5 ? 1 : -1;
        var newZ = z + Math.cos(tempAngle) * length * dir;
        var sizeMultiplier = THREE.Math.randFloat(0.5, 0.7);
        var size = Math.max(1, size * sizeMultiplier);

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
    leafGeo.addAttribute('color', this.color);



    var tree = new THREE.Mesh(treeGeo, treeMaterial);
    tree.side = THREE.DoubleSide;
    tree.position.x = treePos.x;
    tree.position.z = treePos.y;

    treeGeo.computeBoundingBox();
    var height = treeGeo.boundingBox.max.y;
    var width = treeGeo.boundingBox.max.x - treeGeo.boundingBox.min.x;
    treeMaterial.uniforms.height.value = height;
    this.leafMaterial.uniforms.width.value = width / 2;
    this.game.scene.add(tree);
    tree.matrixAutoUpdate = false;
    tree.updateMatrix();
    this.trees.push(tree);

    var leaves = new THREE.Mesh(leafGeo, this.leafMaterial);
    leaves.position.x = treePos.x;
    leaves.position.z = treePos.y;
    leaves.matrixAutoUpdate = false;
    leaves.updateMatrix();
    leaves.frustumCulled = false;
    this.game.scene.add(leaves);

  },

  leavesGrowBack: function() {
    var self = this;
    this.doUpdate = true;
    this.leafMaterial.uniforms.fallTime.value = 0;
    this.leafMaterial.uniforms.velocity.value.set(0, 0, 0);
    this.leafMaterial.uniforms.alpha.value = 0.0
    this.leafMaterial.uniforms.changePoint.value = 0.0;
    var curAlpha = {
      a: 0
    }
    var finalAlpha = {
      a: 0.8
    }
    var fadeTween = new TWEEN.Tween(curAlpha).
    to(finalAlpha, 16000).
    easing(TWEEN.Easing.Quartic.InOut).
    onUpdate(function() {
      self.leafMaterial.uniforms.alpha.value = curAlpha.a
    }).start()

  },

  changeLeafColors: function() {
    var self = this;
    var curPoint = {
      p: 0.0
    }
    var finalPoint = {
      p: 1.0
    }
    var colorChangeTween = new TWEEN.Tween(curPoint).
    to(finalPoint, this.game.fallTime * 0.9).
    easing(TWEEN.Easing.Cubic.InOut).
    onUpdate(function() {
      self.leafMaterial.uniforms.changePoint.value = curPoint.p;
    }).start();
  },

  beginLeafFall: function() {
    var self = this;
    this.leafMaterial.uniforms.fallTime.value = 0;
    this.leafMaterial.uniforms.velocity.value.set(200, 200, -this.leafVelocity);
    var curOpacity = {a : this.leafMaterial.uniforms.alpha.value};
    var finalOpacity = {a : 0.0};
    var fadeTween = new TWEEN.Tween(curOpacity).
      to(finalOpacity, 20000).
      delay(1000).
      easing(TWEEN.Easing.Cubic.InOut).
      onUpdate(function(){
        self.leafMaterial.uniforms.alpha.value=curOpacity.a
      }).start();
    this.trigger('leavesfell');

  },


  update: function() {
    if(!this.doUpdate){
      return;
    }
    var time = performance.now() * this.timeMultiplier;
    this.leafMaterial.uniforms.time.value = time;
    this.leafMaterial.uniforms.fallTime.value += this.game.clock.getDelta();

  }
});