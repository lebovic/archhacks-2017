const TEXAS_DIASTER_DATA = {	
	"MIN_ZOOM"   : 6,
	"CENTER" : { "lat" : 31.3757594, "lng" : -101.3568667 },
	"ORIGIN" : { "lat" : 26.2630182, "lng" : -103.8584689 },
	"CORNER" : { "lat" : 35.6932503, "lng" : -94.0274727 },
	"SUPPLIES" : ["rescue", "food", "medical", "water"]
}

var texas_diaster_grid; // actual 2d array
var texas_diaster_grid_size = 64;
var texas_diaster_grid_h = 600;
var texas_diaster_grid_w = 500;
var texas_diaster_normalize_h = TEXAS_DIASTER_DATA.CORNER.lat - TEXAS_DIASTER_DATA.ORIGIN.lat;
var texas_diaster_normalize_w = TEXAS_DIASTER_DATA.CORNER.lng - TEXAS_DIASTER_DATA.ORIGIN.lng;
var texas_diaster_box_geo;
var texas_diaster_box_mat = [];


function texas_diaster_init() {
	var texture = new THREE.TextureLoader().load( '../textures/texas_diaster_start.png' );
	var geometry = new THREE.PlaneGeometry( texas_diaster_grid_w, texas_diaster_grid_h );
	var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.FrontSide } );
	screen0.mapMesh = new THREE.Mesh( geometry, material );
	screen0.add( screen0.mapMesh );

	// texas_diaster_box_geo  = new THREE.BoxGeometry( 5, 4, 5) ;
	texas_diaster_box_mat[0]  = new THREE.MeshBasicMaterial( {color: 0x00FF00} ); // rescue  green
	texas_diaster_box_mat[1]  = new THREE.MeshBasicMaterial( {color: 0xFFA500} ); // food - orange
	texas_diaster_box_mat[2]  = new THREE.MeshBasicMaterial( {color: 0xFF0000} ); // medical - red
	texas_diaster_box_mat[3]  = new THREE.MeshBasicMaterial( {color: 0x0000FF} ); // water - blue

	// create 2d array to hold summation of data
	resizeTexasDiasterMap();

	// $.ajax({
 //        headers: { "Accept": "application/json"},
 //        type: 'GET',
 //        url: 'http://241fcd3e.ngrok.io/api/resources',
 //        crossDomain: true,
 //        beforeSend: function(xhr){
 //            xhr.withCredentials = true;
 //      },
 //        success: function(data, textStatus, request){
            var data = [{"supplies":["food","water"],"lat":29.7361352,"lng":-95.34327030000001,"contact":18476518454},{"supplies":["food","water"],"lat":29.7361352,"lng":-95.34327030000001,"contact":18476518454},{"supplies":["food","medical","rescue"],"lat":29.7429276,"lng":-95.3706247,"contact":16513354751},{"supplies":["food","water"],"lat":29.7492286,"lng":-95.3845977,"contact":16513354751},{"supplies":["medical","rescue"],"lat":29.7988129,"lng":-95.3107455,"contact":16513354751},{"supplies":["food","water"],"lat":29.6343504,"lng":-95.3422324,"contact":16513354751},{"supplies":["rescue"],"lat":29.6328914,"lng":-95.214253,"contact":16513354751},{"supplies":["food","medical"],"lat":29.7428491,"lng":-95.2638144,"contact":16513354751},{"supplies":["water","rescue"],"lat":29.74880649999999,"lng":-95.6104287,"contact":16513354751},{"supplies":["medical"],"lat":29.7910839,"lng":-95.5773172,"contact":16513354751},{"supplies":["rescue"],"lat":29.842126,"lng":-95.46169700000002,"contact":16513354751},{"supplies":["water","rescue"],"lat":29.8639322,"lng":-95.4204573,"contact":16513354751},{"supplies":["medical","rescue"],"lat":29.6722799,"lng":-95.3060788,"contact":16513354751},{"supplies":["food","water","rescue"],"lat":29.6720417,"lng":-95.578096,"contact":16513354751},{"supplies":["food","water"],"lat":29.6598426,"lng":-95.5771139,"contact":16513354751}];
