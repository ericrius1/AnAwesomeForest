window.e = {
  init: function() {
    e.game = new e.Game();
  
  }


};

window.map = function(value, min1, max1, min2, max2) {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
};



var sound = loadAudio('assets/nature.mp3');
var play = true;

function loadAudio(uri) {
  var audio = new Audio();
  audio.addEventListener('canplaythrough', function() {
    if (play) {
      this.play();
    }
  }, false); // It works!!
  audio.src = uri;
  return audio;
}