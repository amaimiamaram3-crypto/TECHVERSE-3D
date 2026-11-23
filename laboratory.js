
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// =====================================
// CONFIGURATION
// =====================================

const container = document.getElementById("laboratory3d");

if (!container) {
    throw new Error("Conteneur laboratory3d introuvable !");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#100c1c");

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(7, 5.5, 9);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// =====================================
// CAMERA CONTROLS
// =====================================

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1.8, 0);
controls.minDistance = 5;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2;

// =====================================
// LIGHTS
// =====================================

scene.add(new THREE.AmbientLight("#ffffff", 1.8));

const mainLight = new THREE.DirectionalLight("#ffffff", 3);
mainLight.position.set(5, 9, 7);
mainLight.castShadow = true;
scene.add(mainLight);

const purpleLight = new THREE.PointLight("#a77bff", 35, 12);
purpleLight.position.set(-4, 3, 3);
scene.add(purpleLight);

const blueLight = new THREE.PointLight("#54c8ff", 25, 12);
blueLight.position.set(4, 3, -3);
scene.add(blueLight);

// =====================================
// MATERIALS
// =====================================

const black = new THREE.MeshStandardMaterial({
    color: "#171923",
    metalness: 0.65,
    roughness: 0.3
});

const boardMaterial = new THREE.MeshStandardMaterial({
    color: "#174b3c",
    metalness: 0.35,
    roughness: 0.6
});

const silver = new THREE.MeshStandardMaterial({
    color: "#aab3c2",
    metalness: 0.8,
    roughness: 0.25
});

const purple = new THREE.MeshStandardMaterial({
    color: "#9c5cff",
    emissive: "#5420a0",
    emissiveIntensity: 1.5
});

const blue = new THREE.MeshStandardMaterial({
    color: "#42caff",
    emissive: "#0875b5",
    emissiveIntensity: 1.3
});

const parts = [];

// =====================================
// HELPERS
// =====================================

function addBox(parent, name, size, position, material) {
    const geometry = new THREE.BoxGeometry(...size);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    mesh.userData.partName = name;
    parent.add(mesh);

    if (name) parts.push(mesh);

    return mesh;
}

function addCylinder(parent, name, radius, height, position, material) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(...position);
    mesh.castShadow = true;

    mesh.userData.partName = name;
    parent.add(mesh);

    if (name) parts.push(mesh);

    return mesh;
}

// =====================================
// FLOOR
// =====================================

const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 0.2, 64),
    new THREE.MeshStandardMaterial({
        color: "#211832",
        metalness: 0.4,
        roughness: 0.5
    })
);

floor.position.y = -0.15;
floor.receiveShadow = true;
scene.add(floor);

const floorRing = new THREE.Mesh(
    new THREE.TorusGeometry(5, 0.025, 12, 100),
    purple
);

floorRing.rotation.x = Math.PI / 2;
floorRing.position.y = -0.035;
scene.add(floorRing);

// =====================================
// COMPUTER CASE
// =====================================

const computer = new THREE.Group();
scene.add(computer);

// Base
addBox(computer, null, [5.2, 0.18, 3.7], [0, 0.15, 0], black);

// Back panel
addBox(computer, null, [5.2, 3.8, 0.15], [0, 2.05, -1.75], black);

// Side frame
addBox(computer, null, [0.15, 3.8, 0.15], [-2.55, 2.05, 0], silver);
addBox(computer, null, [0.15, 3.8, 0.15], [2.55, 2.05, 0], silver);
addBox(computer, null, [5.2, 0.15, 0.15], [0, 3.95, 0], silver);

// Front glass-like panel edges
const glassFrame = new THREE.MeshStandardMaterial({
    color: "#53627d",
    metalness: 0.8,
    roughness: 0.2
});

addBox(computer, null, [5.2, 0.07, 0.08], [0, 0.3, 1.8], glassFrame);

// =====================================
// MOTHERBOARD
// =====================================

addBox(
    computer,
    "Carte mère",
    [4.5, 3.2, 0.16],
    [0, 2.1, -1.45],
    boardMaterial
);

// Small electronic circuits
for (let i = 0; i < 12; i++) {
    const x = -2 + (i % 6) * 0.75;
    const y = 0.9 + Math.floor(i / 6) * 1.9;

    addBox(
        computer,
        null,
        [0.18, 0.12, 0.08],
        [x, y, -1.32],
        silver
    );
}

// =====================================
// CPU - PROCESSOR
// =====================================

const cpu = new THREE.Group();
cpu.position.set(-0.8, 2.8, -1.18);
computer.add(cpu);

addBox(cpu, "Processeur (CPU)", [1.05, 0.85, 0.22], [0, 0, 0], silver);

