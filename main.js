import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const canvas = document.getElementById('experience-canvas');
const sizes ={
    width: window.innerWidth,
    height: window.innerHeight
}

let caiman = {
    instance: null,
    moveDistance: 3,
    jumpHeight: 1,
    isMoving: false,
    moveDuration: 0.2,
};

const jumpConfig = {
    height: 1,       
    duration: 0.35,     
    minDelay: 0.4,     
    maxDelay: 0.75,     
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const moveRaycaster = new THREE.Raycaster();
let collisionObjects = [];
let cameraFollowOffset = new THREE.Vector3(-130, 0, 90);
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

const jumpingChars = []; 
const jumpingTimers = []; 
let demonMesh = null; 

function isDescendant(node, ancestor) {
    while (node) {
        if (node === ancestor) return true;
        node = node.parent;
    }
    return false;
}

loader.load( './Portafolio.glb', function ( gltf ) {
    gltf.scene.traverse((child) => {
        if (intersectObjectsNames.includes(child.name)) {
            intersectObjects.push(child);
        }

        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }

        if (child.name === "Caiman") {
            caiman.instance = child;
        }

        const isChar = /^Char(\d{3})?$/.test(child.name);
        if (isChar && child.isMesh) {
            jumpingChars.push(child);
        }
        if (child.name === "Demon") {
            demonMesh = child;
        }

        if (child.isMesh && child.name !== "Caiman") {
            collisionObjects.push(child);
        }
    });

    if (caiman.instance) {
        collisionObjects = collisionObjects.filter((obj) => !isDescendant(obj, caiman.instance));
    }

    scene.add( gltf.scene );
    scene.updateMatrixWorld(true);

    if (caiman.instance) {
        cameraFollowOffset.x = camera.position.x - caiman.instance.position.x;
        cameraFollowOffset.z = camera.position.z - caiman.instance.position.z;
        controls.target.set(caiman.instance.position.x, 0, caiman.instance.position.z);
    }

    if (collisionObjects.length === 0) {
        const boundaryMaterial = new THREE.MeshBasicMaterial({ visible: false });
        const boundarySize = 140;
        const boundaryHeight = 70;
        const boundaryThickness = 4;

        const boundaries = [
            new THREE.Mesh(new THREE.BoxGeometry(boundaryThickness, boundaryHeight, boundarySize), boundaryMaterial),
            new THREE.Mesh(new THREE.BoxGeometry(boundaryThickness, boundaryHeight, boundarySize), boundaryMaterial),
            new THREE.Mesh(new THREE.BoxGeometry(boundarySize, boundaryHeight, boundaryThickness), boundaryMaterial),
            new THREE.Mesh(new THREE.BoxGeometry(boundarySize, boundaryHeight, boundaryThickness), boundaryMaterial),
        ];

        boundaries[0].position.set(-boundarySize / 2, boundaryHeight / 2, 0);
        boundaries[1].position.set(boundarySize / 2, boundaryHeight / 2, 0);
        boundaries[2].position.set(0, boundaryHeight / 2, -boundarySize / 2);
        boundaries[3].position.set(0, boundaryHeight / 2, boundarySize / 2);

        boundaries.forEach((wall) => {
            scene.add(wall);
            collisionObjects.push(wall);
        });
    }

    jumpingChars.forEach((mesh) => {
        applyRandomColor(mesh);
        startJumpLoop(mesh);
    });

    if (demonMesh) startDemonJump(demonMesh);

    }, undefined, function ( error ) {

    console.error( error );

} );

const sun = new THREE.DirectionalLight(0xFFFFFF, 5);
sun.castShadow = true;
sun.position.set(50, 100, 25);
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

const discoColors = [0x9B59B6, 0x2ECC71, 0xF1C40F, 0xE74C3C];
const discoConfig = { interval: 0.5 };

let discoIndex = 0;
function discoTick() {
    const color = discoColors[discoIndex % discoColors.length];
    gsap.to(sun.color, {
        r: ((color >> 16) & 255) / 255,
        g: ((color >> 8) & 255) / 255,
        b: (color & 255) / 255,
        duration: discoConfig.interval * 0.6,
        ease: "power1.inOut",
        onComplete: () => {
            discoIndex++;
            gsap.delayedCall(discoConfig.interval, discoTick);
        }
    });
}
discoTick();

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

