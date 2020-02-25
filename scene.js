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

// Grass texture
var textureGrass = textureLoader.load("resources/grass.jpg");
textureGrass.wrapS = textureGrass.wrapT = THREE.RepeatWrapping;
textureGrass.repeat.set( 8, 4 );
textureGrass.anisotropy = 16;
textureGrass.encoding = THREE.sRGBEncoding;

// Lawn
let lawnGeometry = new THREE.PlaneBufferGeometry(120, 280);
let lawnMaterial = new THREE.MeshPhongMaterial({ map: textureGrass });
let lawn = new THREE.Mesh(lawnGeometry, lawnMaterial);
lawn.receiveShadow = true;
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

/*___ Houses ___*/

let textureWood = textureLoader.load( "resources/wood.jpg" );
textureWood.wrapS = textureWood.wrapT = THREE.RepeatWrapping;
textureWood.repeat.set(4,4);

// House
let houseGeometry = new THREE.BoxGeometry(80, 80, 250)
let houseMaterial = new THREE.MeshBasicMaterial({ map: textureWood });
let house = new THREE.Mesh(houseGeometry, houseMaterial);

let house1 = house.clone();
house1.position.set(-150, 40, 0);
scene.add(house1);

let house2 = house.clone();
house2.position.set(190, 40, 0);
scene.add(house2);


// Balcony
let balconyGeometry = new THREE.BoxGeometry(30, 10, 250);
let balconyMaterial = new THREE.MeshBasicMaterial({ map: textureWood });
let balcony = new THREE.Mesh(balconyGeometry , balconyMaterial);

let balcony1 = balcony.clone();
balcony1.position.set(-95, 50, 0);
scene.add(balcony1);

let balcony2 = balcony.clone();
balcony2.position.set(135, 50, 0);
scene.add(balcony2);


// Doorstep
let textureDoorstep = textureLoader.load("resources/floor.jpg");
textureDoorstep.wrapS = textureDoorstep.wrapT = THREE.RepeatWrapping;
textureDoorstep.repeat.set(4, 8);

let doorstepGeometry = new THREE.BoxGeometry(30, 2, 250);
let doorstepMaterial = new THREE.MeshPhongMaterial({ map: textureDoorstep });
let doorstep = new THREE.Mesh(doorstepGeometry , doorstepMaterial);

let doorstep1 = doorstep.clone();
doorstep1.position.set(-95, 1, 0);
scene.add(doorstep1);

let doorstep2 = doorstep.clone();
doorstep2.position.set(135, 1, 0);
scene.add(doorstep2);


// Bush texture
let textureBush = textureLoader.load("resources/bush.jpg");
textureBush.wrapS = textureBush.wrapT = THREE.RepeatWrapping;
textureBush.repeat.set(8,1);
let bushGeometry = new THREE.BoxGeometry(8, 12, 45);
let bushMaterial = new THREE.MeshBasicMaterial({ map: textureBush });

for (let z = 105; z > -80; z-= 60) {
	let bush = new THREE.Mesh(bushGeometry, bushMaterial);
	bush.position.set(-84, 8, z);
	scene.add(bush);

	let bush2 = bush.clone();
	bush2.position.set(124, 8, z);
	scene.add(bush2);
}


// roof
let textureRoof = textureLoader.load( "resources/roof.jpg" );
textureRoof.wrapS = textureRoof.wrapT = THREE.RepeatWrapping;
textureRoof.repeat.set(2,2);
textureRoof.rotation = Math.PI /2;

let roofGeometry = new THREE.PlaneBufferGeometry(47.1699, 250);
let roofMaterial = new THREE.MeshPhongMaterial({ map: textureRoof });
let roof = new THREE.Mesh(roofGeometry, roofMaterial);

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

let roofWallMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
let roofWall = new THREE.Mesh(triangle, roofWallMaterial);

let roofWall1 = roofWall.clone();
roofWall1.position.set(230, 80, 125);
roofWall1.rotation.y = Math.PI;
scene.add(roofWall1);

let roofWall2 = roofWall.clone();
roofWall2.position.set(150, 80, -125);
scene.add(roofWall2);

let roofWall3 = roofWall.clone();
roofWall3.position.set(-110, 80, 125);
roofWall3.rotation.y = Math.PI;
scene.add(roofWall3);

let roofWall4 = roofWall.clone();
roofWall4.position.set(-190, 80, -125);
scene.add(roofWall4);


// Rooftop
let roofTopGeometry = new THREE.CylinderGeometry(1, 1, 250, 32);
let roofTopMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let roofTop = new THREE.Mesh(roofTopGeometry, roofTopMaterial);

let roofTop1 = roofTop.clone();
roofTop1.rotation.x = -Math.PI/2;
roofTop1.position.set(-150, 105, 0);
scene.add(roofTop1);

let roofTop2 = roofTop.clone();
roofTop2.rotation.x = -Math.PI/2;
roofTop2.position.set(190, 105, 0);
scene.add(roofTop2);

// Chimney
function createChimney(x, zMin, zMax){
	var chimneyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100 });
	var chimney = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 10), chimneyMaterial);

	for (let z = zMin; z < zMax; z+=20) {
		var chimney = chimney.clone();
		chimney.position.set(x, 105, z+z);
		scene.add(chimney);
	}
}
createChimney(-150, -60, 70);
createChimney(190, -60, 70);


let fenceGeometry = new THREE.PlaneBufferGeometry(28, 24);
let fenceMaterial = new THREE.MeshBasicMaterial({ color: 0x889993});
let fenceModel = new THREE.Mesh(fenceGeometry, fenceMaterial);
fenceModel.material.side = THREE.DoubleSide;
fenceModel.rotation.z = Math.PI / 2;

function createPillars(x, zMin, zMax){
	var materialPillar = new THREE.MeshBasicMaterial( {color: 0xfefce2} );
	var pillar = new THREE.Mesh(new THREE.CylinderGeometry( 1, 1, 46, 32 ), materialPillar);

	for (let z = zMin; z < zMax; z+=15) {
		var pillar = pillar.clone();
		pillar.position.set(x, 23, z+z);
		scene.add(pillar);

		let fence = fenceModel.clone();
		(x < 0) ? fence.position.set(x-13, 16, z+z) : fence.position.set(x+13, 16, z+z);
		
		scene.add(fence);
	}
}
createPillars(-85, -60, 75);
createPillars(125, -60, 75);


/*___ Decoration ___*/

// Big choicken
objectLoader.load("resources/models/chicken/minecraft-chicken.json", function ( chickenObject )
{
	chickenObject.scale.set(5, 5, 5);
	chickenObject.position.set(0,0,140);
	chickenObject.rotateY(-300);
	scene.add(chickenObject);
});

// Trees?

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

// Benches
objectLoader.load("resources/models/bench/wood-bench-2.json", function ( benchObject )
{
	benchObject.scale.set(0.08, 0.08, 0.08);

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

// Football
let footballGeometry = new THREE.SphereGeometry(2, 24, 24);
let footballMaterial = new THREE.MeshPhongMaterial();
footballMaterial.color.set(0xffffff);
footballMaterial.map = THREE.ImageUtils.loadTexture("resources/football.jpg");

let football = new THREE.Mesh(footballGeometry, footballMaterial);
football.position.set(0,2,0);
football.rotation.y = -Math.PI/2;
football.castShadow = true;
scene.add(football);

/*___ Render Page ___*/
var render = function(){
	renderer.render(scene, camera);
	controls.update();
	requestAnimationFrame(render);  
}
render();
