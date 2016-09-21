var App = function(socketConnection){
  this.connection = socketConnection;
  this.container;
  this.camera;
  this.scene;
  this.renderer;
  this.mesh;
  this.controls
  this.texture;
  this.target;
  this.w = 256;
  this.h = 256;
  this.points;
  this.canvas;
  this.ctx;
  this.radius = 41;
  this.radInc = -1;
  this.controllerID;
  this.initCanvas();
  this.init();
}

App.prototype = {
  initCanvas:function(){
      this.canvas = document.getElementById("canvas");
      this.ctx   = canvas.getContext("2d");
      this.canvas.width = window.innerWidth;
      this.canvas.height= window.innerHeight;
      this.ctx.strokeStyle = 'rgba(255,0,0,0.5)';
      this.ctx.lineWidth = 15;
      this.canvas.addEventListener("mousedown",function(e){e.stopPropagation();});
  },
  drawTarget:function(){
    this.radius+=this.radInc;
    if(this.radius<20 || this.radius>70)this.radInc*=-1;
    if(this.radInc<0){ this.ctx.strokeStyle = 'rgba(255,0,0,0.5)';}else{this.ctx.strokeStyle = 'rgba(255,0,0,0)';}
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.beginPath();
    //this.ctx.arc(window.innerWidth/2,window.innerHeight/2,this.radius,0,Math.PI*2,false);
    this.ctx.ellipse(window.innerWidth/2,window.innerHeight/2,this.radius,this.radius,0,Math.PI*2,false);
    this.ctx.closePath();
    this.ctx.stroke();
    //console.log(this.radius);
  },

  init:function(e){
    this.container = document.getElementById("container");
    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 50000 );
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.0004 );

    this.points = this.generateTerrainPoints(this.w,this.h);
    //this.camera.position.y = this.points[ this.w/2 + this.h/2 * this.w ] * 10 + 500;

    var geometry = new THREE.PlaneBufferGeometry( 7500, 7500, this.w - 1, this.h - 1 );
		geometry.rotateX( - Math.PI / 2 );
    var vertices = geometry.attributes.position.array;
		for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
			vertices[ j + 1 ] = this.points[ i ] * 10;
		}

    var material = new THREE.MeshBasicMaterial( { color:0x0c2259, wireframe: false } );
    material.side = THREE.DoubleSide;
    this.mesh = new THREE.Mesh( geometry,material);
		this.scene.add( this.mesh );

    this.renderer = new THREE.WebGLRenderer();
		//this.renderer.setClearColor( 0xefd1b5 );
		//this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.controls = new THREE.OrbitControls( this.camera );
    this.controls.object.position.y = 1100;
    this.controls.target = new THREE.Vector3(1000,1100,this.w);
    //controls.addEventListener( 'change', render );

    this.addTarget();

    this.container.appendChild( this.renderer.domElement );
    window.addEventListener( 'resize', this.onResize.bind(this), false );
    this.animate();
  },

  addTarget:function(){

    var geometry = new THREE.SphereGeometry( 100, 32, 32 );
    var material = new THREE.MeshBasicMaterial( { color:0x3a5393, wireframe: false } );
    this.target = new THREE.Mesh( geometry, material );
    this.target.position.set(0,1500,1000);
    this.scene.add( this.target );
  },

  moveTarget:function(){
    var angle = Math.PI * 2 * Math.random();
    this.target.position.set(Math.cos(angle)*2000,1500,Math.sin(angle)*2000);

  },

  checkTarget:function(){
    var p = new THREE.Vector3(this.target.position.x,this.target.position.y,this.target.position.z);
    var vector = p.project(this.camera);
    vector.x = (vector.x + 1)/2 * window.innerWidth;
    vector.y = (vector.y + 1)/2 * window.innerHeight;
    //return vector;
    if(this.radius<=20 && Math.abs(window.innerWidth/2-vector.x)<10 && Math.abs(window.innerHeight/2-vector.y)<10){
      console.log("GOOD JOB");
      this.moveTarget();
      //send score
      this.connection.send(JSON.stringify({message:2,controllerID:String(this.controllerID),type:"changeScore"}));
    }else if(this.radius<=20 && Math.abs(window.innerWidth/2-vector.x)<40 && Math.abs(window.innerHeight/2-vector.y)<40){
      console.log("TOO LATE");
      this.connection.send(JSON.stringify({message:-1,controllerID:String(this.controllerID),type:"changeScore"}));
     }

  },

  animate:function(){
    requestAnimationFrame( this.animate.bind(this) );
    this.render();
  },

  render:function(){
    this.updateCamera();
    this.controls.update();
    this.checkTarget();
    this.drawTarget();
		this.renderer.render( this.scene, this.camera );
  },

  updateCamera:function(){
    //this.camera.rotation.y+= 0.001
  },

  onResize:function(e){
    this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
    this.canvas.width = window.innerWidth;
    this.canvas.height= window.innerHeight;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  },

  generateTerrainPoints:function(width,height){
    var size    = width * height;
    var data    = new Uint8Array( size );
		var perlin  = new ImprovedNoise()
    var quality = 1
    var z       = Math.random() * 100;

		for ( var j = 0; j < 4; j ++ ) {
			for ( var i = 0; i < size; i ++ ) {
				var x = i % width, y = ~~ ( i / width );
				data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
			}
			quality *= 5;
		}
    return data;
  },

  rotate:function(val,valy){
    console.log("should rotate");
    var evt = new MouseEvent('mousemove',{
      "clientX":val,
      "clientY":valy,
      "shifKey":false
    });
    document.dispatchEvent(evt);
  },

  start:function(val,valy){
    console.log("should start");
    var evt = new MouseEvent('mousedown',{
      "clientX":val,
      "clientY":valy,
      "shifKey":false
    });
    document.dispatchEvent(evt);
  },

  end:function(val,valy){
    console.log("should end");
    var evt = new MouseEvent('mouseup',{
      "clientX":val,
      "clientY":valy,
      "shifKey":false
    });
    document.dispatchEvent(evt);
  }

}
