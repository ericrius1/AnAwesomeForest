/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function(camera) {

  var scope = this;

  camera.rotation.set(0, 0, 0);

  var speedMultiplier = 1;

  var pitchObject = new THREE.Object3D();
  pitchObject.add(camera);
  pitchObject.rotation.x += .2

  var yawObject = new THREE.Object3D();
  var playerHeight = 70
  yawObject.position.y = playerHeight;
  yawObject.add(pitchObject);

  var moveForward = false;
  var moveBackward = false;
  var moveLeft = false;
  var moveRight = false;

  var isOnObject = false;
  var canJump = false;


  var speedBoost = 20;
  var speedSlow = .5;

  var prevTime = performance.now();

  var velocity = new THREE.Vector3();

  var PI_2 = Math.PI / 2;

  var onMouseMove = function(event) {

    if (scope.enabled === false) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    yawObject.rotation.y -= movementX * 0.002;
    pitchObject.rotation.x -= movementY * 0.002;

    pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));

  };

  var onKeyDown = function(event) {

    switch (event.keyCode) {

      case 16:
        speedMultiplier = speedBoost;
        break

      case 17:
        speedMultiplier = speedSlow;
        break;

      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;

      case 32: // space
        if (canJump === true) velocity.y += 1550;
        canJump = false;
        break;

    }

  };

  var onKeyUp = function(event) {

    switch (event.keyCode) {

      case 16:
        speedMultiplier = 1;
        break;
      case 17:
        speedMultiplier = 1;
        break;

      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;

    }

  };

  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  this.enabled = false;

  this.getObject = function() {

    return yawObject;

  };

  this.isOnObject = function(boolean) {

    isOnObject = boolean;
    canJump = boolean;

  };

  this.teleport = function(point){
    yawObject.position.set(point.x, point.y, point.z);
  }

  this.getDirection = function() {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3(0, 0, -1);
    var rotation = new THREE.Euler(0, 0, 0, "YXZ");

    return function(v) {

      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);

      v.copy(direction).applyEuler(rotation);

      return v;

    }

  }();

  this.update = function() {

    if (scope.enabled === false) return;
    var time = performance.now();
    var delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass


    if (moveForward) velocity.z -= 3200.0 * delta * speedMultiplier;
    if (moveBackward) velocity.z += 3200.0 * delta * speedMultiplier;

    if (moveLeft) velocity.x -= 3200.0 * delta * speedMultiplier;
    if (moveRight) velocity.x += 3200.0 * delta * speedMultiplier;

    if (isOnObject === true) {

      velocity.y = Math.max(0, velocity.y);

    }


    yawObject.translateX(velocity.x * delta);
    yawObject.translateY(velocity.y * delta);
    yawObject.translateZ(velocity.z * delta);

    if (yawObject.position.y < playerHeight) {

      velocity.y = 0;
      yawObject.position.y = playerHeight;

      canJump = true;

    }

    prevTime = time;

  };

};