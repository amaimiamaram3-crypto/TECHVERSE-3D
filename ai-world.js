
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// IA WORLD 3D - LEÇONS
// ==========================================

export const lessons = [
    {
        title: "Introduction à l'intelligence artificielle",
        category: "LEÇON 01",
        icon: "🤖",
        description: "Découvrez l'intelligence artificielle et son fonctionnement.",
        explanation: "L'intelligence artificielle (IA) est une technologie qui permet aux machines d'effectuer des tâches qui nécessitent normalement l'intelligence humaine : reconnaître des images, comprendre le langage ou résoudre des problèmes.",
        example: "Un assistant virtuel qui répond à vos questions utilise l'intelligence artificielle.",
        question: "Que permet de faire l'intelligence artificielle ?",
        options: [
            "Effectuer des tâches intelligentes",
            "Remplacer tous les ordinateurs",
            "Fonctionner sans électricité"
        ],
        answer: 0
    },

    {
        title: "Machine Learning",
        category: "LEÇON 02",
        icon: "🧠",
        description: "Découvrez comment une machine peut apprendre à partir des données.",
        explanation: "Le Machine Learning est une branche de l'intelligence artificielle. Il permet à un ordinateur d'apprendre à partir d'exemples et de données, sans programmer chaque décision manuellement.",
        example: "Une application qui apprend à reconnaître les messages indésirables utilise le Machine Learning.",
        question: "Sur quoi repose principalement le Machine Learning ?",
        options: [
            "Sur les câbles",
            "Sur les données et les exemples",
            "Sur les écrans"
        ],
        answer: 1
    },

    {
        title: "Deep Learning",
        category: "LEÇON 03",
        icon: "🕸️",
        description: "Explorez les réseaux de neurones artificiels.",
        explanation: "Le Deep Learning est une technique du Machine Learning. Il utilise des réseaux de neurones artificiels organisés en plusieurs couches pour apprendre des informations complexes.",
        example: "La reconnaissance faciale sur un smartphone peut utiliser le Deep Learning.",
        question: "Quel élément est utilisé dans le Deep Learning ?",
        options: [
            "Les réseaux de neurones",
            "Les imprimantes",
            "Les claviers"
        ],
        answer: 0
    },

    {
        title: "Les données",
        category: "LEÇON 04",
        icon: "📊",
        description: "Comprenez le rôle des données dans l'intelligence artificielle.",
        explanation: "Les données sont des informations utilisées pour entraîner les systèmes d'intelligence artificielle. Elles peuvent être des textes, des images, des sons ou des nombres. Leur qualité influence les résultats de l'IA.",
        example: "Pour reconnaître des chats, une IA peut apprendre à partir de milliers d'images de chats.",
        question: "Pourquoi les données sont-elles importantes ?",
        options: [
            "Elles décorent l'écran",
            "Elles permettent à l'IA d'apprendre",
            "Elles remplacent le processeur"
        ],
        answer: 1
    },

    {
        title: "Applications de l'IA",
        category: "LEÇON 05",
        icon: "🌐",
        description: "Découvrez les utilisations de l'IA dans notre vie quotidienne.",
        explanation: "L'intelligence artificielle est utilisée dans plusieurs domaines : la médecine, l'éducation, les transports, les téléphones et les applications de traduction.",
        example: "Une application de navigation peut utiliser l'IA pour analyser le trafic et proposer un itinéraire.",
        question: "Dans quel domaine peut-on utiliser l'IA ?",
        options: [
            "Uniquement dans les jeux",
            "Uniquement dans les calculatrices",
            "Dans la médecine et les transports"
        ],
        answer: 2
    },

    {
        title: "IA et éthique",
        category: "LEÇON 06",
        icon: "⚖️",
        description: "Apprenez à utiliser l'intelligence artificielle de manière responsable.",
        explanation: "L'éthique de l'IA concerne les règles et les principes qui permettent de développer et d'utiliser cette technologie de manière responsable. Il faut protéger les données personnelles, éviter les discriminations et vérifier les résultats.",
        example: "Avant de partager une information produite par une IA, il faut vérifier si elle est correcte.",
        question: "Quelle est une bonne pratique avec l'IA ?",
        options: [
            "Partager toutes ses données personnelles",
            "Vérifier les informations générées",
            "Croire toutes les réponses sans vérifier"
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
let animationId;

let container;
let clickCallback = () => {};

let stations = [];
let clickableObjects = [];

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let resizeObserver;
let pointerDown = null;

// ==========================================
// COULEURS
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
// SCENE
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
        antialias: true,
        alpha: false
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

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.minDistance = 9;
    controls.maxDistance = 25;

    controls.maxPolarAngle = Math.PI / 2;

    // Lumières

    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);

    const mainLight = new THREE.PointLight(
        0xa77bff,
        100,
        30
    );

    mainLight.position.set(0, 8, 5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(
        0x318cff,
        70,
        25
    );

    blueLight.position.set(-8, 4, -5);
    scene.add(blueLight);

    // Sol

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

    // Grille

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

    const stars = new THREE.Points(geometry, material);

    scene.add(stars);
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

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    const sprite = new THREE.Sprite(material);

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
        new THREE.CylinderGeometry(1.3, 1.5, 0.25, 40),
        new THREE.MeshStandardMaterial({
            color: 0x34244f,
            metalness: 0.7,
            roughness: 0.3
        })
    );

    base.position.y = 0.15;
    group.add(base);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.25, 0.045, 12, 60),
        new THREE.MeshBasicMaterial({
            color: color
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
// 3D OBJECTS
// ==========================================

function createRobot(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.25
    });

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 0.65),
        material
    );

    body.position.y = 1.35;
    group.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        material
    );

    head.position.y = 2.15;
    group.add(head);

    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff
    });

    for (const x of [-0.17, 0.17]) {

        const eye = new THREE.Mesh(
            new THREE.SphereGeometry(0.07, 16, 16),
            eyeMaterial
        );

        eye.position.set(x, 2.2, 0.43);
        group.add(eye);

    }

    const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.35),
        material
    );

    antenna.position.y = 2.65;
    group.add(antenna);

    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    ball.position.y = 2.85;
    group.add(ball);

    return [body, head];
}

