const TEXAS_TWEET_DATA = {
	"MIN_ZOOM"   : 11,
	"CENTER" : { "lat" : 29.757478, "lng" : -95.3514902 },
	"ORIGIN" : { "lat" : 29.620715, "lng" : -95.5233427 },
	"CORNER" : { "lat" : 29.906365, "lng" : -95.1832977 }
}

var texas_tweet_grid; // actual 2d array
var texas_tweet_grid_size = 128;
var texas_tweet_grid_h = 700;
var texas_tweet_grid_w = 700;
var texas_tweet_block_w = Math.floor(Math.min(texas_tweet_grid_h, texas_tweet_grid_w) / texas_tweet_grid_size) + 1;
var texas_tweet_block_h = Math.floor(Math.min(texas_tweet_grid_h, texas_tweet_grid_w) / texas_tweet_grid_size) + 1;
var texas_tweet_normalize_h = TEXAS_DIASTER_DATA.CORNER.lat - TEXAS_DIASTER_DATA.ORIGIN.lat;
var texas_tweet_normalize_w = TEXAS_DIASTER_DATA.CORNER.lng - TEXAS_DIASTER_DATA.ORIGIN.lng;
var texas_tweet_box_geo;
var texas_tweet_box_mat = [];


function texas_tweet_init() {
	var texture = new THREE.TextureLoader().load( '../textures/texas_diaster_start.png' );
	var geometry = new THREE.PlaneGeometry( texas_tweet_grid_w, texas_tweet_grid_h, 128, 128 );
	var material = new THREE.MeshLambertMaterial( {
										 map: texture,
										 side: THREE.FrontSide,
										 emissiveIntensity: 6 
										} );
	screen1.mapMesh = new THREE.Mesh( geometry, material );
	screen1.add( screen1.mapMesh );

	var ambientLight = new THREE.AmbientLight( 0xffffff, .8 );
	screen1.add( ambientLight );

	// new HttpClient().get('http://241fcd3e.ngrok.io/api/sentiment', function(response) {
	// 	console.log('Response', response);
	// 	data = JSON.parse(response);   
	// });
	var data = [{"lat":29.696956510000003,"lng":-95.82927844,"sentiment":-0.32927293899212784},{"lat":29.696956510000003,"lng":-95.82927844,"sentiment":-0.32927293899212784},{"lat":29.790469813600005,"lng":-95.7887647144,"sentiment":0.3146662516836327},{"lat":29.620378260401313,"lng":-95.63557634022538,"sentiment":0.16595922791691042},{"lat":29.619678879087466,"lng":-95.6349464612903,"sentiment":0.3352723057852569},{"lat":29.619678700183393,"lng":-95.63494630016517,"sentiment":0.18519154507842628},{"lat":29.9551726,"lng":-95.5364404,"sentiment":-0.32927293899212784},{"lat":29.7887153008,"lng":-95.5325608992,"sentiment":-0.32927293899212784},{"lat":29.78767806638725,"lng":-95.53242000901756,"sentiment":-0.32927293899212784},{"lat":29.78767800000425,"lng":-95.53242000000058,"sentiment":-0.32927293899212784},{"lat":29.794166544,"lng":-95.52213148800001,"sentiment":-0.007303343654247563},{"lat":29.794436882697216,"lng":-95.52170282743603,"sentiment":0.00609059151180813},{"lat":29.746891400000003,"lng":-95.41803010000001,"sentiment":0.006112056151497347},{"lat":30.004291985308164,"lng":-95.41719608338049,"sentiment":-0.32927293899212784},{"lat":30.004308458945623,"lng":-95.41719603000342,"sentiment":-0.32927293899212784},{"lat":29.998303384349374,"lng":-95.41310726169792,"sentiment":-0.32927293899212784},{"lat":29.9983030000246,"lng":-95.41310700001675,"sentiment":-0.32927293899212784},{"lat":29.720760376000005,"lng":-95.402398872,"sentiment":-0.32927293899212784},{"lat":29.762900000000005,"lng":-95.3832,"sentiment":0.41769652219175435},{"lat":29.762900000000005,"lng":-95.3832,"sentiment":0.3136359489785514},{"lat":29.762900000000005,"lng":-95.3832,"sentiment":0.09383803856122519},{"lat":29.762900000000002,"lng":-95.3832,"sentiment":0.5992873739623188},{"lat":29.762900000000002,"lng":-95.3832,"sentiment":0.6572419011231374},{"lat":29.728242693440006,"lng":-95.38285744992002,"sentiment":0.05066191582641566},{"lat":29.7604267,"lng":-95.3698028,"sentiment":-0.04051987357327225},{"lat":29.7604267,"lng":-95.3698028,"sentiment":-0.08623955611125123},{"lat":29.7604267,"lng":-95.3698028,"sentiment":-0.08904069159069072},{"lat":29.7604267,"lng":-95.3698028,"sentiment":-0.04824714386138129},{"lat":29.7604267,"lng":-95.3698028,"sentiment":-0.16833107060256614},{"lat":29.7604267,"lng":-95.3698028,"sentiment":-0.12041126249644496},{"lat":29.757132790000007,"lng":-95.35548567,"sentiment":-0.5027072276807993},{"lat":29.757132790000007,"lng":-95.35548567,"sentiment":-0.07169726272182353},{"lat":29.757132790000007,"lng":-95.35548567,"sentiment":-0.03048515451857492},{"lat":29.757132790000007,"lng":-95.35548567,"sentiment":-0.16442450617913318},{"lat":29.755500725488005,"lng":-95.355443926896,"sentiment":-0.32927293899212784},{"lat":29.755498110167395,"lng":-95.35544386000429,"sentiment":-0.32927293899212784}];

	var x, y;

	// This is the logic to normalize all the data and group it up
	for (var i = 0; i < data.length; i++) {
	// ya, my b on this equation!
		x = Math.abs(parseInt(texas_tweet_grid_size * ((data[i].lng - TEXAS_DIASTER_DATA.ORIGIN.lng) / texas_tweet_normalize_w)));
		y = Math.abs(parseInt(texas_tweet_grid_size * ((data[i].lat - TEXAS_DIASTER_DATA.ORIGIN.lat) / texas_tweet_normalize_h)));

		if (x < 0 || y < 0 || x > texas_tweet_grid_size || y > texas_tweet_grid_size) {
			continue;
		}

		addSentiment(x, y, data[i].sentiment);
	}
	
}


function addSentiment(lng, lat, sentiment) {
	var sColor;
	if  ( sentiment >= 0 ) {
		sColor = new THREE.Color( 0, sentiment,  0);
	} else {
		sColor = new THREE.Color(-1 * sentiment, 0, 0);
	}
	var x = texas_tweet_grid_w * (lng/texas_tweet_grid_size) - (texas_tweet_grid_w/2);
	var y = texas_tweet_grid_h * (lat/texas_tweet_grid_size) - (texas_tweet_grid_h/2);

	if (x < 60) {

	var spotLight = new THREE.SpotLight( sColor, 1.0, 400 , .8, 0.88, 1);
	} else {

	var spotLight = new THREE.SpotLight( sColor, 3.4, 700 , .8, 0.25, 1);
	}

	
	spotLight.position.set( x, y, 300 );


	spotLight.target.position.set( x, y, -20);
	//  spotLight.castShadow = true;
	 console.log("x y", x, y);
	// spotLight.shadow.mapSize.width = 16;
	// spotLight.shadow.mapSize.height = 16;
	screen1.add( spotLight.target );
	screen1.add( spotLight );
}