// Made by Thomas Vuister and Ossama Sijbesma 
// https://threejs.org/docs/#api/en/

/*___ General ___*/

// Create scene
let scene = new THREE.Scene();

// Create renderer
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// loaders
let objectLoader = new THREE.ObjectLoader();
let textureLoader = new THREE.TextureLoader();

/*___ Camera ___*/

// Perspective camera to mimic the way the human eye sees.
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Start position of the camera
camera.position.x = -2;
camera.position.y = 44;
camera.position.z = -115;

let controls = new THREE.OrbitControls(camera, renderer.domElement);
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

/*___ Floor ___*/

// Grass
// Grass models
objectLoader.load("resources/models/grass/dense-grass.json", function ( grassObject ) {
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

// Grass texture
var textureGrass = textureLoader.load( "resources/grass.png" );
textureGrass.repeat.set(1,1);

// Lawn
let lawnGeometry = new THREE.PlaneBufferGeometry(120, 280);
let lawnMaterial = new THREE.MeshPhongMaterial({ map: textureGrass });
let lawn = new THREE.Mesh(lawnGeometry, lawnMaterial);
lawn.rotation.x = - Math.PI / 2;
lawn.position.x = 20;
lawn.position.z = 80;
scene.add(lawn);

// Lawn borders
function createCurbSmall(x, y, z, size, isHorizontal)
{
	let lawnBorderGeometry = (isHorizontal) ? new THREE.BoxGeometry(1, 1, size) : new THREE.BoxGeometry(size, 1, 1);
	let lawnBorderMaterial = new THREE.MeshBasicMaterial({ color: 0x2C393F});
	let lawnBorder = new THREE.Mesh(lawnBorderGeometry, lawnBorderMaterial);
	lawnBorder.position.set(x, y, z);
	scene.add(lawnBorder);
}

createCurbSmall(-40, 0, 20, 160, true);
createCurbSmall(80, 0, 80, 280, true);
createCurbSmall(-40, 0, 200, 40, true);
createCurbSmall(20, 0, -60, 120, false);
createCurbSmall(20, 0, 220, 120, false);

createCurbSmall(120, 0, 40, 440, true);
createCurbSmall(-80, 0, 40, 440, true);

// playground curb
function createCurb(x, y, z, size, isHorizontal)
{
	let curbGeometry = (isHorizontal) ? new THREE.BoxGeometry(4, 2, size) : new THREE.BoxGeometry(size, 2, 4);
	let curbMaterial = new THREE.MeshBasicMaterial({ color: 0x2C393F});
	let curb = new THREE.Mesh(curbGeometry, curbMaterial);
	curb.position.set(x, y, z);
	scene.add(curb);
}

createCurb(-40, 0, 140, 80, true);
createCurb(40, 0, 140, 80, true);
createCurb(0, 0, 100, 84, false);
createCurb(0, 0, 180, 84, false);

// Grass texture
let textureWoodChips = textureLoader.load( "resources/woodchips.jpg" );
textureWoodChips.wrapS = textureWoodChips.wrapT = THREE.RepeatWrapping;
textureWoodChips.repeat.set(4,4);

// playground
let playgroundGeometry = new THREE.PlaneBufferGeometry(76, 76);
let playgroundMaterial = new THREE.MeshPhongMaterial({ map: textureWoodChips });
let playground = new THREE.Mesh(playgroundGeometry, playgroundMaterial);
playground.rotation.x = - Math.PI / 2;
playground.position.set(0,0.5,140);
scene.add(playground);


// Sidewalks texture
var textureSidewalk = textureLoader.load("resources/sidewalks.jpg");

// Sidewalk
function createSidewalk(xi, y, zi, width, height)
{
	//textureSidewalk.repeat.set(255/width, 255/height);
	textureSidewalk.wrapS = textureSidewalk.wrapT  = THREE.RepeatWrapping;
	let sidewalkGeometry = new THREE.PlaneBufferGeometry(40, 40);
	let sidewalkMaterial = new THREE.MeshBasicMaterial({ map: textureSidewalk });
	let sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
	sidewalk.rotation.x = - Math.PI / 2;

	for (let x = 0; x < width; x+=40) {
		for (let z = 0; z < height; z+=40) {
			let sidewalkBlock = sidewalk.clone();
			sidewalkBlock.position.set(xi+x, y, zi+z);
			scene.add(sidewalkBlock);
		}
	}
}

createSidewalk(-60, 0, -40, 40, 280);
createSidewalk(100, 0, -40, 40, 280);
createSidewalk(-60, 0, -160, 200, 120);
createSidewalk(-60, 0, 240, 200, 40);

// Road

/*___ Houses ___*/

var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
var house = new THREE.Mesh(new THREE.BoxGeometry(80, 80, 250), material);
house.position.set(-150, 40, 0);
scene.add(house);

var balcony = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 250), material);
balcony.position.set(-95, 50, 0);
scene.add(balcony);

var house = new THREE.Mesh(new THREE.BoxGeometry(80, 80, 250), material);
house.position.set(190, 40, 0);
scene.add(house);

var balcony = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 250), material);
balcony.position.set(135, 50, 0);
scene.add(balcony);


/*___ Decoration ___*/

// Big choicken
objectLoader.load("resources/models/chicken/minecraft-chicken.json", function ( chickenObject )
{
	chickenObject.scale.set(5, 5, 5);
	chickenObject.position.set(0,0,140);
	chickenObject.rotateY(-300);
	scene.add(chickenObject);
});

// Trees

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
