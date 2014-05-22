var gMaxSpeed = 10;
e.Birds = new Class({
  extend: e.EventEmitter,

  construct: function(options) {
    var self = this;
    this.game = options.game;
    this.world = options.world;
    this.birdHeight = options.birdHeight;
    this.trees = options.forest.trees;
    this.numBirds = 50;
    this.boids = [];
    this.birds = [];
    this.shouldUpdate = true;
    this.maxSpeed = 200;
    this.hasPassedIsland = false;

    var boid;
    var randFloat = THREE.Math.randFloat;
    var startingX = 0, startingZ = this.game.size, startingY = this.birdHeight + 10;
    var xSpacing = 10;
    var zSpacing = 20;
    for (var i = 0; i < this.numBirds; i++) {
      boid = this.boids[i] = new Boid();
      boid.position.set(0, _.random(startingY-100, startingY + 100), startingZ + (i * zSpacing))
      if(i % 2 === 0){
        boid.position.x = startingX + (i * xSpacing);
      }else{
        boid.position.x = startingX - (i * xSpacing)
      }
      boid.setGoal(new THREE.Vector3(boid.position.x, boid.position.y, -boid.position.z));
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

    }

  },

  hibernate: function(){
    this.shouldUpdate = false;
    _.each(this.birds, function(bird){
      bird.visible = false;
    });
  },


  returnHome: function() {
    this.shouldUpdate = true;
    for(var i = 0; i < this.birds.length; i++){
      var boid = this.boids[i];
      boid.maxSpeed = 20;
      boid.setGoal(new THREE.Vector3(boid.position.x, boid.position.y, -boid.position.z));
      this.birds[i].visible = true;
    }

  },

  update: function() {
    if (!this.shouldUpdate) {
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
      if(!this.hasPassedIsland && i === 0 && boid.position.z < -this.world.islandRadius - 2000){
        this.hasPassedIsland = true;
        this.trigger('birdsPassedIsland');

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
    _goal, _neighborhoodRadius = 100,
    _maxSteerForce = 0.1,
    _avoidWalls = false;

  this.position = new THREE.Vector3();
  this.maxSpeed = gMaxSpeed;
  this.velocity = new THREE.Vector3();
  _acceleration = new THREE.Vector3();

  this.setGoal = function(target) {

    _goal = target;

  }


  this.run = function(boids) {


    /* else {

            this.checkBounds();

          }
          */

    if (Math.random() > 0.5) {

      this.flock(boids);

    }

    this.move();

  }

  this.flock = function(boids) {

    if (_goal) {

      _acceleration.add(this.reach(_goal, 0.005));

    }

    // _acceleration.add(this.alignment(boids));
    // _acceleration.add(this.cohesion(boids));
    // _acceleration.add(this.separation(boids));

  }

  this.move = function() {

    this.velocity.add(_acceleration);

    var l = this.velocity.length();

    if (l > this.maxSpeed) {

      this.velocity.divideScalar(l / this.maxSpeed);

    }

    this.position.add(this.velocity);
    _acceleration.set(0, 0, 0);

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