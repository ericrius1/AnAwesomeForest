e.Bird = new Class({

  construct: function(options) {
    var self = this;
    this.game = options.game;
    this.birdCamera = this.game.birdCamera;
    this.geo = new THREE.Geometry();
    this.phase = Math.floor(Math.random() * 62.83);
    this.trees = options.forest.trees;
    this.numBirds = 50;
    this.boids = [];
    this.birds = [];
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

    function v(x, y, z) {
      self.geo.vertices.push(new THREE.Vector3(x, y, z));

    }

    function f(a, b, c) {
      self.geo.faces.push(new THREE.Face3(a, b, c));
    }

    var bird, boid, target;
    var randFloat = THREE.Math.randFloat;
    for (var i = 0; i < this.numBirds; i++) {
      boid = this.boids[i] = new Boid();
      boid.position = new THREE.Vector3(0, 100, -100);
      var tree = this.trees[_.random(0, this.trees.length - 1)];
      if(i !== 1){
        target = tree.position.clone();
        target.y = tree.geometry.boundingBox.max.y + _.random(0, 100);
        boid.setGoal(target); 
      }
      boid.position.set(_.random(-500, 500), _.random(100, 500), _.random(-1000, 1000));
      boid.velocity.x = Math.random() * 2 - 1;
      boid.velocity.y = Math.random() * 2 - 1;
      boid.velocity.z = Math.random() * 2 - 1;
      boid.setWorldSize(1000, 1000, 1000);
      var color = new THREE.Color().setRGB(0.078, randFloat(0.588, 0.82), randFloat(0.678, 0.87));
      bird = this.birds[i] = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: color
      }));
      bird.position = boid.position;
      this.game.scene.add(bird);


    }
    this.currentTreeIndex++;

  },

  update: function() {
    var time = performance.now();
    this.phase = (this.phase + 0.1);
    var boid, bird, target;
    for (var i = 0; i < this.boids.length; i++) {
      boid = this.boids[i];
      bird = this.birds[i];
      boid.run(this.boids);
      bird.geometry.verticesNeedUpdate = true;
      bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
      bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());
      bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(this.phase) * 5;

      if(i!==1){

        var distance = boid.goal.distanceTo(bird.position);
        if (distance < 20) {
          var tree = this.trees[_.random(0, this.trees.length - 1)];
          target = tree.position.clone();
          target.y = tree.geometry.boundingBox.max.y;
          boid.setGoal(target);
        }
      }

      if (i === 0) {
        //attach a chase camera to this bird
        var relativeCameraOffset = new THREE.Vector3(-200, 50, 0);
        var cameraOffset = relativeCameraOffset.applyMatrix4(bird.matrixWorld);

        this.birdCamera.position.x = cameraOffset.x;
        this.birdCamera.position.y = cameraOffset.y;
        this.birdCamera.position.z = cameraOffset.z;
        this.birdCamera.lookAt(bird.position);
      }
    }
  }

});

var Boid = function() {

  var vector = new THREE.Vector3(),
    _acceleration, _width = 500,
    _height = 500,
    _depth = 200,
    _neighborhoodRadius = 100,
    _maxSpeed = 4,
    _maxSteerForce = 0.1,
    _avoidWalls = false;

  this.goal = null;

  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  _acceleration = new THREE.Vector3();

  this.setGoal = function(target) {

    this.goal = target;

  }

  this.setAvoidWalls = function(value) {

    _avoidWalls = value;

  }

  this.setWorldSize = function(width, height, depth) {

    _width = width;
    _height = height;
    _depth = depth;

  }

  this.run = function(boids) {

    if (_avoidWalls) {

      vector.set(-_width, this.position.y, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(_width, this.position.y, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, -_height, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, _height, this.position.z);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, this.position.y, -_depth);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

      vector.set(this.position.x, this.position.y, _depth);
      vector = this.avoid(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);

    }

    if (Math.random() > 0.5) {

      this.flock(boids);

    }
    this.move();


  }

  this.flock = function(boids) {
    if (this.goal) {
      _acceleration.add(this.reach(this.goal, 0.005));
    }

    _acceleration.add(this.alignment(boids));
    _acceleration.add(this.cohesion(boids));
    _acceleration.add(this.separation(boids));

  }

  this.move = function() {

    this.velocity.add(_acceleration);

    var l = this.velocity.length();

    if (l > _maxSpeed) {

      this.velocity.divideScalar(l / _maxSpeed);

    }

    this.position.add(this.velocity);
    _acceleration.set(0, 0, 0);

  }

  this.checkBounds = function() {

    if (this.position.x > _width) this.position.x = -_width;
    if (this.position.x < -_width) this.position.x = _width;
    if (this.position.y > _height) this.position.y = -_height;
    if (this.position.y < -_height) this.position.y = _height;
    if (this.position.z > _depth) this.position.z = -_depth;
    if (this.position.z < -_depth) this.position.z = _depth;

  }

  //

  this.avoid = function(target) {

    var steer = new THREE.Vector3();

    steer.copy(this.position);
    steer.sub(target);

    steer.multiplyScalar(1 / this.position.distanceToSquared(target));

    return steer;

  }

  this.repulse = function(target) {

    var distance = this.position.distanceTo(target);

    if (distance < 150) {

      var steer = new THREE.Vector3();

      steer.subVectors(this.position, target);
      steer.multiplyScalar(0.5 / distance);

      _acceleration.add(steer);

    }

  }

  this.reach = function(target, amount) {

    var steer = new THREE.Vector3();

    steer.subVectors(target, this.position);
    steer.multiplyScalar(amount);

    return steer;

  }

  this.alignment = function(boids) {

    var boid, velSum = new THREE.Vector3(),
      count = 0;

    for (var i = 0, il = boids.length; i < il; i++) {

      if (Math.random() > 0.6) continue;

      boid = boids[i];

      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {

        velSum.add(boid.velocity);
        count++;

      }

    }

    if (count > 0) {

      velSum.divideScalar(count);

      var l = velSum.length();

      if (l > _maxSteerForce) {

        velSum.divideScalar(l / _maxSteerForce);

      }

    }

    return velSum;

  }

  this.cohesion = function(boids) {

    var boid, distance,
      posSum = new THREE.Vector3(),
      steer = new THREE.Vector3(),
      count = 0;

    for (var i = 0, il = boids.length; i < il; i++) {

      if (Math.random() > 0.6) continue;

      boid = boids[i];
      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {

        posSum.add(boid.position);
        count++;

      }

    }

    if (count > 0) {

      posSum.divideScalar(count);

    }

    steer.subVectors(posSum, this.position);

    var l = steer.length();

    if (l > _maxSteerForce) {

      steer.divideScalar(l / _maxSteerForce);

    }

    return steer;

  }

  this.separation = function(boids) {

    var boid, distance,
      posSum = new THREE.Vector3(),
      repulse = new THREE.Vector3();

    for (var i = 0, il = boids.length; i < il; i++) {

      if (Math.random() > 0.6) continue;

      boid = boids[i];
      distance = boid.position.distanceTo(this.position);

      if (distance > 0 && distance <= _neighborhoodRadius) {

        repulse.subVectors(this.position, boid.position);
        repulse.normalize();
        repulse.divideScalar(distance);
        posSum.add(repulse);

      }

    }

    return posSum;

  }

}