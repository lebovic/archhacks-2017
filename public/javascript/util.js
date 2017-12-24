var mainScreen, sideScreen1, sideScreen2, sideScreen3, sideScreen4;
var screen0, screen1, screen2, screen3, screen4;

var socket = io();


var mouse = new THREE.Vector2(), INTERSECTED;
var raycaster;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}