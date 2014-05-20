//CAVERN WITH WATER FALL
//STEPS UP TO TOP. YOU JUMP OUT AND THERE IS MESSAGE
//Control time from here

//Underground cavern with heart statue \/
//Extend helix doen into it. Under pond
//Sky writing particles

e.Game = new Class({
  extend: e.EventEmitter,


  //Come DOWN TO US REMIX
  construct: function() {
    this.yearTime = 60000;
    this.seasonTime = this.yearTime * 0.25;

    //WINTER POINT
    // this.summerPoint = 0.5;
    // this.fallPoint = 0.75;
    // this.winterPoint = 0.0;
    // this.springPoint = 0.25;

    //FALL START
    this.fallPoint = 0.0;
    this.winterPoint = 0.25;
    this.springPoint = 0.5;
    this.summerPoint = 0.75;


    //SUMMER START
    // this.summerPoint = 0.0;
    // this.fallPoint = 0.25;
    // this.winterPoint = 0.75;
    // this.springPoint = 1.0;


    this.checkSummer = true;
    this.checkFall = true;
    this.checkWinter = true;
    this.checkSpring = true;
    this.seasonCheckTimeout = this.yearTime / 4 - 100;
    // Bind render function permenantly
    this.render = this.render.bind(this);
    var self = this;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.autoClear = false;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 1, 1, 10000000);
    this.activeCamera = this.camera;


    this.renderer.setClearColor(0x021617);


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

    this.clock = new THREE.Clock();



    this.controls = new e.Controls({
      camera: this.camera,
      game: this
    });

    this.player = new e.Player({
      game: this,
      controls: this.controls,
      camera: this.camera,
      position: new THREE.Vector3(0, 70, 0),
      world: this.world
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
    this.world.update();
    this.player.update();
    this.controls.update();
    TWEEN.update();
    // this.renderer.clear();
    this.renderer.render(this.scene, this.activeCamera);
    // this.composer.render();
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

    if (self.checkSummer && Math.abs(this.cyclePoint - this.summerPoint) < 0.1) {
      self.checkSummer = false;
      this.trigger('summer');
      setTimeout(function() {
        self.checkSummer = true
      }, this.seasonCheckTimeout)
    }
    if (self.checkFall && Math.abs(this.cyclePoint - this.fallPoint) < 0.1) {
      this.trigger('fall');
      self.checkFall = false;
      setTimeout(function() {
        self.checkFall = true
      }, this.seasonCheckTimeout)
    }
    if (self.checkWinter && Math.abs(this.cyclePoint - this.winterPoint) < 0.1) {
      this.trigger('winter');
      self.checkWinter = false;
      setTimeout(function() {
        self.checkWinter = true
      }, this.seasonCheckTimeout)
    }
    if (self.checkSpring && Math.abs(this.cyclePoint - this.springPoint) < 0.1) {
      self.checkSpring = false;
      this.trigger('spring');
      setTimeout(function() {
        self.checkSpring = true
      }, this.seasonCheckTimeout)
    }

  }



});