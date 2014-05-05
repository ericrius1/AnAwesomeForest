e.Flora = new Class({
  construct: function(options){
    this.game = options.game;
    var geo = new THREE.CylinderGeometry(5, 5, 20);
    var trunk = new THREE.Mesh(geo);
    this.game.scene.add(trunk);

    var curProps = {
      scaleY: trunk.scale.y
    }
    var finalProps = {
      scaleY: trunk.scale.y * 10
    }
    var growTween = new TWEEN.Tween(curProps).
      to(finalProps, 2000).
      easing(TWEEN.Easing.Cubic.InOut).
      onUpdate(function(){
        trunk.scale.y = curProps.scaleY;
      }).start();
  }
});