//.get("http://241fcd3e.ngrok.io/api/resources", function(data) {
			// data == {"contact": Number,"lat": Number,"lng": Number, supplies":[String] }
			var x,y;
			
			// This is the logic to normalize all the data and group it up
			// for(var i = 0; i < data.length; i++) {
			for(var i = 0; i < 2; i++) {
				// ya, my b on this equation!			
				x = Math.abs(parseInt(texas_diaster_grid_size * ((data[i].lng - TEXAS_DIASTER_DATA.ORIGIN.lng) / texas_diaster_normalize_w)));
				y = Math.abs(parseInt(texas_diaster_grid_size * ((data[i].lat - TEXAS_DIASTER_DATA.ORIGIN.lat) / texas_diaster_normalize_h)));
				
				console.log("x", x);
				console.log("y", y);
				console.log("data", data[i]);
				console.log(data[i].supplies.indexOf("food"));
				if (data[i].supplies.indexOf("rescue") >= 0) {
					texas_diaster_grid[x][y].rescue++;
				} else if (data[i].supplies.indexOf("food") >= 0) {
					texas_diaster_grid[x][y].food++;
					console.log("FFFFFOOOOOD");
					console.log(texas_diaster_grid[x][y]);
				} else if (data[i].supplies.indexOf("medical") >= 0) {
					texas_diaster_grid[x][y].medical++;
				} else if (data[i].supplies.indexOf("water") >= 0) {
					texas_diaster_grid[x][y].water++;
				}
				
			}
			console.log(texas_diaster_grid);
			for (i = 0; i < texas_diaster_grid_size; i++) {
				for (j = 0; j < texas_diaster_grid_size; j++) {
			  		addBlock(j, i, texas_diaster_grid[i][j], "16513354751");
			 	}
			}
// 		}	            
//  	});
}

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

	var blockW = 5;
	var blockH = 5;

	if (lat == 23 && lng == 55) {debugger;}

	if (supplies.rescue > 0) {
		block = new THREE.Mesh( new THREE.BoxGeometry( blockW, blockH, supplies.rescue * 10), texas_diaster_box_mat[0] );	
		block.position.set( lng, lat, heightOffset );
		group.add( block );
		heightOffset += supplies.rescue * 10;	
	}

	if (supplies.food > 0) {
		block = new THREE.Mesh( new THREE.BoxGeometry( blockW, blockH, supplies.food * 10), texas_diaster_box_mat[0] );	
		block.position.set( lng, lat, heightOffset );
		group.add( block );
		heightOffset += supplies.food * 10;		
	}

	if (supplies.medical > 0) {
		block = new THREE.Mesh( new THREE.BoxGeometry( blockW, blockH, supplies.medical * 10), texas_diaster_box_mat[0] );		
		block.position.set( lng, lat, heightOffset );
		group.add( block );
		heightOffset += supplies.medical * 10;	
	}

	if (supplies.water > 0) {
		block = new THREE.Mesh( new THREE.BoxGeometry( blockW, blockH, supplies.water * 10), texas_diaster_box_mat[0] );		
		block.position.set( lng, lat, heightOffset );
		group.add( block );
		heightOffset += supplies.water * 10;	
	}

	// for (var i = 0; i < supplies.length; i++) {
	// 	var block;
	// 	switch(supplies[i].type) {
	// 		case TEXAS_DIASTER_DATA.SUPPLIES[0]: // rescue
	// 			block = new THREE.Mesh( new THREE.BoxGeometry( 5, supplies[i].count * 10, 5), texas_diaster_box_mat[0] );				
	// 			break;
	// 		case TEXAS_DIASTER_DATA.SUPPLIES[1]: // food
	// 			block = new THREE.Mesh(  new THREE.BoxGeometry( 5, supplies[i].count * 10, 5), texas_diaster_box_mat[1] );
	// 			break;
	// 		case TEXAS_DIASTER_DATA.SUPPLIES[2]: // medical
	// 			block = new THREE.Mesh(  new THREE.BoxGeometry( 5, supplies[i].count * 10, 5), texas_diaster_box_mat[2] );
	// 			break;
	// 		case TEXAS_DIASTER_DATA.SUPPLIES[3]: // water
	// 			block = new THREE.Mesh(  new THREE.BoxGeometry( 5, supplies[i].count * 10, 5), texas_diaster_box_mat[3] );
	// 			break;
	// 	}

	// 	heightOffset += supplies[i].count;

	// 	block.position.set( lng, lat, heightOffset );
	// 	group.add( block )
	// }

	screen0.add(group);	
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