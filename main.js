import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes ={
    width: window.innerWidth,
    height: window.innerHeight
}
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 1.2;

const modalContent= {
    "AboutMe": {
        title: "About Me",
        content: "I love weird / unique animes, like Dorohedoro (This site its based on it!). I also enjoy playing a diverse range of videogames, from yout typical shoters to more unique and artistic indie games. I really want to work in the gaming industry, at least have some personal proyects to publish and share with the world."
    },
    "Socials": {
        title: "Socials",
        content: "LinkedIn: Adrian Penagos",
        link: "https://www.linkedin.com/in/adrian-penagos-b702bb3b3/"
    },
    "Proyects": {
        title: "Projects",
        content: "You can check most of my projects on my GitHub! I have developed a REST API in Go and PostgreSQL, an Android task manager app with Kotlin and Jetpack Compose, and C++ projects focused on thread synchronization and performance analysis. I also work with React, TypeScript, and modern web technologies.",
        link: "https://github.com/Adrian-24914"
    },
    "Scene": { 
        title: "Whoa, THAT'S ME!",
        content: "My Name is Adrian, and I am a Computer Science student at the Univesidad del Valle de Guatemala. I am passionate about programming and game development, and I am eager to learn and grow in this field. I have experience with a variety of programming languages and technologies (explore this world to find out which ones!), and I am always looking for new challenges and opportunities to improve my skills."
    }
};

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalProjectDescription = document.querySelector(".modal-project-desc");
const modalExitButton = document.querySelector(".modal-exit");
const modalVisitButton = document.querySelector(".modal-visit");

function showModal(id){
    const content = modalContent[id];
    if (content) {
        modalTitle.textContent = content.title;
        modalProjectDescription.textContent = content.content;
        if (content.link) {
            modalVisitButton.href = content.link;
            modalVisitButton.classList.remove("hidden");
        } else {
            modalVisitButton.removeAttribute("href");
            modalVisitButton.classList.add("hidden");
        }
        modal.classList.toggle("hidden");
    }
}

function hideModal(){
    modal.classList.add("hidden");
}

const loader = new GLTFLoader();

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
    "AboutMe",
    "Socials",
    "Proyects",
    "WildLance"
];
loader.load( './Portafolio.glb', function ( gltf ) {
    gltf.scene.traverse((child) => {
        
        if (intersectObjectsNames.includes(child.name)) {
            intersectObjects.push(child);
        }

        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
        //console.log(child);
    });

    scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );

const sun = new THREE.DirectionalLight(0xFFFFFF, 5);
sun.castShadow = true;
sun.position.set(50, 100, -75);
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 300;
sun.shadow.bias = -0.0005;
sun.shadow.normalBias = 0.05;
scene.add(sun);

const light = new THREE.AmbientLight(0x404040, 2.5);
scene.add(light);

const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.ShadowMaterial({ opacity: 0.25 })
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = 0;
shadowPlane.receiveShadow = true;
scene.add(shadowPlane);

const frustumSize = 10;
const aspect = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
    -aspect * frustumSize,
    aspect * frustumSize,
    frustumSize,
    -frustumSize,
    1,
    1000
);

camera.position.x = -125;
camera.position.y = 70;
camera.position.z = 130;

const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true;
controls.update();

renderer.setAnimationLoop( animate );

function onWindowResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  const aspect = sizes.width / sizes.height;
  camera.left = -aspect * frustumSize;
  camera.right = aspect * frustumSize;
  camera.top = frustumSize;
  camera.bottom = -frustumSize;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onClick() {
    console.log(intersectObject);
    if (intersectObject !== ""){
        showModal(intersectObject);    
    }
    
}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;   
}

modalExitButton.addEventListener("click", hideModal);
window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'click', onClick );
window.addEventListener( 'pointermove', onPointerMove );


function animate() {

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( intersectObjects, true );

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
        intersectObject = "";
    }

    for ( let i = 0; i < intersects.length; i++ ) {

        intersectObject = intersects[0].object.parent.name;
    }

    controls.update();
    renderer.render(scene, camera);
}
