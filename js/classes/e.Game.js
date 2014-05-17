//CAVERN WITH WATER FALL
//STEPS UP TO TOP. YOU JUMP OUT AND THERE IS MESSAGE
//Control time from here

e.Game = new Class({
  extend: e.EventEmitter,


  //Come DOWN TO US REMIX
  construct: function() {
    // Bind render function permenantly
    this.render = this.render.bind(this);
    var self = this;

    this.renderer = new THREE.WebGLRenderer({
      antialias: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 1, 1, 10000000);
    this.activeCamera = this.camera;


    this.renderer.setClearColor(0x53c3e);

    this.yearTime = 10000;
    this.summerPoint = 0.0;
    this.fallPoint = 0.25;
    this.winterPoint = 0.5;
    this.springPoint = 0.75;
    this.checkSummer = true;
    this.checkFall = true;
    this.checkWinter = true;
    this.checkSpring = true;
    this.seasonCheckTimeout = this.yearTime/4 - 100;

    //year PROCESSING
    var renderModel = new THREE.RenderPass(this.scene, this.camera);
    var effectBloom = new THREE.BloomPass(0.1);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    effectCopy.renderToScreen = true;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(renderModel);
    this.composer.addPass(this.effectFXAA);
    this.composer.addPass(effectBloom);
    this.composer.addPass(effectCopy);
    this.world = new e.World({
      game: this
    });

    document.body.appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    var light = new THREE.PointLight(0xff00ff);
    light.position.y = 1000;
    // this.scene.add(light);

    this.clock = new THREE.Clock();


    this.player = new e.Player({
      game: this,
      camera: this.camera,
      position: new THREE.Vector3(0, 70, 0)
    });


    this.controls = new e.Controls({
      camera: this.camera,
      player: this.player,
      game: this
    });

    this.start();
  },

  start: function() {
    this.clock.start()
    requestAnimationFrame(this.render);
  },

  //cyclePoint is a num from 0 to 1 which represents where in season we are currently
  render: function() {
    requestAnimationFrame(this.render);
    this.controls.update();
    this.world.update();
    TWEEN.update();
    this.renderer.clear();
    // this.renderer.render(this.scene, this.activeCamera);
    this.composer.render();
    this.checkForNewSeason();


  },

  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
    this.composer.reset();
  },

  checkForNewSeason: function() {
    var self = this;
    var time = this.clock.getElapsedTime() * 1000;
    var cycleTime = time % this.yearTime;
    this.cyclePoint = cycleTime / this.yearTime;

    if ( self.checkSummer && Math.abs(this.cyclePoint - this.summerPoint) < 0.1 ) {
      console.log('summer!');
      self.checkSummer = false;
      this.trigger('summer');
      setTimeout(function() {
        self.checkSummer = true
      }, this.seasonCheckTimeout)
    }
    if ( self.checkFall && Math.abs(this.cyclePoint - this.fallPoint) < 0.1 ) {
      console.log('fall!');
      this.trigger('fall');
      self.checkFall = false;
      setTimeout(function() {
        self.checkFall = true
      }, this.seasonCheckTimeout)
    }
    if (self.checkWinter && Math.abs(this.cyclePoint - this.winterPoint) < 0.1  ) {
      console.log('winter!');
      this.trigger('winter');
      self.checkWinter = false;
      setTimeout(function() {
        self.checkWinter = true
      }, this.seasonCheckTimeout)
    }
    if (self.checkSpring && Math.abs(this.cyclePoint - this.springPoint) < 0.1  ) {
      console.log('spring!');
      self.checkSpring = false;
      this.trigger('spring');
      setTimeout(function() {
        self.checkSpring = true
      }, this.seasonCheckTimeout)
    }

  }



});