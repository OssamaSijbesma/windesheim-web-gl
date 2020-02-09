// Made by Thomas Vuister and Ossama Sijbesma 
// https://threejs.org/docs/#api/en/

/*___ General ___*/

// Create scene
var scene = new THREE.Scene();

/*___ Simulate Daylight ___*/ 

// Hemisphere light: A light source positioned directly above the scene, with color fading from the sky color to the ground color.
var hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add(hemisphereLight);

// Directional light: A light that gets emitted in a specific direction.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );




// Point light: A light that gets emitted from a single point in all directions. A common use case for this is to replicate the light emitted from a bare lightbulb.
// var light = new THREE.PointLight( 0xff0000, 1, 100 );
// light.position.set( 50, 50, 50 );
// scene.add( light );



var geometry = new THREE.BoxGeometry(1,1,1);
//var material = new THREE.MeshNormalMaterial();
var material = new THREE.MeshPhongMaterial({color:0xad0000, shininess:100});
var cube = new THREE.Mesh(geometry, material);
var clock = new THREE.Clock();
scene.add(cube);

const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);
// Create camera
var camera = new THREE.PerspectiveCamera(
	75, // fov — Camera frustum vertical field of view.
	window.innerWidth/window.innerHeight, // aspect — Camera frustum aspect ratio.
	0.1, // near — Camera frustum near plane.
	1000); // far — Camera frustum far plane. 


// Move camera from center
camera.position.x = 2;
camera.position.y = 2;
camera.position.z = 5;

//


// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera)
