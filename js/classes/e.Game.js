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
    this.playerHeight = 50;
    this.yearTime = 215000;
    // this.yearTime = 80000;
    this.size = 40000;
    // WINTER POINT
    // this.winterPoint = 0.0;
    // this.springPoint = 0.33;
    // this.fallPoint = 0.66;

    //FALL START
    this.fallPoint = 0.0;
    this.winterPoint = 0.33;
    this.springPoint = 0.66;


    //SPRING START
    // this.springPoint = 0.0;
    // this.fallPoint = 0.33;
    // this.winterPoint = 0.66;


    this.checkFall = true;
    this.checkWinter = true;
    this.checkSpring = true;
    this.yearCompleted = false;
    this.seasonCheckTimeout = this.yearTime / 3 - 100;
    // Bind render function permenantly
    this.render = this.render.bind(this);
    var self = this;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.autoClear = false;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 1, 1, this.size);
    this.activeCamera = this.camera;


    this.renderer.setClearColor(0x000000);


    //year PROCESSING
    var renderModel = new THREE.RenderPass(this.scene, this.camera);
    var effectBloom = new THREE.BloomPass(1.0);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;
    effectCopy.renderToScreen = true;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.addPass(renderModel);
    this.composer.addPass(effectBloom);
    this.composer.addPass(effectCopy);
    this.world = new e.World({
      game: this,
      size: this.size
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
      world: this.world
    });

    this.start();
  },

  start: function() {
    this.clock.start()
    requestAnimationFrame(this.render);
  },


  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.composer.reset();
  },

  checkForNewSeason: function() {
    var self = this;
    var time = this.clock.getElapsedTime() * 1000;
    var cycleTime = time % this.yearTime;
    this.cyclePoint = cycleTime / this.yearTime;

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
    // this.composer.render(0.01);
    if(!this.yearCompleted){
      this.checkForNewSeason();
    }


  },



});