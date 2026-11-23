
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// IT WORLD 3D - ACADÉMIE PYTHON
// ==========================================

// ==========================================
// CONTENU DES LEÇONS
// ==========================================

export const lessons = [
    {
        title: "Introduction à Python",
        category: "Les bases",
        icon: "🐍",
        description: "Découvrez le langage Python et ses premières instructions.",
        explanation:
            "Python est un langage de programmation simple et puissant. Il permet de créer des applications, des sites web, des jeux et des programmes d'intelligence artificielle. La fonction print() permet d'afficher un message à l'écran.",
        code:
`print("Bonjour tout le monde !")
print("Bienvenue dans Python")`,
        output:
`Bonjour tout le monde !
Bienvenue dans Python`,
        tip: "La fonction print() affiche un texte ou une valeur dans la console.",
        question: "Quelle fonction permet d'afficher un message en Python ?",
        options: ["show()", "print()", "writeText()"],
        answer: 1,
        feedback: "Bravo ! La fonction print() permet d'afficher un message."
    },

    {
        title: "Les variables",
        category: "Stocker des informations",
        icon: "📦",
        description: "Apprenez à enregistrer des informations dans des variables.",
        explanation:
            "Une variable est un espace mémoire qui permet de stocker une information. Chaque variable possède un nom et une valeur. En Python, il suffit d'utiliser le signe = pour donner une valeur à une variable.",
        code:
`nom = "Amine"
age = 20
ville = "Tunis"

print(nom)
print(age)
print(ville)`,
        output:
`Amine
20
Tunis`,
        tip: "Une variable peut contenir du texte, un nombre ou d'autres types de données.",
        question: "Quel symbole permet d'affecter une valeur à une variable ?",
        options: ["==", "=", "+"],
        answer: 1,
        feedback: "Exact ! Le signe = permet d'affecter une valeur à une variable."
    },

    {
        title: "Les conditions",
        category: "Prendre des décisions",
        icon: "🔀",
        description: "Utilisez les conditions pour choisir une action.",
        explanation:
            "Les conditions permettent à un programme de prendre des décisions. L'instruction if vérifie une condition. Si elle est vraie, le programme exécute le bloc correspondant. Sinon, il peut utiliser else.",
        code:
`age = 18

if age >= 18:
    print("Vous êtes majeur")
else:
    print("Vous êtes mineur")`,
        output:
`Vous êtes majeur`,
        tip: "En Python, les espaces au début des lignes sont importants pour organiser les blocs de code.",
        question: "Quelle instruction permet de tester une condition ?",
        options: ["if", "repeat", "print"],
        answer: 0,
        feedback: "Très bien ! L'instruction if permet de tester une condition."
    },

    {
        title: "Les boucles",
        category: "Répéter des actions",
        icon: "🔁",
        description: "Répétez une instruction plusieurs fois.",
        explanation:
            "Une boucle permet de répéter une ou plusieurs instructions. La boucle for est souvent utilisée pour parcourir une série de valeurs. La fonction range(5) produit les nombres de 0 à 4.",
        code:
`for i in range(5):
    print("Bonjour", i)`,
        output:
`Bonjour 0
Bonjour 1
Bonjour 2
Bonjour 3
Bonjour 4`,
        tip: "La fonction range(5) génère cinq valeurs : 0, 1, 2, 3 et 4.",
        question: "Quelle boucle est utilisée dans cet exemple pour répéter une action ?",
        options: ["if", "for", "def"],
        answer: 1,
        feedback: "Correct ! La boucle for permet de répéter une action."
    },

    {
        title: "Les fonctions",
        category: "Réutiliser du code",
        icon: "⚙️",
        description: "Créez des fonctions pour organiser votre programme.",
        explanation:
            "Une fonction est un bloc de code qui réalise une tâche précise. En Python, le mot-clé def permet de créer une fonction. On peut ensuite l'appeler plusieurs fois dans le programme.",
        code:
`def saluer(nom):
    print("Bonjour", nom)

saluer("Sara")
saluer("Ali")`,
        output:
`Bonjour Sara
Bonjour Ali`,
        tip: "Une fonction peut recevoir des paramètres pour travailler avec différentes valeurs.",
        question: "Quel mot-clé permet de créer une fonction en Python ?",
        options: ["function", "create", "def"],
        answer: 2,
        feedback: "Excellent ! Le mot-clé def permet de définir une fonction."
    }
];

// ==========================================
// VARIABLES DU MONDE 3D
// ==========================================

let scene;
let camera;
let renderer;
let controls;
let raycaster;
let pointer;
let animationFrame;
let stations = [];
let selectableObjects = [];
let activeStation = 0;
let onSelectCallback = null;
let worldContainer = null;

// ==========================================
// MATÉRIAUX
// ==========================================

const colors = {
    background: 0x0b0920,
    purple: 0x8b5cf6,
    blue: 0x38bdf8,
    pink: 0xec4899,
    green: 0x34d399,
    yellow: 0xfbbf24,
    white: 0xffffff,
    dark: 0x17132d
};

// ==========================================
// CRÉER UN TEXTE 3D
// ==========================================

function createLabel(text, color = "#ffffff") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const context = canvas.getContext("2d");

    context.fillStyle = "rgba(18, 14, 40, 0.88)";
    context.roundRect(8, 8, 496, 112, 24);
    context.fill();

    context.strokeStyle = color;
    context.lineWidth = 4;
    context.roundRect(8, 8, 496, 112, 24);
    context.stroke();

    context.fillStyle = color;
    context.font = "bold 42px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 65);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(3.2, 0.8, 1);

    return sprite;
}

