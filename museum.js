
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// IT WORLD 3D - TECHNOLOGY MUSEUM
// ==========================================

const container = document.getElementById("museum3d");

if (!container) {
    throw new Error("Element museum3d introuvable !");
}

// ==========================================
// SCENE
// ==========================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x100c1c);
scene.fog = new THREE.Fog(0x100c1c, 18, 38);

const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(0, 7, 17);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

container.appendChild(renderer.domElement);

// ==========================================
// CAMERA CONTROLS
// ==========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enablePan = false;

controls.minDistance = 9;
controls.maxDistance = 25;

controls.maxPolarAngle = Math.PI * 0.48;
controls.minPolarAngle = Math.PI * 0.12;

controls.target.set(0, 3, 0);

controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// ==========================================
// LIGHTING
// ==========================================

scene.add(
    new THREE.AmbientLight(0xffffff, 0.7)
);

const mainLight = new THREE.PointLight(
    0xa77bff,
    160,
    35
);

mainLight.position.set(0, 9, 0);
scene.add(mainLight);

const blueLight = new THREE.PointLight(
    0x428cff,
    100,
    25
);

blueLight.position.set(-7, 5, 5);
scene.add(blueLight);

const pinkLight = new THREE.PointLight(
    0xc45bff,
    100,
    25
);

pinkLight.position.set(7, 5, -5);
scene.add(pinkLight);

// ==========================================
// MATERIALS
// ==========================================

const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x211932,
    metalness: 0.75,
    roughness: 0.3
});

const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x191328,
    metalness: 0.65,
    roughness: 0.25
});

const purpleMaterial = new THREE.MeshStandardMaterial({
    color: 0x7045b5,
    emissive: 0x37156d,
    emissiveIntensity: 0.8
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x34204f,
    metalness: 0.3,
    roughness: 0.15,
    transparent: true,
    opacity: 0.65,
    transmission: 0.15
});

// ==========================================
// FLOOR
// ==========================================

const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(
        11,
        11,
        0.5,
        96
    ),
    floorMaterial
);

floor.position.y = -0.3;
floor.receiveShadow = true;

scene.add(floor);

// Central floor circle

const centralRing = new THREE.Mesh(
    new THREE.TorusGeometry(
        4,
        0.045,
        16,
        100
    ),
    new THREE.MeshBasicMaterial({
        color: 0xa77bff
    })
);

centralRing.rotation.x = Math.PI / 2;
centralRing.position.y = -0.03;

scene.add(centralRing);

// Floor decorative rings

for (let i = 0; i < 3; i++) {

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
            5.5 + i * 1.2,
            0.025,
            8,
            100
        ),
        new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x7045b5 : 0x347fce,
            transparent: true,
            opacity: 0.65
        })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.02 + i * 0.005;

    scene.add(ring);

}

// ==========================================
// WALLS
// ==========================================

const wall = new THREE.Mesh(
    new THREE.CylinderGeometry(
        10,
        10,
        9,
        96,
        1,
        true
    ),
    darkMaterial
);

wall.position.y = 4.2;
wall.receiveShadow = true;

scene.add(wall);

// ==========================================
// CEILING
// ==========================================

const ceiling = new THREE.Mesh(
    new THREE.CylinderGeometry(
        10,
        10,
        0.3,
        96
    ),
    darkMaterial
);

ceiling.position.y = 8.7;

scene.add(ceiling);

// Ceiling ring

const ceilingRing = new THREE.Mesh(
    new THREE.TorusGeometry(
        7.5,
        0.07,
        16,
        100
    ),
    new THREE.MeshBasicMaterial({
        color: 0x9e6aff
    })
);

ceilingRing.position.y = 8.5;

scene.add(ceilingRing);

// ==========================================
// COLUMNS
// ==========================================

function createColumn(angle) {

    const column = new THREE.Group();

    const radius = 9.2;

    column.position.set(
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius
    );

    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.25,
            0.35,
            8,
            24
        ),
        glassMaterial
    );

    body.position.y = 4;

    column.add(body);

    const light = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.06,
            0.06,
            7.5,
            16
        ),
        new THREE.MeshBasicMaterial({
            color: 0xa77bff
        })
    );

    light.position.set(0.27, 4, 0);

    column.add(light);

    const top = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.55,
            0.55,
            0.3,
            32
        ),
        purpleMaterial
    );

    top.position.y = 8;

    column.add(top);

    scene.add(column);

}

