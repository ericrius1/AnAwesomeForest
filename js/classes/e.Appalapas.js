e.Appalapas = new Class({
  construct: function(options) {
    this.game = options.game;
    this.pond = options.pond;
    this.currentPoint = 0;
    this.numPoints = 200;
    this.direction = 1;
    this.height = 250;
    var self = this;
    THREE.Curves.AppapalasCurve = new THREE.Curve.create(

      function() {

      },

      function(t) {

        var a = 30; // radius
        var b = self.height; //height
        var t2 =  2 * Math.PI * t * b / 50;
        var tx = Math.sin(t2) * a,
          tz = Math.cos(t2) * a,
          ty = b * t;

        return new THREE.Vector3(tx, ty, tz);
      }
    );
    var path = new THREE.Curves.AppapalasCurve();

    var uniforms = {
      height: {
        type: 'f',
        value: self.height
      },
      ballHeight: {
        type: 'f',
        value: 200.0
      }
    }
    // path, extrusion segments, radius, radialSegments, closed 
    var appaMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('appalapasVertexShader').text,
      fragmentShader: document.getElementById('appalapasFragmentShader').text
    });



    var geo = new THREE.TubeGeometry(path, 100,  2, 6, false);
    this.points = geo.parameters.path.getSpacedPoints(500);
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(5));
    this.sphere.position = this.points[this.currentPoint++];

    this.game.scene.add(this.sphere);
    var appalapa = new THREE.Mesh(geo, appaMat);
    this.game.scene.add(appalapa)

  },

  update: function() {
    this.sphere.position = this.points[this.currentPoint]
    this.currentPoint += this.direction;
    if(this.currentPoint === this.points.length-1 || this.currentPoint === 0){
      this.direction *= -1;
    }

  }


});