// Made by Thomas Vuister and Ossama Sijbesma 
// https://threejs.org/docs/#api/en/

/*___ General ___*/

// Create scene
let scene = new THREE.Scene();

// Create renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*___ Camera ___*/

// Perspective camera to mimic the way the human eye sees.
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Start position of the camera
camera.position.x = -2;
camera.position.y = 44;
camera.position.z = -115;

/*___ OrbitControls ___*/
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;

// For first person camera controls use: https://threejs.org/docs/#examples/en/controls/PointerLockControls

/*___ SkyBox ___*/
scene.background = new THREE.CubeTextureLoader()
	.setPath('resources/skybox/')
	.load([
		'posx.jpg',
		'negx.jpg',
		'posy.jpg',
		'negy.jpg',
		'posz.jpg',
		'negz.jpg'
	]);

/*___ Simulate Daylight ___*/ 

// Hemisphere light: A light source positioned directly above the scene, with color fading from the sky color to the ground color.
var hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
scene.add(hemisphereLight);

// Directional light: A light that gets emitted in a specific direction.
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(directionalLight);

/*___ Textures ___*/
var textureLoader = new THREE.TextureLoader();

// Set grass texture
var textureGrass = textureLoader.load( "resources/grass.png" );
textureGrass.repeat.set( 10,10 );
textureGrass.wrapS = textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.format = THREE.RGBFormat;
textureGrass.encoding = THREE.sRGBEncoding; 

// Set sidewalks texture
var textureSidewalks = textureLoader.load("resources/sidewalks.jpg");
textureGrass.repeat.set( 4,4 );
textureGrass.wrapS = textureGrass.wrapT = THREE.RepeatWrapping;

/*___ Floor ___*/

// Lawn
var lawnGeometry = new THREE.PlaneBufferGeometry(120, 280);
var lawnMaterial = new THREE.MeshPhongMaterial({ map: textureGrass });
var lawn = new THREE.Mesh(lawnGeometry, lawnMaterial);
lawn.rotation.x = - Math.PI / 2;
lawn.position.x = 20;
lawn.position.z = 80;
scene.add(lawn);

// TODO: create a clean solution 
// Sidewalks
function createSidewalks(x, y, z){
	var sidewalksGeometry = new THREE.PlaneBufferGeometry(50, 50);
	var sidewalksMaterial = new THREE.MeshBasicMaterial({ map: textureSidewalks });
	var sidewalks = new THREE.Mesh(sidewalksGeometry, sidewalksMaterial);
	sidewalks.rotation.x = - Math.PI / 2;
	sidewalks.position.set(x, y, z);
	scene.add(sidewalks);
}
createSidewalks(100, 1, 0);
createSidewalks(100, 1, 50);
createSidewalks(100, 1, -50);
createSidewalks(100, 1, 100);
createSidewalks(100, 1, -100);

createSidewalks(-100, 1, 0);
createSidewalks(-100, 1, 50);
createSidewalks(-100, 1, -50);
createSidewalks(-100, 1, 100);
createSidewalks(-100, 1, -100);

createSidewalks(50, 1, 100);
createSidewalks(50, 1, -100);
createSidewalks(-50, 1, -100);
createSidewalks(-50, 1, 100);
createSidewalks(0, 1, 100);
createSidewalks(0, 1, -100);

// Lawn borders
var geometry = new THREE.BoxGeometry(1, 1, 160);
var material = new THREE.MeshBasicMaterial({ color: 0x2C393F});
var border = new THREE.Mesh(geometry, material);
border.position.set(-40, 0, 20);
scene.add(border);

var geometry = new THREE.BoxGeometry(1, 1, 280);
var material = new THREE.MeshBasicMaterial({ color: 0x2C393F});
var border = new THREE.Mesh(geometry, material);
border.position.set(80, 0, 80);
scene.add(border);

var geometry = new THREE.BoxGeometry(1, 1, 40);
var material = new THREE.MeshBasicMaterial({ color: 0x2C393F});
var border = new THREE.Mesh(geometry, material);
border.position.set(-40, 0, 200);
scene.add(border);

var geometry = new THREE.BoxGeometry(120, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x2C393F});
var border = new THREE.Mesh(geometry, material);
border.position.set(20, 0, -60);
scene.add(border);

var geometry = new THREE.BoxGeometry(120, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x2C393F});
var border = new THREE.Mesh(geometry, material);
border.position.set(20, 0, 220);
scene.add(border);

// Grass
var loader = new THREE.ObjectLoader();

loader.load("resources/models/dense-grass.json", function ( grassObject ) {
	grassObject.scale.set(0.1,0.3,0.1);
	grassObject.position.y = -9;

	for (let z = -40; z < 120; z+=40) {
		for (let x = -20; x < 80; x+=40) {
			let grass = grassObject.clone();
			grass.position.x = x;
			grass.position.z = z;
			scene.add(grass);
		}
	}

	for (let z = 120; z < 170; z+=40) {
		let grass = grassObject.clone();
		grass.position.x = 60;
		grass.position.z = z;
		scene.add(grass);
	}

	for (let x = -20; x < 80; x+=40) {
		let grass = grassObject.clone();
		grass.position.x = x;
		grass.position.z = 200;
		scene.add(grass);
	}
});

// Pavement

// Road

/*___ Houses ___*/
var geometry = new THREE.BoxGeometry(80, 80, 250);
var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
var house = new THREE.Mesh(geometry, material);
house.position.set(-170, 40, 0);
scene.add(house);

var geometry = new THREE.BoxGeometry(80, 80, 250);
var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
var house = new THREE.Mesh(geometry, material);
house.position.set(170, 40, 0);
scene.add(house);


/*___ Decoration ___*/

// Trees


// var object = loader.parse("resources/models/dense-grass.json");
// // object.position.x = -10;
// // object.position.y = 20;
// // object.position.z = -10;
// scene.add( object );

// Lamppost

// Lamppost without light comming from it
function makeLamppost(x, y, z){
	var materialBordeaux = new THREE.MeshBasicMaterial( {color: 0x5A2323} );
	var materialLamp = new THREE.MeshBasicMaterial({ color: 0x9C9B95})
	
	var pole = new THREE.Mesh(new THREE.CylinderGeometry( 1, 1, 50, 32 ), materialBordeaux);
	pole.position.set(x, y, z);
	scene.add(pole);
	
	var lamp = new THREE.Mesh(new THREE.CylinderGeometry(2, 1, 5, 32), materialLamp);
	lamp.position.set(x, 50, z);
	scene.add(lamp);
	
	var lampshade = new THREE.Mesh(new THREE.CylinderGeometry(1, 5, 1, 32), materialBordeaux);
	lampshade.position.set(x, 53, z);
	scene.add(lampshade);
}

makeLamppost(-45, 25, -60);
makeLamppost(85, 25, 20);
makeLamppost(-45, 25, 100);



// Point light: A light that gets emitted from a single point in all directions. A common use case for this is to replicate the light emitted from a bare lightbulb.
// var light = new THREE.PointLight( 0xff0000, 1, 100 );
// light.position.set( 200, 200, 200 );
// scene.add( light );

/*___ Render Page ___*/
var render = function(){
	renderer.render(scene, camera);
	controls.update();
	requestAnimationFrame(render);  
}
render();
