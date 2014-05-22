e.Landscape = new Class({
  extend: e.EventEmitter,

  construct: function(islandRadius, options) {
    var self = this;
    this.game = options.game;
    this.on('snowStarting', function(){
      self.snowCover();
    });

    this.snowFillTime = 40000;
    this.summerGroundColor = new THREE.Color(0x3f3f17);
    this.winterGroundColor = new THREE.Color(0xffffff);
    var groundTexture = THREE.ImageUtils.loadTexture('assets/dirt.jpg');
    groundTexture.repeat.set( 40, 40);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.anistropy = 16;
    var groundMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x5f5f5f),
      map: groundTexture,
    });

    var islandGeo = new THREE.CircleGeometry(islandRadius, 100);
    this.ground = new THREE.Mesh(islandGeo, groundMat);

    this.ground.rotation.x = -Math.PI / 2;
    this.game.scene.add(this.ground);

    var snowMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.0});
    this.snow = new THREE.Mesh(islandGeo, snowMaterial);
    this.snow.rotation.x = -Math.PI/2;
    this.snow.position.y = 0;
    this.game.scene.add(this.snow);

  },

  snowCover: function() {
    console.log('snow cover');
    var delay = 4000;
    var self = this;
    var curSnowPos = {
      y: this.snow.position.y,
    }
    var finalSnowPos = {
      y: 60
    }
    var curSnowOpacity = {
      a: this.snow.material.opacity
    }
    var finalSnowOpacity = {
      a: 1
    }
    var snowFillTween = new TWEEN.Tween(curSnowOpacity).
      to(finalSnowOpacity, this.snowFillTime/2).
      easing(TWEEN.Easing.Cubic.InOut).
      delay(delay).
      onUpdate(function(){
        self.snow.material.opacity = curSnowOpacity.a;
      }).start()
    var snowRiseTween = new TWEEN.Tween(curSnowPos).
      to(finalSnowPos, this.snowFillTime).
      delay(delay).
      easing(TWEEN.Easing.Cubic.InOut).
      onUpdate(function(){
        self.snow.position.y = curSnowPos.y;
      }).start();
  },

  snowMelt: function() {
    var self = this;
    var curSnowPos = {
      y: this.snow.position.y,
      a: 1
    }
    var finalSnowPos = {
      y: 0,
      a: 0 
    };
    var snowMeltTween = new TWEEN.Tween(curSnowPos).
      to(finalSnowPos, this.snowFillTime/2).
      easing(TWEEN.Easing.Cubic.InOut).
      onUpdate(function(){
        self.snow.position.y = curSnowPos.y;
        self.snow.material.opacity = curSnowPos.a
      }).start();

  }

});