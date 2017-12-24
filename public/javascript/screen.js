function Screen(id, options) {
	  this.bindAll();
	  this.initialize(id, options);
}

/**
 * Bind all methods to the instance.
 */
Screen.prototype.bindAll = function(){
  var instance = this;

  function bind(name) {
    var method = instance[name];
    if (typeof method != "function"){ return; }
    instance[name] = function() { return method.apply(instance, arguments); };
  }

  for (var all in instance){ bind(all); }
};

Screen.prototype.initialize = function(id, options){

	// want ID to match render and animate to graphic
	this.id = id;
	this.options = options;
	this.parentDiv = options.div;
	this.parentDiv.renderId = id;

	this.animateMesh = [];

	this.camera = new THREE.PerspectiveCamera( 55, this.parentDiv.clientWidth / this.parentDiv.clientHeight, 1, 2000 );
	this.camera.position.z = (options.cameraZ || 500);
	this.renderer =  new THREE.WebGLRenderer();
	this.renderer.setPixelRatio( window.devicePixelRatio );
	this.renderer.setSize(this.parentDiv.clientWidth, this.parentDiv.clientHeight );

	this.scene = new THREE.Scene();

    this.parentDiv.appendChild( this.renderer.domElement );

    if (this.options.expandOff) {
    	this.parentDiv.getElementsByClassName("expandImg")[0].style.display = "none";
    }

    this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    // this.controls.enableZoom = false;
   
   
    // This is what we will do when someone resizes the screen
    window.addEventListener( 'resize', this.onWindowResize, false );
};


Screen.prototype.onWindowResize = function(){

	this.camera.aspect = this.parentDiv.clientWidth / this.parentDiv.clientHeight;
	this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.parentDiv.clientWidth, this.parentDiv.clientHeight );
};

Screen.prototype.animate = function() {
	switch (this.id) {
		case 0: this.animate0(); break;
		case 1: this.animate1(); break;
		case 2: this.animate2(); break;
		case 3: this.animate3(); break;
		case 4: this.animate4(); break;
	}
}

Screen.prototype.animate0 = function() {    
 //cancelAnimationFrame(this.animationFrame);
	this.animationFrame = requestAnimationFrame( this.animate0 );

	// this.globe.rotation.x += 0.001;
	// this.globe.rotation.y += 0.008;

	raycaster.setFromCamera( mouse, this.camera );
	var intersects = raycaster.intersectObjects( this.scene.children );
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) //INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			//	INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			//INTERSECTED.material.emissive.setHex( 0xff0000 );
			context1.clearRect(0,0,640,480);
				var message = "Contact Info: 165-133-54751";	
				var metrics = context1.measureText(message);
				var width = metrics.width;
				context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
				context1.fillRect( 0,0, width+8,20+8);
				context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
				context1.fillRect( 2,2, width+4,20+4 );
				context1.fillStyle = "rgba(0,0,0,1)"; // text color
				context1.fillText( message, 4,20 );
				texture1.needsUpdate = true;
		}
	} else {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;		
		context1.clearRect(0,0,300,300);
		texture1.needsUpdate = true;
	}

	this.controls.update();

	this.render();
};

Screen.prototype.animate1 = function() {    
	this.animationFrame = requestAnimationFrame( this.animate1 );
	this.controls.update();
	this.render();
};

Screen.prototype.animate2 = function() {    
	this.animationFrame = requestAnimationFrame( this.animate2 );

	for(var i = 0; i < this.animateMesh.length; i++) {
		this.animateMesh[i].rotation.y += 0.015;
		this.animateMesh[i].material.alphaMap.offset.y += .0015;
	}

	this.controls.update();
	this.render();
};

Screen.prototype.animate3 = function() {    
	this.animationFrame = requestAnimationFrame( this.animate3 );
	this.controls.update();
	this.render();
};

Screen.prototype.animate4 = function() {    
	this.animationFrame = requestAnimationFrame( this.animate4 );

	this.controls.update();
	this.render();
};


Screen.prototype.render = function() {
	this.renderer.render( this.scene, this.camera );
}

Screen.prototype.add = function(mesh) {
  	this.scene.add(mesh);
};

Screen.prototype.remove = function(name) {
	this.scene.remove(this.scene.getChildByName(name));
}

/**
 * Helper method to convert for LatLng to vertex.
 * @param  {google.maps.LatLng} latLng - The LatLng to convert.
 * @return {THREE.Vector3} The resulting vertex.
 */
Screen.prototype.fromLatLngToVertex = function(latLng) {
  var projection = this.map.getProjection(),
    point = projection.fromLatLngToPoint(latLng),
    vertex = new THREE.Vector3();

  vertex.x = point.x;
  vertex.y = 255 - point.y;
  vertex.z = 0;

  return vertex;
};
