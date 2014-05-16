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
    this.birdCamera = new THREE.PerspectiveCamera(50, 1, 1, 1000000);
    this.activeCamera = this.camera;


    this.renderer.setClearColor(0x053c3e);

    //POST PROCESSING
    var renderModel = new THREE.RenderPass(this.scene, this.camera);
    var effectBloom = new THREE.BloomPass(0.2);
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
    light.position.y = 100;
    this.scene.add(light);
    this.clock = new THREE.Clock();

    this.controls = new e.Controls({
      camera: this.camera,
      player: this.player,
      game: this
    });

    this.start();
  },

  start: function() {
    requestAnimationFrame(this.render);
  },

  render: function() {
    requestAnimationFrame(this.render);


    this.controls.update();
    this.world.update();
    TWEEN.update();
    this.renderer.clear();
    // this.renderer.render(this.scene, this.activeCamera);
    this.composer.render();

  },

  onWindowResize: function() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
    this.composer.reset();
  }



});