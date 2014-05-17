e.Cliff = new Class({
  construct: function(options) {
    this.game = options.game;
    this.world = options.world
    var pathWidth = this.world.pathWidth;
    var stepHeight = 200;
    var stepDepth = 1000;
    var geo = new THREE.Geometry();
    var numSteps = 5;

    for (var i = 0; i < numSteps; i++) {

      v(-pathWidth / 2, i * stepHeight, i * stepDepth);
      v(pathWidth / 2, i * stepHeight, i * stepDepth);
      v(pathWidth / 2, (i + 1) * stepHeight, i * stepDepth);
      v(-pathWidth / 2, (i + 1) * stepHeight, i * stepDepth);
      f(i * 8, i * 8 + 1, i * 8 + 2);
      f(i * 8, i * 8 + 2, i * 8 + 3);
      var r = map(i, 0, numSteps, 0, 1);
      var color = new THREE.Color().setRGB(r, 0, 0.5);


      v(-pathWidth / 2, (i+1) * stepHeight, i * stepDepth);
      v(pathWidth / 2, (i+1) * stepHeight, i * stepDepth);
      v(pathWidth/2, (i+1) * stepHeight, (i+1) * stepDepth); 
      v(-pathWidth/2, (i+1) * stepHeight, (i+1) * stepDepth);
      f( i * 8 + 4, i * 8 + 5, i*8 + 6);
      f( i * 8 + 4, i * 8 + 6, i*8+7); 

      
      //set color of the 4 faces we just created
      for(var j = geo.faces.length-1; j > geo.faces.length-5; j--){
        for(var w = 0; w < 3; w++){
          geo.faces[j].vertexColors[w] = color;
          
        }
      }
    }

    // geo.computeFaceNormals();

    var cliffMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors,
      shading: THREE.FlatShading
    });
    var cliff = new THREE.Mesh(geo, cliffMat);
    cliff.position.z = pathWidth / 2;
    this.game.scene.add(cliff);

    function v(x, y, z) {
      geo.vertices.push(new THREE.Vector3(x, y, z));

    }

    function f(a, b, c) {
      geo.faces.push(new THREE.Face3(a, b, c));
    }

  }


});