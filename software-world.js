
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// SOFTWARE WORLD 3D - LESSONS
// ==========================================

export const lessons = [
    {
        title: "Introduction aux logiciels",
        category: "LEÇON 01",
        icon: "💿",
        description: "Découvrez ce qu'est un logiciel et son rôle dans un ordinateur.",
        explanation: "Un logiciel est un ensemble de programmes et d'instructions qui permettent à un ordinateur d'effectuer différentes tâches. Contrairement au matériel, un logiciel est une partie immatérielle de l'ordinateur.",
        example: "Un navigateur web comme Google Chrome est un logiciel qui permet de visiter des sites Internet.",
        question: "Qu'est-ce qu'un logiciel ?",
        options: [
            "Une partie physique de l'ordinateur",
            "Un ensemble de programmes et d'instructions",
            "Un câble informatique"
        ],
        answer: 1
    },
    {
        title: "Les systèmes d'exploitation",
        category: "LEÇON 02",
        icon: "🖥️",
        description: "Découvrez les systèmes qui permettent de faire fonctionner un ordinateur.",
        explanation: "Un système d'exploitation est un logiciel principal qui gère les ressources de l'ordinateur. Il permet de communiquer avec le matériel et d'utiliser les applications.",
        example: "Windows, Linux, macOS et Android sont des systèmes d'exploitation.",
        question: "Quel élément est un système d'exploitation ?",
        options: [
            "Microsoft Word",
            "Windows",
            "Google Chrome"
        ],
        answer: 1
    },
    {
        title: "Les logiciels applicatifs",
        category: "LEÇON 03",
        icon: "📱",
        description: "Apprenez à reconnaître les applications utilisées au quotidien.",
        explanation: "Les logiciels applicatifs sont des programmes conçus pour aider l'utilisateur à réaliser des tâches précises : écrire un document, modifier une image, communiquer ou naviguer sur Internet.",
        example: "Microsoft Word sert à rédiger des documents et VLC permet de lire des vidéos.",
        question: "Quel logiciel permet de rédiger un document ?",
        options: [
            "Microsoft Word",
            "Un pilote matériel",
            "Le BIOS"
        ],
        answer: 0
    },
    {
        title: "Les logiciels système",
        category: "LEÇON 04",
        icon: "⚙️",
        description: "Comprenez les programmes qui gèrent le fonctionnement de l'ordinateur.",
        explanation: "Les logiciels système permettent de gérer le matériel et les ressources de l'ordinateur. Ils facilitent le fonctionnement du système d'exploitation et des périphériques.",
        example: "Un pilote (driver) permet au système d'exploitation de communiquer avec une imprimante.",
        question: "Quel est le rôle d'un pilote informatique ?",
        options: [
            "Créer des vidéos",
            "Décorer le bureau",
            "Permettre la communication avec un périphérique"
        ],
        answer: 2
    },
    {
        title: "Installation et mise à jour",
        category: "LEÇON 05",
        icon: "📦",
        description: "Découvrez comment installer et maintenir vos logiciels à jour.",
        explanation: "L'installation consiste à préparer un logiciel pour son utilisation sur un appareil. Les mises à jour apportent des améliorations, corrigent des erreurs et renforcent parfois la sécurité.",
        example: "Installer une nouvelle version de Firefox permet de bénéficier de nouvelles fonctionnalités et de corrections.",
        question: "Pourquoi faut-il mettre à jour ses logiciels ?",
        options: [
            "Pour corriger des erreurs et améliorer la sécurité",
            "Pour supprimer tous les fichiers",
            "Pour éteindre définitivement l'ordinateur"
        ],
        answer: 0
    },
    {
        title: "Licences et sécurité",
        category: "LEÇON 06",
        icon: "🔐",
        description: "Apprenez à utiliser les logiciels légalement et en toute sécurité.",
        explanation: "Une licence logicielle définit les conditions d'utilisation d'un programme. Certains logiciels sont propriétaires, d'autres sont libres ou open source. Il faut télécharger les logiciels depuis des sources fiables et respecter leurs licences.",
        example: "Linux est un système open source. Certains logiciels commerciaux nécessitent une licence payante.",
        question: "Quelle est une bonne pratique pour télécharger un logiciel ?",
        options: [
            "Télécharger depuis n'importe quel site",
            "Utiliser une source officielle et fiable",
            "Désactiver toutes les protections"
        ],
        answer: 1
    }
];

// ==========================================
// VARIABLES
// ==========================================

let scene;
let camera;
let renderer;
let controls;

let container;
let animationId;
let resizeObserver;

let clickCallback = () => {};

let stations = [];
let clickableObjects = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let pointerDown = null;

// ==========================================
// COLORS
// ==========================================

const colors = [
    0xa77bff,
    0x42b9ff,
    0x38d9b0,
    0xffc857,
    0xff83c5,
    0x9d9bff
];

// ==========================================
// CREATE SCENE
// ==========================================

