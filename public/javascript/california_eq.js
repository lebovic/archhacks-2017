const CALIFORNIA_EQ_DATA = {};

// var california_eq_grid; // actual 2d array
// var california_eq_grid_size = 128;
var california_eq_grid_h = 700;
var california_eq_grid_w = 700;
// var california_eq_block_w = Math.floor(Math.min(california_eq_grid_h, california_eq_grid_w) / california_eq_grid_size) - 1;
// var california_eq_block_h = Math.floor(Math.min(california_eq_grid_h, california_eq_grid_w) / california_eq_grid_size) - 1;
// var california_eq_normalize_h = TEXAS_DIASTER_DATA.CORNER.lat - TEXAS_DIASTER_DATA.ORIGIN.lat;
// var california_eq_normalize_w = TEXAS_DIASTER_DATA.CORNER.lng - TEXAS_DIASTER_DATA.ORIGIN.lng;
// var california_eq_box_geo;
// var california_eq_box_mat = [];


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

}