addBox(
    cpu,
    null,
    [0.72, 0.58, 0.08],
    [0, 0, 0.15],
    new THREE.MeshStandardMaterial({
        color: "#c7d2e5",
        metalness: 0.9,
        roughness: 0.2
    })
);

addBox(cpu, null, [1.2, 1, 0.08], [0, 0, -0.16], black);

// =====================================
// CPU COOLER FAN
// =====================================

const fan = new THREE.Group();
fan.position.set(-0.8, 2.8, -0.75);
computer.add(fan);

addCylinder(fan, null, 0.62, 0.2, [0, 0, 0], black).rotation.x = Math.PI / 2;

const fanHub = addCylinder(fan, null, 0.18, 0.24, [0, 0, 0.04], purple);
fanHub.rotation.x = Math.PI / 2;

const blades = new THREE.Group();
fan.add(blades);

for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;

    const blade = addBox(
        blades,
        null,
        [0.16, 0.48, 0.055],
        [Math.cos(angle) * 0.25, Math.sin(angle) * 0.25, 0.08],
        silver
    );

    blade.rotation.z = angle + 0.5;
}

// =====================================
// RAM MEMORY
// =====================================

for (let i = 0; i < 2; i++) {
    const ram = addBox(
        computer,
        "Mémoire vive (RAM)",
        [0.25, 1.35, 0.16],
        [0.45 + i * 0.4, 2.75, -1.05],
        black
    );

    addBox(
        computer,
        null,
        [0.18, 1.05, 0.06],
        [0.45 + i * 0.4, 2.75, -0.94],
        purple
    );
}

// =====================================
// GRAPHICS CARD - GPU
// =====================================

const gpu = new THREE.Group();
gpu.position.set(0.55, 1.35, -0.65);
computer.add(gpu);

addBox(
    gpu,
    "Carte graphique (GPU)",
    [2.65, 0.65, 0.65],
    [0, 0, 0],
    black
);

// GPU decorative strip
addBox(
    gpu,
    null,
    [2.35, 0.07, 0.68],
    [0, 0.29, 0],
    blue
);

// GPU fans
for (let i = 0; i < 2; i++) {
    const x = -0.65 + i * 1.3;

    const fanBase = addCylinder(
        gpu,
        null,
        0.25,
        0.12,
        [x, 0, 0.36],
        silver
    );

    fanBase.rotation.x = Math.PI / 2;

    const center = addCylinder(
        gpu,
        null,
        0.09,
        0.14,
        [x, 0, 0.44],
        purple
    );

    center.rotation.x = Math.PI / 2;
}

// =====================================
// SSD STORAGE
// =====================================

const ssd = addBox(
    computer,
    "Stockage SSD",
    [1.15, 0.38, 0.18],
    [-1.65, 1.15, -0.95],
    black
);

addBox(
    computer,
    null,
    [0.85, 0.12, 0.06],
    [-1.65, 1.15, -0.83],
    blue
);

// =====================================
// POWER SUPPLY
// =====================================

const power = new THREE.Group();
power.position.set(-1.65, 0.55, -0.75);
computer.add(power);

addBox(
    power,
    "Alimentation",
    [1.55, 0.65, 1.1],
    [0, 0, 0],
    black
);

const powerFan = addCylinder(
    power,
    null,
    0.23,
    0.08,
    [0, 0, 0.58],
    silver
);

powerFan.rotation.x = Math.PI / 2;

// =====================================
// CASE LIGHTS
// =====================================

const led = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, 0.035, 0.035),
    purple
);

led.position.set(0, 3.65, 1.65);
computer.add(led);

// =====================================
// CLICK INTERACTION
// =====================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const componentInfo = {
    "Carte mère": {
        icon: "🟩",
        description: "La carte mère est le circuit principal de l'ordinateur. Elle relie tous les composants et permet leur communication.",
        fact: "Sans carte mère, les composants ne peuvent pas travailler ensemble."
    },

    "Processeur (CPU)": {
        icon: "🧠",
        description: "Le processeur est le cerveau de l'ordinateur. Il exécute les instructions et effectue les calculs nécessaires au fonctionnement des programmes.",
        fact: "La vitesse du processeur se mesure généralement en GHz."
    },

    "Mémoire vive (RAM)": {
        icon: "⚡",
        description: "La mémoire RAM conserve temporairement les données utilisées par les programmes en cours d'exécution.",
        fact: "Les données de la RAM disparaissent lorsque l'ordinateur est éteint."
    },

    "Carte graphique (GPU)": {
        icon: "🎮",
        description: "La carte graphique traite les images, les vidéos et les éléments visuels affichés à l'écran.",
        fact: "Le GPU est particulièrement important pour les jeux 3D et les applications graphiques."
    },

    "Stockage SSD": {
        icon: "💾",
        description: "Le SSD conserve les fichiers, les logiciels et le système d'exploitation même lorsque l'ordinateur est éteint.",
        fact: "Un SSD est généralement beaucoup plus rapide qu'un disque dur mécanique classique."
    },

    "Alimentation": {
        icon: "🔋",
        description: "L'alimentation transforme le courant électrique et distribue l'énergie nécessaire aux composants de l'ordinateur.",
        fact: "Une alimentation adaptée protège les composants et assure leur fonctionnement stable."
    }
};

