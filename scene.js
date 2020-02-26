// Made by Thomas Vuister and Ossama Sijbesma 
// Based off the location Reigerstraat 9 - 8446HP, Heerenveen
// https://threejs.org/docs/#api/en/

/*___ CHAPTERS ___*/
// 1. General
// 2. Camera
// 3. SkyBox
// 4. Simulate Daylight
// 5. Floor
// 6. Houses
// 7. Decoration
// 8. Render Page



/*___ 1. General ___*/

// Create scene.
let scene = new THREE.Scene();

// Create renderer.
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Add renderer to the document.
document.body.appendChild(renderer.domElement);

// initialize loaders.
let objectLoader = new THREE.ObjectLoader();
let textureLoader = new THREE.TextureLoader();



/*___ 2. Camera ___*/
// For first person camera controls use: https://threejs.org/docs/#examples/en/controls/PointerLockControls

// Perspective camera to mimic the way the human eye sees.
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Start position of the camera.
camera.position.x = -2;
camera.position.y = 44;
camera.position.z = -115;

// Enable Orbit Controls.
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;
controls.enableZoom = false;

// Legacy controls.
controls.keys = {
	LEFT: 188,
	UP: 33,
	RIGHT: 190, 
	BOTTOM: 34
}

// Arrow key is pressed.
let ArrowUp = false;
let ArrowDown = false;
let ArrowLeft = false;
let ArrowRight = false;


// Event listener to see if a key is pressed down.
document.addEventListener('keydown', function(event) {
	switch(event.code){
		case 'ArrowUp': ArrowUp = true; break
		case 'ArrowDown': ArrowDown = true; break
		case 'ArrowLeft': ArrowLeft = true; break
		case 'ArrowRight': ArrowRight = true; break
	}
});

// Event listener to see if a key is released.
document.addEventListener('keyup', function(event) {
	switch(event.code){
		case 'ArrowUp': ArrowUp = false; break
		case 'ArrowDown': ArrowDown = false; break
		case 'ArrowLeft': ArrowLeft = false; break
		case 'ArrowRight': ArrowRight = false; break
	}
});

// Update the position of the camera with the orbit controls functions.
function updatePosition(){
	if (ArrowUp) controls.panForward(1);
	if (ArrowDown) controls.panForward(-1);
	if (ArrowLeft) controls.panLeft(1);
	if (ArrowRight) controls.panLeft(-1);

	if(ArrowUp || ArrowDown || ArrowLeft || ArrowRight)
	{
		controls.target.setY(30);
		camera.position.y = 30;
	}

	controls.update();
}

// Call the update with an interval.
this.interval = setInterval(updatePosition, 10);



/*___ 3. SkyBox ___*/
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



/*___ 4. Simulate Daylight ___*/ 

// Hemisphere light: A light source positioned directly above the scene, with color fading from the sky color to the ground color.
let hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
scene.add(hemisphereLight);

// Directional light: A light that gets emitted in a specific direction.
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 100, -350);
directionalLight.castShadow = true;
scene.add(directionalLight);



/*___ 5. Floor ___*/

