e.Controls = new Class({
  construct: function(options) {
    var fpsControls = true;
    // this.controls = new THREE.OrbitControls(this.camera);
    var self = this;
    this.camera = options.camera;
    this.game = options.game;
    // this.keyboard = new e.Keyboard();
    
    if(fpsControls){
      this.controls = new THREE.PointerLockControls(this.camera);
      this.game.scene.add( this.controls.getObject() );

      // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

      var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

      if (havePointerLock) {

        var element = document.body;

        var pointerlockchange = function(event) {

          if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

            self.controls.enabled = true;


          } else {

            self.controls.enabled = false;

          }

        }

        var pointerlockerror = function(event) {


        }

        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        document.addEventListener('pointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

        document.addEventListener('click', function(event) {


          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

          if (/Firefox/i.test(navigator.userAgent)) {

            var fullscreenchange = function(event) {

              if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                document.removeEventListener('fullscreenchange', fullscreenchange);
                document.removeEventListener('mozfullscreenchange', fullscreenchange);

                element.requestPointerLock();
              }

            }

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            documents.addEventListener('mozfullscreenchange', fullscreenchange, false);

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

          } else {
            element.requestPointerLock();

          }

        }, false);

      } 
    }
  },
  update: function() {
    this.controls.update();

  }
})