function selectComponent(name) {
    const info = componentInfo[name];
    if (!info) return;

    document.getElementById("componentIcon").textContent = info.icon;
    document.getElementById("componentName").textContent = name;
    document.getElementById("componentDescription").textContent = info.description;
    document.getElementById("componentFact").textContent = info.fact;

    // Highlight selected component
    parts.forEach(part => {
        if (part.userData.partName === name) {
            part.material.emissive = new THREE.Color("#5420a0");
            part.material.emissiveIntensity = 0.65;
        } else {
            part.material.emissive = new THREE.Color("#000000");
            part.material.emissiveIntensity = 0;
        }
    });
}

renderer.domElement.addEventListener("click", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(computer.children, true);

    for (const hit of hits) {
        let object = hit.object;

        while (object && !object.userData.partName) {
            object = object.parent;
        }

        if (object && object.userData.partName) {
            selectComponent(object.userData.partName);
            return;
        }
    }
});
// =====================================
// EXPLODED VIEW - VUE ÉCLATÉE
// =====================================

const explodeButton = document.getElementById("explodeBtn");

let exploded = false;
const explodedParts = [];
const selectedRoots = new Set();

// نحدّد المكوّنات الرئيسية فقط
parts.forEach(part => {
    let root = part;

    while (root.parent && root.parent !== computer) {
        root = root.parent;
    }

    if (root.parent === computer && !selectedRoots.has(root)) {
        selectedRoots.add(root);

        const index = explodedParts.length;
        const angle = (index / 6) * Math.PI * 2;

        const direction = new THREE.Vector3(
            Math.cos(angle),
            index % 2 === 0 ? 0.8 : -0.5,
            Math.sin(angle)
        ).normalize();

        explodedParts.push({
            object: root,
            original: root.position.clone(),
            target: root.position.clone().add(direction.multiplyScalar(1.4))
        });
    }
});

explodeButton.addEventListener("click", () => {
    exploded = !exploded;

    explodeButton.classList.toggle("active", exploded);

    explodeButton.textContent = exploded
        ? "Réassembler"
        : "Vue éclatée";
});
// =====================================
// RESET CAMERA
// =====================================

document.getElementById("resetCamera").addEventListener("click", () => {
    camera.position.set(7, 5.5, 9);
    controls.target.set(0, 1.8, 0);
    controls.update();
});

// =====================================
// RESIZE
// =====================================

const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

resizeObserver.observe(container);

// =====================================
// ANIMATION
// =====================================