function createScene() {

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x171126);
    scene.fog = new THREE.Fog(0x171126, 18, 45);

    camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 8, 17);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 9;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2;

    // Ambient light

    scene.add(
        new THREE.AmbientLight(0xffffff, 1.5)
    );

    // Purple light

    const purpleLight = new THREE.PointLight(
        0xa77bff,
        100,
        30
    );

    purpleLight.position.set(0, 8, 5);
    scene.add(purpleLight);

    // Blue light

    const blueLight = new THREE.PointLight(
        0x318cff,
        70,
        25
    );

    blueLight.position.set(-8, 4, -5);
    scene.add(blueLight);

    // Floor

    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(18, 80),
        new THREE.MeshStandardMaterial({
            color: 0x211735,
            roughness: 0.8,
            metalness: 0.2
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.15;

    scene.add(floor);

    // Grid

    const grid = new THREE.GridHelper(
        35,
        35,
        0x754ab0,
        0x382653
    );

    grid.position.y = -0.12;
    scene.add(grid);

    createStars();
}

// ==========================================
// STARS
// ==========================================

function createStars() {

    const geometry = new THREE.BufferGeometry();

    const positions = [];

    for (let i = 0; i < 350; i++) {

        positions.push(
            (Math.random() - 0.5) * 35,
            Math.random() * 12 + 1,
            (Math.random() - 0.5) * 35
        );

    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0xcbb5ff,
        size: 0.045,
        transparent: true,
        opacity: 0.8
    });

    scene.add(
        new THREE.Points(geometry, material)
    );

}

// ==========================================
// LABELS
// ==========================================

function createLabel(text) {

    const canvas = document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(42, 29, 65, 0.95)";

    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 25);
    ctx.fill();

    ctx.strokeStyle = "#a77bff";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 27px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, 256, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        })
    );

    sprite.scale.set(3.3, 0.82, 1);

    return sprite;
}

// ==========================================
// STATION BASE
// ==========================================

function createBase(x, z, color, index) {

    const group = new THREE.Group();

    group.position.set(x, 0, z);

    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(
            1.3,
            1.5,
            0.25,
            40
        ),
        new THREE.MeshStandardMaterial({
            color: 0x34244f,
            metalness: 0.7,
            roughness: 0.3
        })
    );

    base.position.y = 0.15;
    group.add(base);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
            1.25,
            0.045,
            12,
            60
        ),
        new THREE.MeshBasicMaterial({
            color
        })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.3;

    group.add(ring);

    const label = createLabel(
        `${String(index + 1).padStart(2, "0")} · ${lessons[index].title}`
    );

    label.position.set(0, 3.2, 0);

    group.add(label);

    scene.add(group);

    return group;
}

// ==========================================
// 01 - SOFTWARE
// ==========================================

function createSoftware(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.6,
        roughness: 0.25
    });

    const objects = [];

    // CD disc

    const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.85,
            0.85,
            0.08,
            64
        ),
        material
    );

    disc.rotation.x = Math.PI / 2;
    disc.position.y = 1.5;

    group.add(disc);
    objects.push(disc);

    // Disc center

    const center = new THREE.Mesh(
        new THREE.TorusGeometry(
            0.2,
            0.06,
            12,
            32
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    center.position.set(0, 1.5, 0.08);

    group.add(center);
    objects.push(center);

    return objects;
}

// ==========================================
// 02 - OPERATING SYSTEM
// ==========================================

function createOperatingSystem(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.25
    });

    const objects = [];

    // Screen

    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.1, 0.15),
        material
    );

    screen.position.y = 1.8;

    group.add(screen);
    objects.push(screen);

    // Four windows

    const windowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    for (let i = 0; i < 4; i++) {

        const square = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.38, 0.03),
            windowMaterial
        );

        square.position.set(
            (i % 2) * 0.52 - 0.26,
            1.8 + (i < 2 ? 0.23 : -0.23),
            0.09
        );

        group.add(square);
        objects.push(square);

    }

    return objects;
}

// ==========================================
// 03 - APPLICATIONS
// ==========================================

function createApplications(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.3
    });

    const objects = [];

    const shapes = [
        new THREE.BoxGeometry(0.65, 0.65, 0.65),
        new THREE.SphereGeometry(0.4, 24, 24),
        new THREE.ConeGeometry(0.4, 0.8, 32)
    ];

    const positions = [
        [-0.8, 1.4, 0],
        [0, 2, 0],
        [0.8, 1.4, 0]
    ];

    shapes.forEach((geometry, index) => {

        const mesh = new THREE.Mesh(
            geometry,
            material
        );

        mesh.position.set(...positions[index]);

        group.add(mesh);
        objects.push(mesh);

    });

    return objects;
}

// ==========================================
// 04 - SYSTEM SOFTWARE
// ==========================================

