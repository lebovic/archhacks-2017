function init() {

    screen0 = new Screen(0, {
        "div" : document.getElementById("mainScreen"), 
        "expandOff" : true,
        "cameraZ" : 600 
    });
    screen1 = new Screen(1, {
        "div" : document.getElementById("sideScreen1"),
         "cameraZ" : 600 
     });
    screen2 = new Screen(2, {
        "div" : document.getElementById("sideScreen2")
    });
    screen3 = new Screen(3, {
        "div" : document.getElementById("sideScreen3")
    });
    screen4 = new Screen(4, {
        "div" : document.getElementById("sideScreen4")
    });
   

    texas_diaster_init();
    
    var textureEarth = new THREE.TextureLoader().load( '../textures/earth.jpg' );
    var geometryEarth = new THREE.SphereGeometry( 200, 128, 128 );
    var materialEarth = new THREE.MeshBasicMaterial( { map: textureEarth } );
    var meshEarth = new THREE.Mesh( geometryEarth, materialEarth );
    screen1.add( meshEarth );

    california_eq_init();

    var geometry = new THREE.BoxGeometry( 200, 200, 200 );
    var material = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
    var cube = new THREE.Mesh( geometry, material );
    screen3.add( cube );

    var geometry = new THREE.BoxGeometry( 200, 200, 100 );
    var material = new THREE.MeshLambertMaterial( {color: 0x00FFFF} );
    var cube = new THREE.Mesh( geometry, material );
    var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight2.position.set( 1, 1, 1 );
    screen4.add( cube );
    screen4.add( directionalLight1 );
    screen4.add( directionalLight2 );



    // Start all animates at same time
    screen0.animate();
    screen1.animate();
    screen2.animate();
    screen3.animate();
    screen4.animate();
}

function expandClick(index){
    // gets id of two renderes to swap

    var tMain = (document.getElementById("mainScreen").renderId);
    var tSwap = (document.getElementById("sideScreen"+index).renderId);

    console.log(tMain);
    console.log(tSwap);

    switch (tMain) {
        case 0: screen0.parentDiv.removeChild( screen0.renderer.domElement ); break;
        case 1: screen1.parentDiv.removeChild( screen1.renderer.domElement ); break;
        case 2: screen2.parentDiv.removeChild( screen2.renderer.domElement ); break;
        case 3: screen3.parentDiv.removeChild( screen3.renderer.domElement ); break;
        case 4: screen4.parentDiv.removeChild( screen4.renderer.domElement ); break;
    }

    switch (tSwap) {
        case 0: screen0.parentDiv.removeChild( screen0.renderer.domElement ); break;
        case 1: screen1.parentDiv.removeChild( screen1.renderer.domElement ); break;
        case 2: screen2.parentDiv.removeChild( screen2.renderer.domElement ); break;
        case 3: screen3.parentDiv.removeChild( screen3.renderer.domElement ); break;
        case 4: screen4.parentDiv.removeChild( screen4.renderer.domElement ); break;
    }

    switch (tMain) {
        case 0: 
            screen0.parentDiv = (tSwap == 1 ? screen1.parentDiv :
                                (tSwap == 2 ? screen2.parentDiv : 
                                (tSwap == 3 ? screen3.parentDiv : 
                                              screen4.parentDiv)));  
            screen0.parentDiv.appendChild(screen0.renderer.domElement);
            screen0.onWindowResize();
            break;
        case 1: 
             screen1.parentDiv = (tSwap == 0 ? screen0.parentDiv :
                                 (tSwap == 2 ? screen2.parentDiv :
                                 (tSwap == 3 ? screen3.parentDiv :
                                               screen4.parentDiv)));
             screen1.parentDiv.appendChild(screen1.renderer.domElement)
             screen1.onWindowResize();
            break;
        case 2: 
             screen2.parentDiv = (tSwap == 0 ? screen0.parentDiv :
                                 (tSwap == 1 ? screen1.parentDiv :
                                 (tSwap == 3 ? screen3.parentDiv :
                                              screen4.parentDiv)));
             screen2.parentDiv.appendChild(screen2.renderer.domElement)
             screen2.onWindowResize();
            break;
        case 3: 
             screen3.parentDiv = (tSwap == 0 ? screen0.parentDiv :
                                 (tSwap == 1 ? screen1.parentDiv :
                                 (tSwap == 2 ? screen2.parentDiv :
                                               screen4.parentDiv)));
             screen3.parentDiv.appendChild(screen3.renderer.domElement)
             screen3.onWindowResize();
            break;
        case 4: 
             screen4.parentDiv = (tSwap == 0 ? screen0.parentDiv :
                                 (tSwap == 1 ? screen1.parentDiv :
                                 (tSwap == 2 ? screen2.parentDiv :
                                               screen3.parentDiv)));
             screen4.parentDiv.appendChild(screen4.renderer.domElement)
             screen4.onWindowResize();
            break;
    }

    switch (tSwap) {
        case 0: screen0.parentDiv =  document.getElementById("mainScreen");
                screen0.parentDiv.appendChild( screen0.renderer.domElement)
                screen0.onWindowResize();
                break;
        case 1: screen1.parentDiv =  document.getElementById("mainScreen");
                screen1.parentDiv.appendChild( screen1.renderer.domElement)
                screen1.onWindowResize();
                break;
        case 2: screen2.parentDiv =  document.getElementById("mainScreen");
                screen2.parentDiv.appendChild( screen2.renderer.domElement)
                screen2.onWindowResize();
                break;
        case 3: screen3.parentDiv =  document.getElementById("mainScreen");
                screen3.parentDiv.appendChild( screen3.renderer.domElement)
                screen3.onWindowResize();
                break;
        case 4: screen4.parentDiv =  document.getElementById("mainScreen");
                screen4.parentDiv.appendChild( screen4.renderer.domElement)
                screen4.onWindowResize();
                break;
    }

    document.getElementById("mainScreen").renderId = tSwap;
    document.getElementById("sideScreen"+index).renderId = tMain;
    
}