const frustumSize = 13;
const aspect = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
    -aspect * frustumSize,
    aspect * frustumSize,
    frustumSize,
    -frustumSize,
    1,
    1000
);

camera.position.x = -110;
camera.position.y = 50;
camera.position.z = 115;

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

function moveCaiman(targetPosition, targetRotation) {
    if (isCaimanCollision(targetPosition)) {
        return;
    }

    caiman.isMoving = true;

    const t1 = gsap.timeline({
        onComplete: () => {
            caiman.isMoving = false;
        }
    });

    t1.to(caiman.instance.position, {
        x: targetPosition.x,
        z: targetPosition.z,
        duration: caiman.moveDuration,
    });

    t1.to(caiman.instance.rotation, 
        {
        y: targetRotation,
        duration: caiman.moveDuration,
        },
        0
    );

    t1.to(caiman.instance.position, 
        {
        y: caiman.instance.position.y + caiman.jumpHeight,
        duration: caiman.moveDuration/2,
        yoyo: true,
        repeat: 1,
        },
        0
    );
}

function startJumpLoop(mesh) {
    const baseY = mesh.position.y;

    function doJump() {
        gsap.to(mesh.position, {
            y: baseY + jumpConfig.height,
            duration: jumpConfig.duration / 2,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
            onComplete: scheduleNext,
        });
    }

    function scheduleNext() {
        const delay = jumpConfig.minDelay +
            Math.random() * (jumpConfig.maxDelay - jumpConfig.minDelay);
        gsap.delayedCall(delay, doJump);
    }

    const initialDelay = Math.random() * jumpConfig.maxDelay;
    gsap.delayedCall(initialDelay, doJump);
}

const charColors = [0x9B59B6, 0x2ECC71, 0xF1C40F, 0xE74C3C]; 

function applyRandomColor(mesh) {
    const color = charColors[Math.floor(Math.random() * charColors.length)];
    if (mesh.material) {
        mesh.material = mesh.material.clone();
        mesh.material.color.setHex(color);
    }
}

const demonJumpConfig = {
    height: 1.5,      
    duration: 0.6,    
};

function startDemonJump(mesh) {
    const baseY = mesh.position.y;
    function doJump() {
        gsap.to(mesh.position, {
            y: baseY + demonJumpConfig.height,
            duration: demonJumpConfig.duration / 2,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
            onComplete: doJump,
        });
    }
    doJump();
}

function isCaimanCollision(targetPosition) {
    if (!caiman.instance) return false;

    const origin = caiman.instance.position.clone();
    origin.y += 1;

    const direction = targetPosition.clone().sub(caiman.instance.position).normalize();
    const maxDistance = caiman.instance.position.distanceTo(targetPosition) + 0.2;

    moveRaycaster.set(origin, direction);
    const intersects = moveRaycaster.intersectObjects(collisionObjects, true);

    return intersects.some((hit) => hit.distance <= maxDistance);
}

function onKeyDown(event) {
    if (caiman.isMoving) return;

    const targetPosition = new THREE.Vector3().copy(caiman.instance.position);
    let targetRotation = 0;

    switch (event.key.toLowerCase()) {
    case "a":
    case "arrowleft":
        targetPosition.z -= caiman.moveDistance;
        targetRotation = 0;
        break;
    case "d":
    case "arrowright":
        targetPosition.z += caiman.moveDistance;
        targetRotation = Math.PI;
        break;
    case "s":
    case "arrowdown":
        targetPosition.x -= caiman.moveDistance;
        targetRotation = -Math.PI / 2;
        break;
    case "w":
    case "arrowup":
        targetPosition.x += caiman.moveDistance;
        targetRotation = Math.PI / 2;
        break;
    default:
        return;

    
    }
    moveCaiman(targetPosition, targetRotation);
}

modalExitButton.addEventListener("click", hideModal);
window.addEventListener( 'resize', onWindowResize );
window.addEventListener( 'click', onClick );
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'keydown', onKeyDown );

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

    if (caiman.instance) {
        camera.position.x = caiman.instance.position.x + cameraFollowOffset.x;
        camera.position.z = caiman.instance.position.z + cameraFollowOffset.z;
        controls.target.set(caiman.instance.position.x, 0, caiman.instance.position.z);
    }

    controls.update();
    renderer.render(scene, camera);
}
