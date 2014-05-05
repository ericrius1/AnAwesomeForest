var scene, camera, controls, renderer;

// var play = false;
var play = false;
// var song = loadAudio('assets/starwars.mp3');
init();
function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);


}

function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);
    director.update();
    TWEEN.update();
    renderer.render(scene, camera);
}

// handle resizing windows
window.onload = function(){
  window.addEventListener( 'resize', onWindowResize, false );
};

function onWindowResize(){

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


function loadAudio(uri)
{
    var audio = new Audio();
    audio.addEventListener('canplaythrough', function(){
      if(play){
        this.play();
      }
    }, false); // It works!!
    audio.src = uri;
    return audio;
}

