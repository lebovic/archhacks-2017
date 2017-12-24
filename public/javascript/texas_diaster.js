const TEXAS_DIASTER_DATA = {
	"MIN_ZOOM"   : 11,
	"CENTER" : { "lat" : 29.757478, "lng" : -95.3514902 },
	"ORIGIN" : { "lat" : 29.620715, "lng" : -95.5233427 },
	"CORNER" : { "lat" : 29.906365, "lng" : -95.1832977 },
	"SUPPLIES" : ["rescue", "food", "medical", "water"]
}

var texas_diaster_grid; // actual 2d array
var texas_diaster_grid_size = 128;
var texas_diaster_grid_h = 700;
var texas_diaster_grid_w = 700;
var texas_diaster_block_w = Math.floor(Math.min(texas_diaster_grid_h, texas_diaster_grid_w) / texas_diaster_grid_size) + 1;
var texas_diaster_block_h = Math.floor(Math.min(texas_diaster_grid_h, texas_diaster_grid_w) / texas_diaster_grid_size) + 1;
var texas_diaster_normalize_h = TEXAS_DIASTER_DATA.CORNER.lat - TEXAS_DIASTER_DATA.ORIGIN.lat;
var texas_diaster_normalize_w = TEXAS_DIASTER_DATA.CORNER.lng - TEXAS_DIASTER_DATA.ORIGIN.lng;
var texas_diaster_box_geo;
var texas_diaster_box_mat = [];
var context1;
var canvas1;
function texas_diaster_init() {
	canvas1 = document.createElement('canvas');
	context1 = canvas1.getContext('2d');
	context1.font = "Bold 20px Arial";
	context1.fillStyle = "rgba(0,0,0,0.95)";

	// canvas contents will be used for a texture
	texture1 = new THREE.Texture(canvas1) 
	texture1.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( { map: texture1} );

	sprite1 = new THREE.Sprite( spriteMaterial );
	sprite1.scale.set(200,100,1.0);
	sprite1.position.set( 50, 50, 0 );
	screen0.add( sprite1 );	


	var texture = new THREE.TextureLoader().load( '../textures/texas_diaster_start.png' );
	var geometry = new THREE.PlaneGeometry( texas_diaster_grid_w, texas_diaster_grid_h );
	var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.FrontSide } );
	screen0.mapMesh = new THREE.Mesh( geometry, material );
	screen0.add( screen0.mapMesh );

	texas_diaster_box_mat[0]  = new THREE.MeshBasicMaterial( {color: 0x00FF00} ); // rescue  green
	texas_diaster_box_mat[1]  = new THREE.MeshBasicMaterial( {color: 0xFFA500} ); // food - orange
	texas_diaster_box_mat[2]  = new THREE.MeshBasicMaterial( {color: 0xFF0000} ); // medical - red
	texas_diaster_box_mat[3]  = new THREE.MeshBasicMaterial( {color: 0x0000FF} ); // water - blue

	raycaster = new THREE.Raycaster();
	// create 2d array to hold summation of data
	resizeTexasDiasterMap();

 // new HttpClient().get('http://ccea4314.ngrok.io/api/resources', function(response) {
 //   console.log('Response', response);
//    data = JSON.parse(response);
    data = [{"supplies":["food","water"],"lat":29.7361352,"lng":-95.34327030000001,"contact":18476518454},{"supplies":["food","water"],"lat":29.7361352,"lng":-95.34327030000001,"contact":18476518454},{"supplies":["food","medical","rescue"],"lat":29.7429276,"lng":-95.3706247,"contact":16513354751},{"supplies":["food","water"],"lat":29.7492286,"lng":-95.3845977,"contact":16513354751},{"supplies":["medical","rescue"],"lat":29.7988129,"lng":-95.3107455,"contact":16513354751},{"supplies":["food","water"],"lat":29.6343504,"lng":-95.3422324,"contact":16513354751},{"supplies":["rescue"],"lat":29.6328914,"lng":-95.214253,"contact":16513354751},{"supplies":["food","medical"],"lat":29.7428491,"lng":-95.2638144,"contact":16513354751},{"supplies":["water","rescue"],"lat":29.74880649999999,"lng":-95.6104287,"contact":16513354751},{"supplies":["medical"],"lat":29.7910839,"lng":-95.5773172,"contact":16513354751},{"supplies":["rescue"],"lat":29.842126,"lng":-95.46169700000002,"contact":16513354751},{"supplies":["water","rescue"],"lat":29.8639322,"lng":-95.4204573,"contact":16513354751},{"supplies":["medical","rescue"],"lat":29.6722799,"lng":-95.3060788,"contact":16513354751},{"supplies":["food","water","rescue"],"lat":29.6720417,"lng":-95.578096,"contact":16513354751},{"supplies":["food","water"],"lat":29.6598426,"lng":-95.5771139,"contact":16513354751}];
    var x, y;

    // This is the logic to normalize all the data and group it up
    for (var i = 0; i < data.length; i++) {
      // ya, my b on this equation!
      x = Math.abs(parseInt(texas_diaster_grid_size * ((data[i].lng - TEXAS_DIASTER_DATA.ORIGIN.lng) / texas_diaster_normalize_w)));
      y = Math.abs(parseInt(texas_diaster_grid_size * ((data[i].lat - TEXAS_DIASTER_DATA.ORIGIN.lat) / texas_diaster_normalize_h)));

      if (x < 0 || y < 0 || x > texas_diaster_grid_size || y > texas_diaster_grid_size) {
      	continue;
			}

      if (data[i].supplies.indexOf("rescue") >= 0) {
        texas_diaster_grid[x][y] && texas_diaster_grid[x][y].rescue++;
      }
      if (data[i].supplies.indexOf("food") >= 0) {
      	console.log();
        texas_diaster_grid[x][y] && texas_diaster_grid[x][y].food++;
      }
      if (data[i].supplies.indexOf("medical") >= 0) {
        texas_diaster_grid[x][y] && texas_diaster_grid[x][y].medical++;
      }
      if (data[i].supplies.indexOf("water") >= 0) {
        texas_diaster_grid[x][y] && texas_diaster_grid[x][y].water++;
      }

      // if (data[i].lat == 29.620715) debugger;
    }

    for (i = 0; i < texas_diaster_grid_size; i++) {
      for (j = 0; j < texas_diaster_grid_size; j++) {
        addBlock(j, i, texas_diaster_grid[i][j], "16513354751");
      }
    }
