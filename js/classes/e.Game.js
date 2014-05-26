//Postprocessing
//Grow shit in spring time
//leaves rise up at different speeds

e.Game = new Class({
  extend: e.EventEmitter,


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
    this.winterPoint = 0.35;
    this.springPoint = 0.5;
    this.fallTime= this.yearTime * this.winterPoint;


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
      antialias: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, 1, 1, this.size);


    this.renderer.setClearColor(0x000000);

    initPostProcessing();
    // this.gui = new dat.GUI();
    // this.gui.add(this.effectController, 'focus', 0.0, 3.0, 0.025).onChange(function(){
    //   self.matChange();
    // }); 
    // this.gui.add(this.effectController, 'aperture', 0.001, 0.2, 0.001).onChange(function(){
    //   self.matChange();
    // });
    // this.gui.add(this.effectController, 'maxblur', 0.0, 3.0, 0.025).onChange(function(){
    //   self.matChange();
    // }); 
    // this.gui.close();

    function initPostProcessing() {
      // self.effectController = {
      //   focus: 1.0,
      //   aperture: 0.025,
      //   maxblur: 1.0
      // }
      var renderPass = new THREE.RenderPass(self.scene, self.camera);
      self.bokehPass = new THREE.BokehPass(self.scene, self.camera, {
        focus: 1.0,
        aperture: 0.01,
        maxblur: 0.1,
        width: window.innerWidth,
        height: window.innerHeight
      });
      bloomPass = new THREE.BloomPass(0.75);
      self.bokehPass.renderToScreen = true;

      self.composer = new THREE.EffectComposer(self.renderer);
      self.composer.addPass(renderPass);
      self.composer.addPass(bloomPass);
      self.composer.addPass(self.bokehPass)

    }

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

    //Everyting is loaded, now lets play music
    music.play();
    this.start();
  },

  start: function() {
    this.clock.start()
    requestAnimationFrame(this.render);
  },

  // matChange: function() {
  //   this.bokehPass.uniforms["focus"].value = this.effectController.focus;
  //   this.bokehPass.uniforms["aperture"].value = this.effectController.aperture;
  //   this.bokehPass.uniforms["maxblur"].value = this.effectController.maxblur;
  // },


  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.composer.setSize(window.innerWidth, window.innerHeight);
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
      //We want to set focus to 0 to bring message into focus
      this.focusText();
      setTimeout(function() {
        self.checkSpring = true
      }, this.seasonCheckTimeout)
    }

  },

  focusText: function(){
    var self = this;
    var currentFocus = {f: this.bokehPass.uniforms.focus.value, blur: this.bokehPass.uniforms.maxblur.value};
    var endingFocus = {f: 0, blur: 0.01};
    var focusTween = new TWEEN.Tween(currentFocus).
      to(endingFocus, 10000).
      easing(TWEEN.Easing.Cubic.InOut).
      onUpdate(function(){
        self.bokehPass.uniforms.focus.value = currentFocus.f;
        self.bokehPass.uniforms.maxblur.value = currentFocus.blur;
      }).start();
  },
  //cyclePoint is a num from 0 to 1 which represents where in season we are currently
  render: function() {
    requestAnimationFrame(this.render);
    this.world.update();
    this.player.update();
    this.controls.update();
    TWEEN.update();
    this.composer.render(0.01);
    // this.renderer.render(this.scene, this.camera);
    if (!this.yearCompleted) {
      this.checkForNewSeason();
    }


  },



});