for (let i = 0; i < 12; i++) {

    createColumn(
        (i / 12) * Math.PI * 2
    );

}

// ==========================================
// CREATE TEXT LABEL
// ==========================================

function createText(text, color = "#ffffff") {

    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, 512, 128);

    ctx.font = "bold 43px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = color;
    ctx.shadowBlur = 18;

    ctx.fillStyle = color;

    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        })
    );

    sprite.scale.set(3.5, 0.85, 1);

    return sprite;

}

// ==========================================
// MUSEUM DOORS
// ==========================================

const exhibitions = [
    {
        name: "HARDWARE",
        url: "hardware.html",
        color: 0x519bff,
        position: [-7, 1.7, -3]
    },
    {
        name: "SOFTWARE",
        url: "software.html",
        color: 0xb17aff,
        position: [0, 1.7, -8]
    },
    {
        name: "PROGRAMMING",
        url: "python.html",
        color: 0x38d9b0,
        position: [7, 1.7, -3]
    },
    {
        name: "NETWORK",
        url: "network.html",
        color: 0x45c9ff,
        position: [-7, 1.7, 3]
    },
    {
        name: "CYBERSECURITY",
        url: "security.html",
        color: 0xff79a8,
        position: [0, 1.7, 8]
    },
    {
        name: "ARTIFICIAL INTELLIGENCE",
        url: "ai.html",
        color: 0xffc857,
        position: [7, 1.7, 3]
    }
];

const clickableDoors = [];
const animatedDoors = [];

function createDoor(exhibition, index) {

    const group = new THREE.Group();

    const [x, y, z] = exhibition.position;

    group.position.set(x, y, z);

    // Face the center of the museum

    group.lookAt(0, y, 0);

    // Door frame

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x332344,
        metalness: 0.8,
        roughness: 0.2,
        emissive: exhibition.color,
        emissiveIntensity: 0.25
    });

    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 3.8, 0.45),
        frameMaterial
    );

    leftFrame.position.set(-1.3, 1.9, 0);

    group.add(leftFrame);

    const rightFrame = leftFrame.clone();

    rightFrame.position.x = 1.3;

    group.add(rightFrame);

    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(2.85, 0.25, 0.45),
        frameMaterial
    );

    topFrame.position.set(0, 3.8, 0);

    group.add(topFrame);

    // Glowing portal

    const portal = new THREE.Mesh(
        new THREE.PlaneGeometry(2.35, 3.55),
        new THREE.MeshBasicMaterial({
            color: exhibition.color,
            transparent: true,
            opacity: 0.38,
            side: THREE.DoubleSide
        })
    );

    portal.position.set(0, 1.9, 0.12);

    group.add(portal);

    // Portal outline

    const outline = new THREE.Mesh(
        new THREE.TorusGeometry(
            1,
            0.035,
            12,
            64,
            Math.PI * 2
        ),
        new THREE.MeshBasicMaterial({
            color: exhibition.color
        })
    );

    outline.scale.set(1.3, 1.9, 1);
    outline.position.set(0, 1.9, 0.17);

    group.add(outline);

    // Interactive door surface

    const hitbox = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 3.5),
        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            depthWrite: false
        })
    );

    hitbox.position.set(0, 1.9, 0.22);

    hitbox.userData.url = exhibition.url;
    hitbox.userData.name = exhibition.name;

    group.add(hitbox);

    clickableDoors.push(hitbox);

    // Door label

    const label = createText(
        exhibition.name,
        "#ffffff"
    );

    label.position.set(0, 4.5, 0);

    group.add(label);

    // Number above the door

    const number = createText(
        `0${index + 1}`,
        "#c9a9ff"
    );

    number.scale.set(1.2, 0.4, 1);
    number.position.set(0, 4.95, 0);

    group.add(number);

    // Small lights

    for (let i = 0; i < 4; i++) {

        const light = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 16, 16),
            new THREE.MeshBasicMaterial({
                color: exhibition.color
            })
        );

        light.position.set(
            i % 2 === 0 ? -1.3 : 1.3,
            i < 2 ? 0.3 : 3.8,
            0.3
        );

        group.add(light);

    }

    // Portal illumination

    const pointLight = new THREE.PointLight(
        exhibition.color,
        18,
        6
    );

    pointLight.position.set(0, 2, 0.8);

    group.add(pointLight);

    scene.add(group);

    animatedDoors.push({
        portal,
        pointLight,
        index
    });

}

// Create six exhibitions