function createBrain(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.5,
        roughness: 0.25
    });

    const brain = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.9, 2),
        material
    );

    brain.position.y = 1.65;
    group.add(brain);

    const points = [];

    for (let i = 0; i < 18; i++) {

        const angle = (i / 18) * Math.PI * 2;

        const point = new THREE.Mesh(
            new THREE.SphereGeometry(0.09, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );

        point.position.set(
            Math.cos(angle) * 1.25,
            1.65 + Math.sin(angle * 2) * 0.5,
            Math.sin(angle) * 1.25
        );

        group.add(point);
        points.push(point);

    }

    return [brain, ...points];
}

function createNeuralNetwork(group, color) {

    const nodes = [];

    const positions = [
        [-0.8, 1, 0],
        [0, 1.8, 0],
        [0.8, 1, 0],
        [-0.8, 2.4, 0],
        [0.8, 2.4, 0],
        [0, 3, 0]
    ];

    positions.forEach(position => {

        const node = new THREE.Mesh(
            new THREE.SphereGeometry(0.22, 24, 24),
            new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.4
            })
        );

        node.position.set(...position);

        group.add(node);
        nodes.push(node);

    });

    const connections = [
        [0, 1], [0, 2],
        [1, 3], [1, 4],
        [2, 4], [3, 5],
        [4, 5]
    ];

    connections.forEach(([a, b]) => {

        const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[a].position,
            nodes[b].position
        ]);

        const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );

        group.add(line);

    });

    return nodes;
}

function createDatabase(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.3
    });

    const cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 1.6, 40),
        material
    );

    cylinder.position.y = 1.3;
    group.add(cylinder);

    for (let i = 0; i < 3; i++) {

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.8, 0.035, 12, 40),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );

        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.7 + i * 0.6;

        group.add(ring);

    }

    return [cylinder];
}

function createApplications(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color: color,
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
        [-0.8, 1.3, 0],
        [0, 2, 0],
        [0.8, 1.3, 0]
    ];

    shapes.forEach((geometry, i) => {

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(...positions[i]);

        group.add(mesh);
        objects.push(mesh);

    });

    return objects;
}

function createEthics(group, color) {

    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.25
    });

    const shield = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.9, 1),
        material
    );

    shield.position.y = 1.6;
    shield.scale.set(1, 1.2, 0.35);

    group.add(shield);

    const check = new THREE.Mesh(
        new THREE.TorusGeometry(0.35, 0.09, 12, 30),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    check.position.set(0, 1.65, 0.4);
    group.add(check);

    return [shield, check];
}

// ==========================================
// CREATE STATIONS
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

    lessons.forEach((lesson, index) => {

        const color = colors[index];

        const [x, z] = positions[index];

        const group = createBase(x, z, color, index);

        let objects = [];

        switch (index) {

            case 0:
                objects = createRobot(group, color);
                break;

            case 1:
                objects = createBrain(group, color);
                break;

            case 2:
                objects = createNeuralNetwork(group, color);
                break;

            case 3:
                objects = createDatabase(group, color);
                break;

            case 4:
                objects = createApplications(group, color);
                break;

            case 5:
                objects = createEthics(group, color);
                break;

        }

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

export function selectWorldStation(index) {

    if (!stations[index]) return;

    stations.forEach((station, i) => {

        const active = i === index;

        station.group.scale.setScalar(active ? 1.12 : 1);

        station.objects.forEach(object => {

            if (object.material && object.material.emissive) {

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

    // Ignore camera dragging

    if (distance > 6) return;

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = (
        (event.clientX - rect.left) / rect.width
    ) * 2 - 1;

    mouse.y = -(
        (event.clientY - rect.top) / rect.height
    ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersections = raycaster.intersectObjects(
        clickableObjects,
        true
    );

    if (intersections.length > 0) {

        const index =
            intersections[0].object.userData.lessonIndex;

        if (index !== undefined) {

            selectWorldStation(index);
            clickCallback(index);

        }

    }

}

// ==========================================
// CAMERA RESET
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

            if (object.geometry && object.geometry.type !== "Line") {

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

export function initAIWorld({ container: worldContainer, onSelect }) {

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

    selectWorldStation(0);

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