// ==========================================
// CRÉER UNE STATION
// ==========================================

function createStation(index, position, color) {
    const group = new THREE.Group();

    group.position.set(...position);
    group.userData.lessonIndex = index;

    const baseMaterial = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.3,
        emissive: color,
        emissiveIntensity: 0.35
    });

    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.15, 1.3, 0.35, 48),
        baseMaterial
    );

    base.position.y = 0;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.12, 0.055, 12, 64),
        new THREE.MeshBasicMaterial({ color })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.2;
    group.add(ring);

    const sphere = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55, 1),
        new THREE.MeshStandardMaterial({
            color,
            metalness: 0.4,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.6
        })
    );

    sphere.position.y = 1.05;
    sphere.castShadow = true;
    group.add(sphere);

    const label = createLabel(
        `${index + 1}. ${lessons[index].title}`,
        `#${new THREE.Color(color).getHexString()}`
    );

    label.position.y = 2.1;
    group.add(label);

    const hitArea = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.5, 3, 32),
        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false
        })
    );

    hitArea.position.y = 1;
    hitArea.userData.lessonIndex = index;
    group.add(hitArea);

    selectableObjects.push(hitArea);

    scene.add(group);
    stations.push(group);

    return group;
}

// ==========================================
// SOL ET DÉCOR
// ==========================================

function createEnvironment() {
    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(18, 64),
        new THREE.MeshStandardMaterial({
            color: 0x15112c,
            metalness: 0.25,
            roughness: 0.75
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.3;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(
        30,
        40,
        0x7045b5,
        0x30254e
    );

    grid.position.y = -0.28;
    scene.add(grid);

    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 80, 25);
    purpleLight.position.set(-5, 4, 2);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 70, 25);
    blueLight.position.set(5, 4, -5);
    scene.add(blueLight);

    const starPositions = [];

    for (let i = 0; i < 350; i++) {
        starPositions.push(
            (Math.random() - 0.5) * 40,
            Math.random() * 12 + 1,
            (Math.random() - 0.5) * 40
        );
    }

    const starGeometry = new THREE.BufferGeometry();

    starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const starField = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
            color: 0xa58aff,
            size: 0.055
        })
    );

    scene.add(starField);
}

// ==========================================
// CRÉER LE PARCOURS
// ==========================================

function createLearningPath() {
    const positions = [
        [-6, 0, 0],
        [-3, 0, -3],
        [0, 0, 0],
        [3, 0, -3],
        [6, 0, 0]
    ];

    const stationColors = [
        colors.purple,
        colors.blue,
        colors.pink,
        colors.green,
        colors.yellow
    ];

    positions.forEach((position, index) => {
        createStation(
            index,
            position,
            stationColors[index]
        );
    });

    // Ligne lumineuse entre les stations
    const points = positions.map(position =>
        new THREE.Vector3(position[0], 0.05, position[2])
    );

    const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const path = new THREE.Line(
        pathGeometry,
        new THREE.LineBasicMaterial({
            color: 0x7045b5,
            transparent: true,
            opacity: 0.65
        })
    );

    scene.add(path);
}

// ==========================================
// SÉLECTION D'UNE STATION
// ==========================================

export function selectWorldStation(index) {
    if (!Number.isInteger(index)) return;
    if (index < 0 || index >= lessons.length) return;

    activeStation = index;

    stations.forEach((station, i) => {
        const sphere = station.children.find(
            child => child.geometry?.type === "IcosahedronGeometry"
        );

        if (sphere) {
            sphere.scale.setScalar(i === index ? 1.25 : 1);
        }
    });

    if (onSelectCallback) {
        onSelectCallback(index);
    }
}

// ==========================================
// CLIC SUR LE MONDE 3D
// ==========================================

function handlePointerClick(event) {
    if (!renderer || !camera) return;

    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

    pointer.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(
        selectableObjects,
        false
    );

    if (intersections.length > 0) {
        const index = intersections[0].object.userData.lessonIndex;
        selectWorldStation(index);
    }
}

// ==========================================
// INITIALISER LE MONDE PYTHON
// ==========================================

export function initPythonWorld({ container, onSelect }) {
    if (!container) {
        throw new Error("Conteneur Python 3D introuvable !");
    }

    // Éviter de créer plusieurs scènes dans le même conteneur
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
    }

    worldContainer = container;
    onSelectCallback = onSelect;

    stations = [];
    selectableObjects = [];

    scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);

    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / Math.max(container.clientHeight, 1),
        0.1,
        100
    );

    camera.position.set(0, 8, 14);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 6;
    controls.maxDistance = 25;
    controls.target.set(0, 0.5, 0);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    createEnvironment();
    createLearningPath();

    renderer.domElement.addEventListener(
        "click",
        handlePointerClick
    );

    const resizeObserver = new ResizeObserver(() => {
        if (!worldContainer || !renderer) return;

        const width = worldContainer.clientWidth;
        const height = worldContainer.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    const clock = new THREE.Clock();

    function animate() {
        animationFrame = requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        stations.forEach((station, index) => {
            const sphere = station.children.find(
                child => child.geometry?.type === "IcosahedronGeometry"
            );

            if (sphere) {
                sphere.position.y =
                    1.05 + Math.sin(time * 2 + index) * 0.12;

                sphere.rotation.y += 0.012;
                sphere.rotation.x += 0.005;
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    return {
        select: selectWorldStation,
        resetCamera() {
            camera.position.set(0, 8, 14);
            controls.target.set(0, 0.5, 0);
            controls.update();
        }
    };
}

