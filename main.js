import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes ={
    width: window.innerWidth,
    height: window.innerHeight
}

const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

const loader = new GLTFLoader();

loader.load( './Portafolio.glb', function ( gltf ) {
    console.log(gltf);
    scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );

const light = new THREE.AmbientLight( 0x404040, 4 ); // soft white light
scene.add( light );

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);

camera.position.x = -53;
camera.position.y = 22;
camera.position.z = 64;

const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;
controls.update();

renderer.setAnimationLoop( animate );

function onWindowResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize( sizes.width, sizes.height );
  renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );
}

window.addEventListener( 'resize', onWindowResize );

function animate() {
    
    controls.update();
    renderer.render( scene, camera );

}