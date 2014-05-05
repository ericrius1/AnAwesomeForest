// var controlsEnabled = false;
var controlsEnabled = true;
function CameraController() {
  var self;
  this.init = function() {
    self = this;
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
    scene.add(camera);
    if (controlsEnabled) {
      controls = new THREE.TrackballControls(camera);
      camera.position.z = 100;
    }
  };



  this.update = function() {

    var delta = clock.getDelta();
    if (controlsEnabled) {
      controls.update(delta);
    }
  };

}