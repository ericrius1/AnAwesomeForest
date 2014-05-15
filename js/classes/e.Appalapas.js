e.Appalapas = new Class({
  construct: function(options) {
    this.game = options.game;
    this.pond = options.pond;

    THREE.Curves.AppapalasCurve = new THREE.Curve.create(

      function() {

      },

      function(t) {

        var a = 30; // radius
        var b = 150; //height
        var t2 = 2 * Math.PI * t * b / 30;
        var tx = Math.cos(t2) * a,
          ty = Math.sin(t2) * a,
          tz = b * t;

        return new THREE.Vector3(tx, ty, tz);

      }
    );
    var path = new THREE.Curves.AppapalasCurve();
    // path, extrusion segments, radius, radialSegments, closed 
    var appaMat = new THREE.ShaderMaterial({
      vertexShader: document.getElementById('appalapasVertexShader').text,
      fragmentShader: document.getElementById('appalapasFragmentShader').text
    });
    var geo = new THREE.TubeGeometry(path, 100,  2, 6, false);
    console.log(geo.vertices.length);
    var appalapa = new THREE.Mesh(geo);
    appalapa.rotation.x = Math.PI/2;
    appalapa.position.set(this.pond.center.x, this.pond.center.y+ 100, this.pond.center.z)
    this.game.scene.add(appalapa)

  },

  update: function() {

  }


});