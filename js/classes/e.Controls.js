e.Controls = new Class({
  construct: function(options) {
    var self = this;
    this.camera = options.camera;
    this.player = options.player;
    this.game = options.game;
    // this.keyboard = new e.Keyboard();
    this.controls = new THREE.PointerLockControls(this.camera);
    this.game.scene.add( this.controls.getObject() );
    var blocker = document.getElementById('blocker');
    var pointer = document.getElementById('pointer');
    var instructions = document.getElementById('instructions');

    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {

      var element = document.body;

      var pointerlockchange = function(event) {

        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

          self.controls.enabled = true;

          blocker.style.display = 'none';
          pointer.style.display = 'block';

        } else {

          self.controls.enabled = false;

          blocker.style.display = '-webkit-box';
          blocker.style.display = '-moz-box';
          blocker.style.display = 'box';

          instructions.style.display = '';

        }

      }

      var pointerlockerror = function(event) {

        instructions.style.display = '';

      }

      // Hook pointer lock state change events
      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

      instructions.addEventListener('click', function(event) {

        instructions.style.display = 'none';

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

    } else {

      instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
  },
  update: function() {
    this.controls.update();

  }
})