// Load the grass models and place it.
objectLoader.load("resources/models/grass/dense-grass.json", function ( grassObject ) {
	grassObject.scale.set(0.1,0.3,0.1);
	grassObject.position.y = -10;

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

// Load the grass texture.
var textureGrass = textureLoader.load("resources/grass.jpg");
textureGrass.wrapS = textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.encoding = THREE.sRGBEncoding;
textureGrass.repeat.set( 8, 4 );
textureGrass.anisotropy = 16;

// Create a lawn with the grass texture.
let lawnMaterial = new THREE.MeshPhongMaterial({ map: textureGrass });
let lawn = new THREE.Mesh(new THREE.PlaneBufferGeometry(120, 280), lawnMaterial);
lawn.receiveShadow = true;
lawn.rotation.x = - Math.PI / 2;
lawn.position.x = 20;
lawn.position.z = 80;
scene.add(lawn);

// Create curbs around the lawn.
function createLawnCurb(x, y, z, size, isHorizontal)
{
	let lawnCurbsGeometry = (isHorizontal) ? new THREE.BoxGeometry(1, 1, size) : new THREE.BoxGeometry(size, 1, 1);
	let lawnCurbsMaterial = new THREE.MeshBasicMaterial({ color: 0x2C393F});
	let lawnCurbs = new THREE.Mesh(lawnCurbsGeometry, lawnCurbsMaterial);
	lawnCurbs.position.set(x, y, z);
	scene.add(lawnCurbs);
}
createLawnCurb(-40, 0, 20, 160, true);
createLawnCurb(80, 0, 80, 280, true);
createLawnCurb(-40, 0, 200, 40, true);
createLawnCurb(20, 0, -60, 120, false);
createLawnCurb(20, 0, 220, 120, false);
createLawnCurb(120, 0, 40, 440, true);
createLawnCurb(-80, 0, 40, 440, true);

// Create curbs around the playground.
function createPlaygroundCurb(x, y, z, size, isHorizontal)
{
	let playgroundCurbGeometry = (isHorizontal) ? new THREE.BoxGeometry(4, 2, size) : new THREE.BoxGeometry(size, 2, 4);
	let playgroundCurbMaterial = new THREE.MeshBasicMaterial({ color: 0x2C393F});
	let playgroundCurb = new THREE.Mesh(playgroundCurbGeometry, playgroundCurbMaterial);
	playgroundCurb.position.set(x, y, z);
	scene.add(playgroundCurb);
}
createPlaygroundCurb(-40, 0, 140, 80, true);
createPlaygroundCurb(40, 0, 140, 80, true);
createPlaygroundCurb(0, 0, 100, 84, false);
createPlaygroundCurb(0, 0, 180, 84, false);

// Load the wood chips texture.
let textureWoodChips = textureLoader.load( "resources/woodchips.jpg" );
textureWoodChips.wrapS = textureWoodChips.wrapT = THREE.RepeatWrapping;
textureWoodChips.repeat.set(4,4);

// Create a playground with the wood chips texture.
let playgroundMaterial = new THREE.MeshPhongMaterial({ map: textureWoodChips });
let playground = new THREE.Mesh(new THREE.PlaneBufferGeometry(76, 76), playgroundMaterial);
playground.rotation.x = - Math.PI / 2;
playground.position.set(0,0.5,140);
scene.add(playground);


// Load the sidewalks texture.
let textureSidewalk = textureLoader.load("resources/sidewalks.jpg");
textureSidewalk.wrapS = textureSidewalk.wrapT = THREE.RepeatWrapping;

// Create the sidewalk with the sidewalk texture.
let sidewalkMaterial = new THREE.MeshPhongMaterial({ map: textureSidewalk });
let sidewalkModel = new THREE.Mesh(new THREE.PlaneBufferGeometry(40, 40), sidewalkMaterial);
sidewalkModel.rotation.x = - Math.PI / 2;

function createSidewalk(xi, y, zi, width, height)
{
	for (let x = 0; x < width; x+=40) {
		for (let z = 0; z < height; z+=40) {
			let sidewalk = sidewalkModel.clone();
			sidewalk.position.set(xi+x, y, zi+z);
			scene.add(sidewalk);
		}
	}
}
createSidewalk(-60, 0, -40, 40, 280);
createSidewalk(100, 0, -40, 40, 280);
createSidewalk(-60, 0, -160, 200, 120);
createSidewalk(-60, 0, 240, 200, 40);



/*___ 6. Houses ___*/

// Load the wood texture.
let textureWood = textureLoader.load( "resources/wood.jpg" );
textureWood.wrapS = textureWood.wrapT = THREE.RepeatWrapping;
textureWood.repeat.set(4,4);

// House
let houseMaterial = new THREE.MeshBasicMaterial({ map: textureWood });
let houseModel = new THREE.Mesh(new THREE.BoxGeometry(80, 80, 250), houseMaterial);

// Create a house with the wood texture.
function createHouse(x){
	let house = houseModel.clone();
	house.position.set(x, 40, 0);
	scene.add(house);
}
createHouse(-150);
createHouse(190);

// Balcony
let balconyMaterial = new THREE.MeshBasicMaterial({ map: textureWood });
let balconyModel = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 250), balconyMaterial);

