var colorFn =  function(x) {
	var c = new THREE.Color();
	c.setHSL( ( 0.6 - ( x * 0.5 ) ), 1.0, 0.5 );
	return c;
};

var _baseGeometry;

  var Shaders = {
    'earth' : {
      uniforms: {
        'texture': { type: 't', value: null }
      },
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
          'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        '}'
      ].join('\n')
    },
    'atmosphere' : {
      uniforms: {},
      vertexShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'vNormal = normalize( normalMatrix * normal );',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vNormal;',
        'void main() {',
          'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
          'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
        '}'
      ].join('\n')
    }
  };

function globe_init() {

	var shader, uniforms, material;
	var geometry = new THREE.SphereGeometry(200, 40, 30);

	shader = Shaders['earth'];
	uniforms = THREE.UniformsUtils.clone(shader.uniforms);

	uniforms['texture'].value = THREE.ImageUtils.loadTexture('../world.jpg');

	material = new THREE.ShaderMaterial({

	      uniforms: uniforms,
	      vertexShader: shader.vertexShader,
	      fragmentShader: shader.fragmentShader

	    });

	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.y = Math.PI;
	screen3.add(mesh);

	shader = Shaders['atmosphere'];
	uniforms = THREE.UniformsUtils.clone(shader.uniforms);

	material = new THREE.ShaderMaterial({

	      uniforms: uniforms,
	      vertexShader: shader.vertexShader,
	      fragmentShader: shader.fragmentShader,
	      side: THREE.BackSide,
	      blending: THREE.AdditiveBlending,
	      transparent: true

	    });

	mesh = new THREE.Mesh(geometry, material);
	mesh.scale.set( 1.1, 1.1, 1.1 );
	screen3.add(mesh);

	geometry = new THREE.BoxGeometry(0.75, 0.75, 1);
	geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-0.5));

	point = new THREE.Mesh(geometry);

	$.get("../population909500.json", function(data) {
		for (i = 0; i < data.length; i++) {
			addData(data[i][1], {format: 'magnitude', name: data[i][0], animated: true});
		}
		createPoints();
		//settime(globe,0)();
	})

}


 var settime = function(globe, t) {
    return function() {
  new TWEEN.Tween(globe).to({time: t/years.length},500).easing(TWEEN.Easing.Cubic.EaseOut).start();
  var y = document.getElementById('year'+years[t]);
  if (y.getAttribute('class') === 'year active') {
    return;
  }
  var yy = document.getElementsByClassName('year');
  for(i=0; i<yy.length; i++) {
    yy[i].setAttribute('class','year');
  }
  y.setAttribute('class', 'year active');
};
};


function addData(data, opts) {
    var lat, lng, size, color, i, step, colorFnWrapper;

    opts.animated = opts.animated || false;
    screen3.is_animated = opts.animated;
    opts.format = opts.format || 'magnitude'; // other option is 'legend'
    if (opts.format === 'magnitude') {
      step = 3;
      colorFnWrapper = function(data, i) { return colorFn(data[i+2]); }
    } else if (opts.format === 'legend') {
      step = 4;
      colorFnWrapper = function(data, i) { return colorFn(data[i+3]); }
    } else {
      throw('error: format not supported: '+opts.format);
    }

    if (opts.animated) {
      if (_baseGeometry === undefined) {
        
        _baseGeometry = new THREE.Geometry();
        for (i = 0; i < data.length; i += step) {
          lat = data[i];
          lng = data[i + 1];
//        size = data[i + 2];
          color = colorFnWrapper(data,i);
          size = 0;
          addPoint(lat, lng, size, color, _baseGeometry);
        }
      }
      if(screen3._morphTargetId === undefined) {
        screen3._morphTargetId = 0;
      } else {
        screen3._morphTargetId += 1;
      }
      opts.name = opts.name || 'morphTarget'+screen3._morphTargetId;
    }
    var subgeo = new THREE.Geometry();
    for (i = 0; i < data.length; i += step) {
      lat = data[i];
      lng = data[i + 1];
      color = colorFnWrapper(data,i);
      size = data[i + 2];
      size = size*200;
      addPoint(lat, lng, size, color, subgeo);
    }
    if (opts.animated) {
      _baseGeometry.morphTargets.push({'name': opts.name, vertices: subgeo.vertices});
    } else {
      _baseGeometry = subgeo;
    }

  };

  function createPoints() {
  	var points; 

    if (_baseGeometry.morphTargets.length < 8) {
      console.log('t l',_baseGeometry.morphTargets.length);
      var padding = 8-_baseGeometry.morphTargets.length;
      console.log('padding', padding);
      for(var i=0; i<=padding; i++) {
        console.log('padding',i);
        _baseGeometry.morphTargets.push({'name': 'morphPadding'+i, vertices: _baseGeometry.vertices});
      }
    }

    console.log(_baseGeometry);
    points = new THREE.Mesh(_baseGeometry, new THREE.MeshBasicMaterial({
          color: 0xffffff,
          vertexColors: THREE.FaceColors,
          morphTargets: true
        }));
      
      screen3.add(points);
    
  }

  function addPoint(lat, lng, size, color, subgeo) {

  	
    var phi = (90 - lat) * Math.PI / 180;
    var theta = (180 - lng) * Math.PI / 180;

    point.position.x = 200 * Math.sin(phi) * Math.cos(theta);
    point.position.y = 200 * Math.cos(phi);
    point.position.z = 200 * Math.sin(phi) * Math.sin(theta);

    point.lookAt(mesh.position);

    point.scale.z = Math.max( size, 0.1 ); // avoid non-invertible matrix
    point.updateMatrix();

    for (var i = 0; i < point.geometry.faces.length; i++) {

      point.geometry.faces[i].color = color;

    }
    if(point.matrixAutoUpdate){
      point.updateMatrix();
    }
    subgeo.merge(point.geometry, point.matrix);
  }
