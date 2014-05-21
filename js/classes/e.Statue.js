e.Statue = new Class({
  construct: function(options){
    this.game = options.game
    var geo = new THREE.BoxGeometry(100, 100, 100);
    var mat = new THREE.MeshBasicMaterial({color: 0xff00ff});
    var box = new THREE.Mesh(geo, mat);
    box.position.y = 1000;
    this.game.scene.add(box);

    
    
  },
  

})