// Create a balcony with the wood texture.
function createBalcony(x){
	let balcony = balconyModel.clone();
	balcony.position.set(x, 50, 0);
	scene.add(balcony);
}
createBalcony(-95);
createBalcony(135);


// Load the floor texture.
let textureDoorstep = textureLoader.load("resources/floor.jpg");
textureDoorstep.wrapS = textureDoorstep.wrapT = THREE.RepeatWrapping;
textureDoorstep.repeat.set(4, 8);

// Doorstep
let doorstepMaterial = new THREE.MeshPhongMaterial({ map: textureDoorstep });
let doorstepModel = new THREE.Mesh(new THREE.BoxGeometry(30, 2, 250) , doorstepMaterial);

// Create a doorstep with the floor texture.
function createDoorstep(x){
	let doorstep = doorstepModel.clone();
	doorstep.position.set(x, 1, 0);
	scene.add(doorstep);
}
createDoorstep(-95);
createDoorstep(135);


// Load the bush texture.
let textureBush = textureLoader.load("resources/bush.jpg");
textureBush.wrapS = textureBush.wrapT = THREE.RepeatWrapping;
textureBush.repeat.set(8,1);

// Bush 
let bushMaterial = new THREE.MeshBasicMaterial({ map: textureBush });
let bush = new THREE.Mesh(new THREE.BoxGeometry(8, 12, 45), bushMaterial);

// Create bushes with bush texture
for (let z = 105; z > -80; z-= 60) {
	let bush1 = bush.clone();
	bush1.position.set(-84, 8, z);
	scene.add(bush1);

	let bush2 = bush.clone();
	bush2.position.set(124, 8, z);
	scene.add(bush2);
}


// Load the roof texture.
let textureRoof = textureLoader.load( "resources/roof.jpg" );
textureRoof.wrapS = textureRoof.wrapT = THREE.RepeatWrapping;
textureRoof.repeat.set(2,2);
textureRoof.rotation = Math.PI /2;

// Roof
let roofGeometry = new THREE.PlaneBufferGeometry(47.1699, 250);
let roofMaterial = new THREE.MeshPhongMaterial({ map: textureRoof });
let roof = new THREE.Mesh(roofGeometry, roofMaterial);

// Create the roofs with the roof texture.
let roof1 = roof.clone();
roof1.position.set(-130, 92, 0);
roof1.rotation.y = 0.585097;
roof1.rotation.x = Math.PI / -2;
scene.add(roof1);

let roof2 = roof.clone();
roof2.position.set(-170, 92, 0);
roof2.rotation.y = -0.585097;
roof2.rotation.x = Math.PI / -2;
scene.add(roof2);

let roof3 = roof.clone();
roof3.position.set(210, 92, 0);
roof3.rotation.y = 0.585097;
roof3.rotation.x = Math.PI / -2;
scene.add(roof3);

let roof4 = roof.clone();
roof4.position.set(170, 92, 0);
roof4.rotation.y = -0.585097;
roof4.rotation.x = Math.PI / -2;
scene.add(roof4);

// Roofsides
let triangle = new THREE.Geometry();
triangle.vertices.push(new THREE.Vector3(0, 0, 0));
triangle.vertices.push(new THREE.Vector3(80, 0, 0));
triangle.vertices.push(new THREE.Vector3(40, 25, 0));
triangle.faces.push(new THREE.Face3(0, 2, 1));
triangle.computeFaceNormals();

let roofsideMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
let roofsideModel = new THREE.Mesh(triangle, roofsideMaterial);

