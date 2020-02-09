// Create scene
var scene = new THREE.Scene();
var geometry = new THREE.BoxGeometry(1,1,1);
//var material = new THREE.MeshNormalMaterial();
var material = new THREE.MeshPhongMaterial({color:0xad0000, shininess:100});
var cube = new THREE.Mesh(geometry, material);
var clock = new THREE.Clock();
scene.add(cube);


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