function animate() {
    requestAnimationFrame(animate);

    blades.rotation.z += 0.025;

    // Animation de la vue éclatée
    explodedParts.forEach(part => {
        const destination = exploded
            ? part.target
            : part.original;

        part.object.position.lerp(destination, 0.06);
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

// =====================================
// QUIZ HARDWARE
// =====================================

const quizQuestions = [
    {
        question: "Quel est le cerveau de l'ordinateur ?",
        answers: ["La RAM", "Le processeur (CPU)", "Le SSD", "La carte mère"],
        correct: 1,
        explanation: "Le processeur exécute les instructions et effectue les calculs."
    },
    {
        question: "Quel composant stocke temporairement les données ?",
        answers: ["La RAM", "Le SSD", "L'alimentation", "Le GPU"],
        correct: 0,
        explanation: "La RAM conserve temporairement les données utilisées par les programmes."
    },
    {
        question: "Quel composant relie les différents éléments ?",
        answers: ["Le ventilateur", "Le SSD", "La carte mère", "Le processeur"],
        correct: 2,
        explanation: "La carte mère permet aux composants de communiquer entre eux."
    },
    {
        question: "Quel composant traite les images et les graphiques ?",
        answers: ["Le GPU", "La RAM", "Le SSD", "L'alimentation"],
        correct: 0,
        explanation: "Le GPU est spécialisé dans le traitement graphique."
    },
    {
        question: "Quel composant conserve les fichiers même après l'arrêt ?",
        answers: ["La RAM", "Le ventilateur", "Le CPU", "Le SSD"],
        correct: 3,
        explanation: "Le SSD conserve les fichiers même lorsque l'ordinateur est éteint."
    },
    {
        question: "Quel composant fournit l'énergie électrique ?",
        answers: ["La carte mère", "L'alimentation", "Le GPU", "La RAM"],
        correct: 1,
        explanation: "L'alimentation distribue l'énergie électrique aux composants."
    }
];

let currentQuestion = 0;
let quizPoints = 0;
let answered = false;

const quizCounter = document.getElementById("quizCounter");
const quizScore = document.getElementById("quizScore");
const quizProgressBar = document.getElementById("quizProgressBar");
const quizQuestion = document.getElementById("quizQuestion");
const quizAnswers = document.getElementById("quizAnswers");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuizBtn = document.getElementById("nextQuizBtn");
const quizResult = document.getElementById("quizResult");
const quizFinalScore = document.getElementById("quizFinalScore");
const restartQuizBtn = document.getElementById("restartQuizBtn");

function displayQuizQuestion() {
    const question = quizQuestions[currentQuestion];

    answered = false;

    quizCounter.textContent =
        `Question ${currentQuestion + 1} / ${quizQuestions.length}`;

    quizScore.textContent = `Score : ${quizPoints}`;

    quizProgressBar.style.width =
        `${(currentQuestion / quizQuestions.length) * 100}%`;

    quizQuestion.textContent = question.question;
    quizAnswers.innerHTML = "";
    quizFeedback.textContent = "";
    nextQuizBtn.disabled = true;

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");

        button.className = "quiz-answer";
        button.textContent = answer;

        button.addEventListener("click", () => {
            checkQuizAnswer(index);
        });

        quizAnswers.appendChild(button);
    });
}

function checkQuizAnswer(selectedIndex) {
    if (answered) return;

    answered = true;

    const question = quizQuestions[currentQuestion];
    const buttons = quizAnswers.querySelectorAll("button");

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === question.correct) {
            button.classList.add("correct");
        }

        if (index === selectedIndex && index !== question.correct) {
            button.classList.add("wrong");
        }
    });

    if (selectedIndex === question.correct) {
        quizPoints += 10;

        quizFeedback.textContent =
            "✓ Bonne réponse ! " + question.explanation;

        quizFeedback.style.color = "#36cf89";
    } else {
        quizFeedback.textContent =
            "✗ Mauvaise réponse. " + question.explanation;

        quizFeedback.style.color = "#ff8290";
    }

    quizScore.textContent = `Score : ${quizPoints}`;
    nextQuizBtn.disabled = false;
}

function finishQuiz() {
    const profile = JSON.parse(
    localStorage.getItem("itworldProfile")
) || {
    name: "Apprenant",
    totalPoints: 0,
    bestScore: 0,
    quizCompleted: 0
};

profile.totalPoints += quizPoints;
profile.bestScore = Math.max(profile.bestScore, quizPoints);
profile.quizCompleted++;

localStorage.setItem(
    "itworldProfile",
    JSON.stringify(profile)
);
    document.querySelector(".quiz-progress").hidden = true;
    document.querySelector(".quiz-progress-track").hidden = true;
    quizQuestion.hidden = true;
    quizAnswers.hidden = true;
    quizFeedback.hidden = true;
    nextQuizBtn.hidden = true;

    quizProgressBar.style.width = "100%";

    quizResult.hidden = false;

    quizFinalScore.textContent =
        `Votre résultat : ${quizPoints} / 60 points.`;

    if (quizPoints === 60) {
        quizFinalScore.textContent += " Excellent travail !";
    } else if (quizPoints >= 30) {
        quizFinalScore.textContent += " Bon travail ! Continuez ainsi.";
    } else {
        quizFinalScore.textContent += " Continuez à apprendre et réessayez !";
    }
}

nextQuizBtn.addEventListener("click", () => {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion >= quizQuestions.length) {
        finishQuiz();
    } else {
        displayQuizQuestion();
    }
});

restartQuizBtn.addEventListener("click", () => {
    currentQuestion = 0;
    quizPoints = 0;

    document.querySelector(".quiz-progress").hidden = false;
    document.querySelector(".quiz-progress-track").hidden = false;
    quizQuestion.hidden = false;
    quizAnswers.hidden = false;
    quizFeedback.hidden = false;
    nextQuizBtn.hidden = false;

    quizResult.hidden = true;

    displayQuizQuestion();
});

// Démarrer le quiz
displayQuizQuestion();

console.log("Quiz Hardware prêt !");


console.log("Laboratoire 3D prêt !");