// Create a roofside.
function createRoofside(x, z, rotateY){
	let roofside = roofsideModel.clone();
	roofside.position.set(x, 80, z);

	if (rotateY)
		roofside.rotation.y = Math.PI;

	scene.add(roofside);
}
createRoofside(230, 125, true);
createRoofside(150, -125, false);
createRoofside(-110, 125, true);
createRoofside(-190, -125, false);

// Rooftop
let roofTopMaterial = new THREE.MeshBasicMaterial({ color: 0x291405 });
let roofTopModel = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 250, 32), roofTopMaterial);

// Create a rooftop
function createRooftop(x){
	let roofTop = roofTopModel.clone();
	roofTop.rotation.x = -Math.PI/2;
	roofTop.position.set(x, 105, 0);
	scene.add(roofTop);
}
createRooftop(-150);
createRooftop(190);


// Load the brick texture.
let brickTexture = textureLoader.load("resources/bricks.jpg");

// Chimney
let chimneyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100, map: brickTexture });
let chimneyModel = new THREE.Mesh(new THREE.BoxGeometry(16, 20, 9), chimneyMaterial);

// Create a chimneys with the brick texture.
function createChimney(x, zMin, zMax)
{	
	for (let z = zMin; z < zMax; z+=20) {
		let chimney = chimneyModel.clone();
		chimney.position.set(x, 105, z+z);
		scene.add(chimney);
	}
}
createChimney(-150, -60, 70);
createChimney(190, -60, 70);

// Load the glass texture.
let windowTexture = textureLoader.load("resources/glass.png");

// Window
let windowMaterial = new THREE.MeshBasicMaterial({ color: 0x889993, map: windowTexture });
let windowModel = new THREE.Mesh(new THREE.PlaneBufferGeometry(28, 16), windowMaterial);
windowModel.material.side = THREE.DoubleSide;
windowModel.rotation.y = Math.PI / 2;

// Create windows with the glass texture.
function createWindows(x, zMin, zMax)
{
	for (let z = zMin; z < zMax; z+=20) {
		let window =  windowModel.clone();
		window.position.set(x, 68, z+z);
		scene.add(window);
	}
}
createWindows(-109.5, -50, 60);
createWindows(149.5, -50, 60);

// Load the door texture.
let doorTexture = textureLoader.load("resources/door.jpg");

// Door
let doorMaterial = new THREE.MeshBasicMaterial({ color: 0x889993, map: doorTexture });
let doorModel = new THREE.Mesh(new THREE.PlaneBufferGeometry(16, 36), doorMaterial);
doorModel.material.side = THREE.DoubleSide;
doorModel.rotation.y = Math.PI / 2;

// Create a doors with the door texture.
function createDoors(x, zMin, zMax)
{
	for (let z = zMin; z < zMax; z+=30) {
		let door =  doorModel.clone();
		door.position.set(x, 20, z+z);
		scene.add(door);
	}
}
createDoors(-109.5, -52, 58);
createDoors(149.5, -52, 58);

// Create pillars and fences for the houses
let fenceMaterial = new THREE.MeshBasicMaterial({ color: 0x889993});
let fenceModel = new THREE.Mesh(new THREE.PlaneBufferGeometry(28, 24), fenceMaterial);
fenceModel.material.side = THREE.DoubleSide;
fenceModel.rotation.z = Math.PI / 2;

let pillarMaterial = new THREE.MeshBasicMaterial( {color: 0xfefce2} );
let pillarModel = new THREE.Mesh(new THREE.CylinderGeometry( 1, 1, 46, 32 ), pillarMaterial);

// Create pillars and fences
function createPillarsAndFences(x, zMin, zMax){

	for (let z = zMin; z < zMax; z+=15) {
		let pillar = pillarModel.clone();
		pillar.position.set(x, 23, z+z);
		scene.add(pillar);

		let fence = fenceModel.clone();
		(x < 0) ? fence.position.set(x-13, 16, z+z) : fence.position.set(x+13, 16, z+z);
		
		scene.add(fence);
	}
}
createPillarsAndFences(-85, -60, 75);
createPillarsAndFences(125, -60, 75);



