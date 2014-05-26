window.e = {
  init: function() {
    e.game = new e.Game();
  
  }


};

window.map = function(value, min1, max1, min2, max2) {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
};



var music = loadAudio('assets/m83.mp3');
var playMusic = false;

function loadAudio(uri) {
  var audio = new Audio();
  audio.src = uri;
  return audio;
}