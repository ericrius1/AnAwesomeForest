e.Birds = new Class({
  extend: e.EventEmitter,

  construct: function(options) {
    var self = this;
    this.game = options.game;
    this.sholdUpdate = true;
    this.world = options.world;
    this.birdCamera = this.game.birdCamera;
    this.trees = options.forest.trees;
    this.numBirds = 50;
    this.boids = [];
    this.birds = [];
    this.southZ = -5000;
    this.targetingTrees = true;
    this.targetingTrees = false;
    this.on('leavesfell', function() {
      setTimeout(function() {
        self.headSouth();
        self.targetingTrees = false;
      }, 1000)
    });

    var boid;
    var randFloat = THREE.Math.randFloat;
    for (var i = 0; i < this.numBirds; i++) {
      boid = this.boids[i] = new Boid();
      boid.position.set(_.random(-this.world.islandRadius, this.world.islandRadius), _.random(300, 500), _.random(-this.world.islandRadius, this.world.islandRadius));
      var color = new THREE.Color().setRGB(0.078, randFloat(0.588, 0.82), randFloat(0.678, 0.87));
      var bird = new THREE.Mesh(this.createBirdGeo(), new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: color
      }));
      bird.position = boid.position;
      bird.phase = Math.floor(Math.random() * 62.83);
      bird.scale.multiplyScalar(4.0);
      bird.flapSpeedMultiplier = randFloat(0.0, 0.4);
      this.birds.push(bird);
      this.game.scene.add(bird);
      this.birdCamera = new THREE.PerspectiveCamera(50, 1, 1, 1000000);
      this.birds[0].add(this.birdCamera)
      this.birdCamera.position.x = 100;
      this.birdCamera.rotation.x = Math.PI / 2;
      // this.game.activeCamera = this.birdCamera;
    }
    // self.flockAroundTrees();

  },
  headSouth: function() {
    //send all birds south
    var target = new THREE.Vector3(_.random(-50, 50), 1000, this.southZ);
    this.targetingSouth = true;
    _.each(this.boids, function(boid) {
      boid.setGoal(target);
    });
  },

  returnHome: function(){
    var self = this;
    this.sholdUpdate = true;
    this.targetingSouth = false;
    _.each(this.boids, function(boid){
      boid.position.set(_.random(-100, 100), _.random(700, 900), self.southZ);
      boid.setGoal(new THREE.Vector3(_.random(-10, 10), _.random(600, 650), _.random(-10, 10)));
      boid.shouldFlock = true;
    });

  },

  //Have birds flock around trees
  flockAroundTrees: function() {
    var self = this;
    _.each(this.boids, function(boid) {
      boid.setGoal(self.pickTree());
    });
  },

  pickTree: function() {
    var tree = this.trees[_.random(0, this.trees.length - 1)];
    var target = tree.position.clone();
    target.y = tree.geometry.boundingBox.max.y + _.random(0, 100);
    return target;
  },

  update: function() {
    if(!this.sholdUpdate){
      return;
    }
    var time = performance.now();
    var boid;
    for (var i = 0; i < this.boids.length; i++) {
      boid = this.boids[i];
      var bird = this.birds[i];
      boid.run(this.boids);
      bird.geometry.verticesNeedUpdate = true;
      bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
      bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());
      bird.phase = (bird.phase + .1 + bird.flapSpeedMultiplier) % 62.83;
      bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;

      if (boid.goal && this.targetingTrees) {
        var distance = bird.position.distanceTo(boid.goal);
        if (distance < 100) {
          boid.setGoal(this.pickTree());

        }
      }

      if (boid.goal && this.targetingSouth) {
        var distance = bird.position.distanceTo(boid.goal);
        if (distance < 100) {
          // this.sholdUpdate = false;
        }
      }
    }


  },

  createBirdGeo: function() {
    var geo = new THREE.Geometry()
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

    return geo;

    function v(x, y, z) {
      geo.vertices.push(new THREE.Vector3(x, y, z));

    }

    function f(a, b, c) {
      geo.faces.push(new THREE.Face3(a, b, c));
    }

  }

});

var Boid = function() {

  var vector = new THREE.Vector3(),
    _acceleration, _width = 500,
    _height = 500,
    _depth = 200,
    _neighborhoodRadius = 100,
    _maxSpeed = 20,
    _maxSteerForce = 0.01,
    _goalSpeed = 0.005

  this.goal = null;
  this.shouldFlock = false;

  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  _acceleration = new THREE.Vector3();

  this.setGoal = function(target) {

    this.goal = target;

  }



  this.run = function(boids) {



    if (Math.random() > 0.5) {
      this.flock(boids);
    }

    this.move();


  }

  this.flock = function(boids) {
    if (this.goal) {
      _acceleration.add(this.reach(this.goal, _goalSpeed));
    }

    if(this.shouldFlock){
      _acceleration.add(this.alignment(boids));
      _acceleration.add(this.cohesion(boids));
      _acceleration.add(this.separation(boids));
      
    }

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