//  });
}

// should add new request
socket.on('help_request', function(data){
	console.log('HELP REQUEST RECIEVED', data);
  addBlock(data.lat, data.lng, data.supplies, data.contact);
});

/*
{
	lat : Number, // between 0 - Grid_size
	lng : Number, // between 0 - Grid_size
	contact : String,
	supplies : [{
		type : String,
		count : Number
	}]
}
*/
function addBlock(lat, lng, supplies, contact) {
	var group = new THREE.Group();
	var heightOffset = 0;
	var block;
	const heightScale = 20;

	if (supplies.rescue > 0) {
		var offset = supplies.rescue * heightScale;
		block = new THREE.Mesh( new THREE.BoxGeometry( texas_diaster_block_w, texas_diaster_block_h, offset), texas_diaster_box_mat[0] );	
		block.position.set( texas_diaster_grid_w * (lng/texas_diaster_grid_size) - (texas_diaster_grid_w/2),
							texas_diaster_grid_h * (lat/texas_diaster_grid_size) - (texas_diaster_grid_h/2),
							heightOffset + ( offset / 2 ) );
		group.add( block );
		heightOffset += offset;	
	}

	if (supplies.food > 0) {
		var offset = supplies.food * heightScale;
		block = new THREE.Mesh( new THREE.BoxGeometry( texas_diaster_block_w, texas_diaster_block_h, offset), texas_diaster_box_mat[1] );	
		block.position.set( texas_diaster_grid_w * (lng/texas_diaster_grid_size) - (texas_diaster_grid_w/2),
							texas_diaster_grid_h * (lat/texas_diaster_grid_size) - (texas_diaster_grid_h/2),
							heightOffset + ( offset / 2 ) );
		group.add( block );
		heightOffset += offset;	
	}

	if (supplies.medical > 0) {
		var offset = supplies.medical * heightScale;
		block = new THREE.Mesh( new THREE.BoxGeometry( texas_diaster_block_w, texas_diaster_block_h, offset), texas_diaster_box_mat[2] );	
		block.position.set( texas_diaster_grid_w * (lng/texas_diaster_grid_size) - (texas_diaster_grid_w/2),
							texas_diaster_grid_h * (lat/texas_diaster_grid_size) - (texas_diaster_grid_h/2),
							heightOffset + ( offset / 2 ) );
		group.add( block );
		heightOffset += offset;	
	}

	if (supplies.water > 0) {
		var offset = supplies.water * heightScale;
		block = new THREE.Mesh( new THREE.BoxGeometry( texas_diaster_block_w, texas_diaster_block_h, offset), texas_diaster_box_mat[3] );	
		block.position.set( texas_diaster_grid_w * (lng/texas_diaster_grid_size) - (texas_diaster_grid_w/2),
							texas_diaster_grid_h * (lat/texas_diaster_grid_size) - (texas_diaster_grid_h/2),
							heightOffset + ( offset / 2 ) );
		group.add( block );
		heightOffset += offset;		
	}

	if (group.children.length > 0 ) {
		for(var i = 0; i < group.children.length; i++)
		screen0.add(group);	
	}
}

function resizeTexasDiasterMap() {

	texas_diaster_grid = new Array();

	for (i = 0; i < texas_diaster_grid_size; i++) {
		texas_diaster_grid[i] = new Array();
		for (j = 0; j < texas_diaster_grid_size; j++) {
	  		texas_diaster_grid[i][j] = {
	  									"rescue" : 0,
	  									"food" : 0,
	  									"medical" : 0,
	  									"water" : 0
	  								   };
	 	}
	}

}


var HttpClient = function() {
  this.get = function(aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function() {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    }

    anHttpRequest.open( "GET", aUrl, true );
    anHttpRequest.send( null );
  }
}