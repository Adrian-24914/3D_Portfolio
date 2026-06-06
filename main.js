import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes ={
    width: window.innerWidth,
    height: window.innerHeight
}

const renderer = new THREE.WebGLRenderer( { canvas: canvas } );
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) );

const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
);
camera.position.z = 5;

const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;
controls.update();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

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

function animate( time ) {

  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;

  controls.update();
  renderer.render( scene, camera );

}