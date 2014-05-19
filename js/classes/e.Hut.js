e.Hut = new Class({
  construct: function(options){
    this.game = options.game
    var height = 140;
    var radiusBottom= 200 
    var radiusTop = radiusBottom - 10;
    // radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded
    var wallGeo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 30, 10, true);


    this.wallTexture = THREE.ImageUtils.loadTexture('assets/walls.jpg');
    this.wallTexture.wrapS = this.wallTexture.wrapT = THREE.RepeatWrapping;
    var wallsMat = new THREE.MeshBasicMaterial({map: this.wallTexture, wireframe: false, side: THREE.DoubleSide});
    var walls = new THREE.Mesh(wallGeo, wallsMat);
    walls.position.y += height/2;
    walls.position.z = -500;
    this.game.scene.add(walls);




    // radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength
    var roofGeo = new THREE.SphereGeometry(radiusTop, 30, 10, 0, Math.PI, 0, Math.PI);
    var roofMat = new THREE.MeshBasicMaterial({color: 0x352207, side: THREE.DoubleSide});
    var roof = new THREE.Mesh(roofGeo, roofMat);

    roof.position.y = height - 10;
    roof.rotation.x = -Math.PI/2;
    roof.scale.z = 0.8;
    roof.position.z = -500;
    this.game.scene.add(roof);
  },

});