function createSystemSoftware(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.6,
        roughness: 0.3
    });

    const objects = [];

    const gear = new THREE.Mesh(
        new THREE.TorusGeometry(
            0.75,
            0.18,
            16,
            12
        ),
        material
    );

    gear.position.y = 1.6;

    group.add(gear);
    objects.push(gear);

    const center = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.3,
            0.3,
            0.25,
            32
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    center.position.y = 1.6;

    group.add(center);
    objects.push(center);

    return objects;
}

// ==========================================
// 05 - INSTALLATION
// ==========================================

function createInstallation(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.3
    });

    const objects = [];

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.2, 0.8),
        material
    );

    box.position.y = 1.5;

    group.add(box);
    objects.push(box);

    // Download arrow

    const arrow = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.65, 4),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    arrow.position.set(0, 1.6, 0.48);
    arrow.rotation.x = Math.PI;

    group.add(arrow);
    objects.push(arrow);

    const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.08,
            0.08,
            0.65
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    shaft.position.set(0, 2.1, 0.48);

    group.add(shaft);
    objects.push(shaft);

    return objects;
}

// ==========================================
// 06 - SECURITY
// ==========================================

function createSecurity(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.6,
        roughness: 0.25
    });

    const objects = [];

    const shield = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.9, 1),
        material
    );

    shield.position.y = 1.6;
    shield.scale.set(1, 1.2, 0.35);

    group.add(shield);
    objects.push(shield);

    const lock = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.45, 0.25),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    lock.position.set(0, 1.5, 0.4);

    group.add(lock);
    objects.push(lock);

    return objects;
}

// ==========================================
// CREATE ALL STATIONS
// ==========================================

function createStations() {

    const positions = [
        [-6, -3],
        [0, -5],
        [6, -3],
        [-6, 3],
        [0, 5],
        [6, 3]
    ];

    const creators = [
        createSoftware,
        createOperatingSystem,
        createApplications,
        createSystemSoftware,
        createInstallation,
        createSecurity
    ];

    lessons.forEach((lesson, index) => {

        const [x, z] = positions[index];

        const color = colors[index];

        const group = createBase(
            x,
            z,
            color,
            index
        );

        const objects = creators[index](
            group,
            color
        );

        objects.forEach(object => {

            object.userData.lessonIndex = index;

            clickableObjects.push(object);

        });

        stations.push({
            group,
            objects,
            color
        });

    });

}

// ==========================================
// SELECT STATION
// ==========================================

export function selectSoftwareStation(index) {

    if (!stations[index]) return;

    stations.forEach((station, i) => {

        const active = i === index;

        station.group.scale.setScalar(
            active ? 1.12 : 1
        );

        station.objects.forEach(object => {

            if (
                object.material &&
                object.material.emissive
            ) {

                object.material.emissive.set(
                    active ? station.color : 0x000000
                );

                object.material.emissiveIntensity =
                    active ? 0.35 : 0.05;

            }

        });

    });

}

// ==========================================
// CLICK DETECTION
// ==========================================

function handlePointerDown(event) {

    pointerDown = {
        x: event.clientX,
        y: event.clientY
    };

}

function handlePointerUp(event) {

    if (!pointerDown) return;

    const distance = Math.hypot(
        event.clientX - pointerDown.x,
        event.clientY - pointerDown.y
    );

    pointerDown = null;

    if (distance > 6) return;

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

    mouse.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersections = raycaster.intersectObjects(
        clickableObjects,
        true
    );

    if (intersections.length > 0) {

        const index =
            intersections[0].object.userData.lessonIndex;

        if (index !== undefined) {

            selectSoftwareStation(index);

            clickCallback(index);

        }

    }

}

// ==========================================
// RESET CAMERA
// ==========================================

function resetCamera() {

    camera.position.set(0, 8, 17);

    controls.target.set(0, 0.8, 0);

    controls.update();

}

// ==========================================
// ANIMATION
// ==========================================

function animate() {

    animationId = requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    stations.forEach((station, index) => {

        station.objects.forEach((object, objectIndex) => {

            if (
                object.geometry &&
                object.geometry.type !== "Line"
            ) {

                object.rotation.y =
                    Math.sin(time + index + objectIndex) * 0.003;

            }

        });

    });

    controls.update();

    renderer.render(scene, camera);

}

// ==========================================
// RESIZE
// ==========================================

function handleResize() {

    if (!container || !renderer || !camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

// ==========================================
// INITIALIZE WORLD
// ==========================================

export function initSoftwareWorld({
    container: worldContainer,
    onSelect
}) {

    container = worldContainer;

    clickCallback = onSelect || (() => {});

    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    stations = [];
    clickableObjects = [];

    createScene();

    createStations();

    selectSoftwareStation(0);

    controls.target.set(0, 0.8, 0);

    controls.update();

    renderer.domElement.addEventListener(
        "pointerdown",
        handlePointerDown
    );

    renderer.domElement.addEventListener(
        "pointerup",
        handlePointerUp
    );

    resizeObserver = new ResizeObserver(handleResize);

    resizeObserver.observe(container);

    animate();

    return {
        resetCamera
    };

}