exhibitions.forEach((exhibition, index) => {

    createDoor(exhibition, index);

});

// ==========================================
// CENTRAL EXHIBITION PLATFORM
// ==========================================

const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(
        2.3,
        2.5,
        0.35,
        64
    ),
    new THREE.MeshStandardMaterial({
        color: 0x39245b,
        metalness: 0.8,
        roughness: 0.25,
        emissive: 0x24104a,
        emissiveIntensity: 0.5
    })
);

platform.position.y = 0.05;

scene.add(platform);

// Central holographic sphere

const sphere = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.1, 2),
    new THREE.MeshPhysicalMaterial({
        color: 0x9b6bff,
        metalness: 0.25,
        roughness: 0.15,
        transmission: 0.3,
        emissive: 0x5022a0,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85
    })
);

sphere.position.y = 2.1;

scene.add(sphere);

// Sphere rings

const sphereRing = new THREE.Mesh(
    new THREE.TorusGeometry(
        1.5,
        0.035,
        12,
        80
    ),
    new THREE.MeshBasicMaterial({
        color: 0x58cfff
    })
);

sphereRing.position.y = 2.1;
sphereRing.rotation.x = 1;

scene.add(sphereRing);

const sphereRing2 = sphereRing.clone();

sphereRing2.rotation.set(1.5, 0.8, 0.3);
sphereRing2.scale.setScalar(1.2);

scene.add(sphereRing2);

// ==========================================
// STARS
// ==========================================

const starGeometry = new THREE.BufferGeometry();

const starPositions = [];

for (let i = 0; i < 500; i++) {

    starPositions.push(
        (Math.random() - 0.5) * 35,
        Math.random() * 15,
        (Math.random() - 0.5) * 35
    );

}

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
    color: 0xd8c3ff,
    size: 0.045,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(
    starGeometry,
    starMaterial
);

scene.add(stars);

// ==========================================
// INTERACTION
// ==========================================

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

let pointerStart = null;

renderer.domElement.addEventListener(
    "pointerdown",
    (event) => {

        pointerStart = {
            x: event.clientX,
            y: event.clientY
        };

    }
);

renderer.domElement.addEventListener(
    "pointerup",
    (event) => {

        if (!pointerStart) return;

        const distance = Math.hypot(
            event.clientX - pointerStart.x,
            event.clientY - pointerStart.y
        );

        pointerStart = null;

        // Ignore camera movement

        if (distance > 7) return;

        const rect = renderer.domElement.getBoundingClientRect();

        mouse.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        mouse.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersections = raycaster.intersectObjects(
            clickableDoors,
            false
        );

        if (intersections.length > 0) {

            const door = intersections[0].object;

            const url = door.userData.url;

            if (url) {

                window.location.href = url;

            }

        }

    }
);

// Mouse cursor

renderer.domElement.addEventListener(
    "pointermove",
    (event) => {

        const rect = renderer.domElement.getBoundingClientRect();

        mouse.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1;

        mouse.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersections = raycaster.intersectObjects(
            clickableDoors,
            false
        );

        renderer.domElement.style.cursor =
            intersections.length > 0 ? "pointer" : "grab";

    }
);

// ==========================================
// RESIZE
// ==========================================

function resize() {

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

const resizeObserver = new ResizeObserver(resize);

resizeObserver.observe(container);

// ==========================================
// ANIMATION
// ==========================================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Central hologram

    sphere.rotation.y = time * 0.3;
    sphere.rotation.x = Math.sin(time * 0.4) * 0.2;

    sphere.position.y = 2.1 + Math.sin(time * 1.5) * 0.12;

    sphereRing.rotation.z = time * 0.4;
    sphereRing2.rotation.y = time * 0.3;

    // Portal animation

    animatedDoors.forEach((door) => {

        door.portal.material.opacity =
            0.25 + Math.sin(time * 2 + door.index) * 0.12;

        door.pointLight.intensity =
            15 + Math.sin(time * 2 + door.index) * 5;

    });

    // Stars

    stars.rotation.y = time * 0.008;

    controls.update();

    renderer.render(scene, camera);

}

animate();

// ==========================================
// RESET CAMERA
// ==========================================

function resetCamera() {

    camera.position.set(0, 7, 17);

    controls.target.set(0, 3, 0);

    controls.update();

}

// Double click to reset camera

renderer.domElement.addEventListener(
    "dblclick",
    resetCamera
);

console.log("IT WORLD 3D - Museum loaded successfully!");
