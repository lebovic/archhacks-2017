const CALIFORNIA_EQ_DATA = {};

// var california_eq_grid; // actual 2d array
// var california_eq_grid_size = 128;
var california_eq_grid_h = 700;
var california_eq_grid_w = 700;
var california_eq_top_left = {"x" : -220, "y" : 300};
var california_eq_bot_right = {"x" : 250, "y" : -260};
var california_eq_range_x =  Math.abs(california_eq_top_left.x - california_eq_bot_right.x);
var california_eq_range_y = Math.abs(california_eq_top_left.y - california_eq_bot_right.y);
var california_eq_low_x = Math.min(california_eq_top_left.x, california_eq_bot_right.x);
var california_eq_low_y = Math.min(california_eq_top_left.y, california_eq_bot_right.y);

var eqGif = new THREE.TextureLoader().load( '../textures/EQ_Alpha.png' );

function california_eq_init() {

	var mainTexture = new THREE.TextureLoader().load( '../textures/california_main.png' );
	var dispTexture = new THREE.TextureLoader().load( '../textures/california_normal.png' );
	
	var geometry = new THREE.PlaneGeometry( california_eq_grid_w, california_eq_grid_h, 512, 512 );
	
	ambientLight = new THREE.AmbientLight( 0xffffff, 1.5 );
	screen2.add( ambientLight );

	pointLight = new THREE.PointLight( 0xffffff, 0.1 );
	pointLight.position.z = 1000;
	pointLight.position.x = 500;
	pointLight.position.y = 700;
	screen2.add( pointLight );

 	 	var material2 = new THREE.MeshStandardMaterial( {
		map: mainTexture,
		displacementMap: dispTexture,
		displacementScale: 40,
		displacementBias: -10,
		side: THREE.FrontSide
	} );

	screen2.mapMesh = new THREE.Mesh( geometry, material2 );
	screen2.add( screen2.mapMesh );

	startEarthQuakeRandom();
}

function startEarthQuakeRandom() {
	setTimeout(function(){ 
		addEarthQuake(california_eq_low_x + (Math.random() * california_eq_range_x), 
					  california_eq_low_y + (Math.random() * california_eq_range_y),
					  Math.ceil(Math.random() * 100 % 10));
		startEarthQuakeRandom()
	}, Math.random() * 4 * 1000);
}


function eqRowSequence() {	
	for(i = 0; i < eqSeq_1.length; i++) {
		addEarthQuake(eqSeq_1[i].x, eqSeq_1[i].y);
	}
}

function addEarthQuake(x, y, size, special) {
	var size = size || 5;
	// prevents random values from always being in upper left
	if (x + y > 160) {
		if ( (new Date()).getTime() % 2 == 1 ) {
			x = Math.min(x-y, california_eq_low_x + 10);
		} else {
			y = Math.min(y-x, california_eq_low_y + 10);
		}
	}

	var pGeometry = new THREE.CylinderGeometry( 1, 5 + size/2, 20 + size, 3 );
	var pMaterial = new THREE.MeshStandardMaterial({
		color: (special == true) ? 0x00ff00 : 0xff6060,
		transparent: true,
		side: THREE.DoubleSide,
		alphaTest: 0.5
	});


	pMaterial.alphaMap = eqGif;
	pMaterial.alphaMap.magFilter = THREE.NearestFilter;
	pMaterial.alphaMap.wrapT = THREE.RepeatWrapping;
	pMaterial.alphaMap.repeat.y = 1;


	var pyramid = new THREE.Mesh( pGeometry, pMaterial );
	pyramid.name = pyramid.uuid;
	pyramid.rotation.x = -Math.PI/2;
	pyramid.position.set(x, y, 30);
	screen2.add( pyramid );

	screen2.animateMesh.push(pyramid);

	setTimeout(function(){ 
		screen2.remove(pyramid.name);
	}, 6000);
}

var eqSeq_1 = [	
{"x": -110,  "y": -80},
 {"x": -100,  "y": -60},
 {"x": -80,   "y": -55},
 {"x": -60,  "y": -50},
 { "x": -50,  "y": -50},
 {"x": -45,  "y": -40},
 {"x": -45,  "y": -30},
 {"x": -50,  "y": -20}, 
 {"x": -60,  "y": -15},
 {"x": -70, "y":  -10},
 {"x": -80,  "y":  0},
 {"x": -90,  "y":  5},
 {"x": -100, "y":  15},
 {"x": -110, "y":  20},
 {"x": -115,  "y": 25},
 {"x": -125,  "y": 30}
];
