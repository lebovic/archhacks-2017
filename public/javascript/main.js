var mainScreen, sideScreen1, sideScreen2, sideScreen3, sideScreen4;

function init() {

    mainScreen = new Screen(0, {"div" : document.getElementById("mainScreen")});
    // sideScreen1 = document.getElementById("sideScreen1");
    // sideScreen2 = document.getElementById("sideScreen2");
    // sideScreen3 = document.getElementById("sideScreen3");
    // sideScreen4 = document.getElementById("sideScreen4");

   
    // Load in a texture by referencing the image location from THIS file
    var texture = new THREE.TextureLoader().load( '../textures/earth.jpg' );

    // Creates a sphere and material for it
    var geometry = new THREE.SphereGeometry( 200, 128, 128 );

    // Note that basic materials are not effected by lighting by default
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    // Combines geometry and material together to form a mesh we can then add to scene
    var mesh = new THREE.Mesh( geometry, material );
    mainScreen.add( mesh );

    // Time to start the animation cycle!
    mainScreen.animate();
}