/*___ 7. Decoration ___*/

// Big choicken
objectLoader.load("resources/models/chicken/minecraft-chicken.json", function ( chickenObject )
{
	chickenObject.scale.set(5, 5, 5);
	chickenObject.position.set(0,0,140);
	chickenObject.rotateY(-300);
	scene.add(chickenObject);
});

// Lampposts with light coming from it.
function makeLamppost(x, y, z){
	var materialBordeaux = new THREE.MeshPhongMaterial( {color: 0x5A2323, shininess: 50} );
	var materialLamp = new THREE.MeshPhongMaterial({ color: 0x9C9B95, shininess: 40 });
	
	// Create the bordeaux pole.
	var pole = new THREE.Mesh(new THREE.CylinderGeometry( 1, 1, 50, 32 ), materialBordeaux);
	pole.position.set(x, y, z);
	scene.add(pole);
	
	// Create the lamp.
	var lamp = new THREE.Mesh(new THREE.CylinderGeometry(2, 1, 5, 32), materialLamp);
	lamp.position.set(x, 50, z);
	lamp.shininess = 1000;
	scene.add(lamp);
	
	// Create the lampshade.
	var lampshade = new THREE.Mesh(new THREE.CylinderGeometry(1, 5, 1, 32), materialBordeaux);
	lampshade.position.set(x, 53, z);
	scene.add(lampshade);

	// Create the light coming from around the lamp spot.
	var light = new THREE.PointLight( 0xffff00, 1, 100 );
	light.position.set(x, 52, z);
	scene.add( light );
}
makeLamppost(-45, 25, -60);
makeLamppost(85, 25, 20);
makeLamppost(-45, 25, 100);

// Benches
objectLoader.load("resources/models/bench/wood-bench-2.json", function ( benchObject )
{
	benchObject.scale.set(0.08, 0.08, 0.08);
	benchObject.castShadow = true;

	let bench1 = benchObject.clone();
	bench1.position.set(45,0,160);
	bench1.rotateY(-300);
	scene.add(bench1);

	let bench2 = benchObject.clone();
	bench2.position.set(45,0,120);
	bench2.rotateY(-300);
	scene.add(bench2);

	let bench3 = benchObject.clone();
	bench3.position.set(68,0,20);
	bench3.rotateY(-300);
	scene.add(bench3);

	let bench4 = benchObject.clone();
	bench4.position.set(20,0,185);
	scene.add(bench4);
});

// Dogs
objectLoader.load("resources/models/dog/marching-dog.json", function ( dogObject )
{
	dogObject.scale.set(250, 250, 250);
	dogObject.castShadow = true;

	let dog1 = dogObject.clone();
	dog1.position.set(0,0,28);
	dog1.rotateY(150);
	scene.add(dog1);

	let dog2 = dogObject.clone();
	dog2.position.set(0,0,-28);
	dog2.rotateY(-450);
	scene.add(dog2);
});

// Load the football texture.
let footballTexture = textureLoader.load("resources/football.jpg");

// Football
let footballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, map: footballTexture });
let football = new THREE.Mesh(new THREE.SphereGeometry(2, 24, 24), footballMaterial);
football.position.set(0,2,0);
football.rotation.y = -Math.PI/2;
football.castShadow = true;
let isBalling = true;
scene.add(football);



/*___ 8. Render Page ___*/
var render = function(){

	// Football animation
	if (isBalling)
	{
		football.position.z += 0.5;
		football.rotation.x += 0.1;	
	} 
	else
	{
		football.position.z -= 0.5;
		football.rotation.x -= 0.1;
	}

	if (football.position.z > 20)
		isBalling = false;

	if (football.position.z < -20)
		isBalling = true;

	renderer.render(scene, camera);
	controls.update();
	requestAnimationFrame(render);  
}
render();
