
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// IT WORLD 3D - LABORATOIRE DU MATÉRIEL
// ==========================================

// ==========================================
// CONTENEUR
// ==========================================

const container = document.getElementById("hardware3d");

if (!container) {
    throw new Error("Conteneur 3D introuvable !");
}

// ==========================================
// SCÈNE
// ==========================================

const scene = new THREE.Scene();
scene.background = new THREE.Color("#0b0920");

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100
);

const initialCameraPosition = new THREE.Vector3(9, 7, 11);
camera.position.copy(initialCameraPosition);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

container.appendChild(renderer.domElement);

// ==========================================
// CONTRÔLES DE LA CAMÉRA
// ==========================================

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;
controls.minDistance = 3;
controls.maxDistance = 22;
controls.target.set(0, 0, 0);

// ==========================================
// ÉCLAIRAGE
// ==========================================

scene.add(new THREE.AmbientLight("#ffffff", 1.5));

const mainLight = new THREE.DirectionalLight("#ffffff", 3);
mainLight.position.set(6, 10, 8);
mainLight.castShadow = true;
scene.add(mainLight);

const purpleLight = new THREE.PointLight("#9865ff", 100, 30);
purpleLight.position.set(-5, 5, 4);
scene.add(purpleLight);

const blueLight = new THREE.PointLight("#36caff", 90, 30);
blueLight.position.set(5, 3, -5);
scene.add(blueLight);

// ==========================================
// SOL
// ==========================================

const floor = new THREE.Mesh(
    new THREE.CircleGeometry(12, 64),
    new THREE.MeshStandardMaterial({
        color: "#15112c",
        metalness: 0.3,
        roughness: 0.7
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(
    20,
    30,
    "#7045b5",
    "#30254e"
);

grid.position.y = -1.98;
scene.add(grid);

// ==========================================
// MATÉRIAUX
// ==========================================

const materials = {
    board: new THREE.MeshStandardMaterial({
        color: "#17634f",
        metalness: 0.35,
        roughness: 0.55
    }),

    metal: new THREE.MeshStandardMaterial({
        color: "#b9bdca",
        metalness: 0.8,
        roughness: 0.25
    }),

    black: new THREE.MeshStandardMaterial({
        color: "#25283b",
        metalness: 0.6,
        roughness: 0.35
    }),

    purple: new THREE.MeshStandardMaterial({
        color: "#8655ff",
        emissive: "#4220a0",
        emissiveIntensity: 0.25
    }),

    blue: new THREE.MeshStandardMaterial({
        color: "#29bfff",
        emissive: "#075b90",
        emissiveIntensity: 0.3
    }),

    gold: new THREE.MeshStandardMaterial({
        color: "#d9a441",
        metalness: 0.8,
        roughness: 0.25
    })
};

const rgbPurple = new THREE.MeshStandardMaterial({
    color: "#a45cff",
    emissive: "#8b35ff",
    emissiveIntensity: 2
});

const rgbBlue = new THREE.MeshStandardMaterial({
    color: "#32caff",
    emissive: "#168bff",
    emissiveIntensity: 2
});

const fanMaterial = new THREE.MeshStandardMaterial({
    color: "#171525",
    metalness: 0.7,
    roughness: 0.3
});

// ==========================================
// FONCTIONS DE CRÉATION
// ==========================================

const components = [];
const fanRotors = [];

function createComponent(id, position) {
    const group = new THREE.Group();

    group.position.set(...position);

    group.userData.componentId = id;
    group.userData.basePosition = new THREE.Vector3(...position);
    group.userData.targetPosition = new THREE.Vector3(...position);

    scene.add(group);
    components.push(group);

    return group;
}

function addBox(group, size, position, material) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(...size),
        material
    );

    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    group.add(mesh);

    return mesh;
}

function addCylinder(group, radius, height, position, material) {
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, height, 32),
        material
    );

    mesh.position.set(...position);
    mesh.castShadow = true;

    group.add(mesh);

    return mesh;
}

// ==========================================
// 1. CARTE MÈRE
// ==========================================

const motherboard = createComponent(
    "motherboard",
    [0, -0.5, 0]
);

addBox(
    motherboard,
    [6, 0.22, 4.8],
    [0, 0, 0],
    materials.board
);

// Circuits électroniques
for (let i = 0; i < 6; i++) {
    addBox(
        motherboard,
        [0.08, 0.035, 1.5],
        [-2.3 + i * 0.85, 0.13, 1.2],
        materials.gold
    );
}

// Puces électroniques
for (let i = 0; i < 4; i++) {
    addBox(
        motherboard,
        [0.35, 0.08, 0.35],
        [-2 + i * 1.2, 0.16, -1.5],
        materials.black
    );
}

// ==========================================
// 2. PROCESSEUR (CPU)
// ==========================================

const cpu = createComponent(
    "cpu",
    [-0.5, -0.1, -0.4]
);

addBox(
    cpu,
    [1.45, 0.32, 1.45],
    [0, 0, 0],
    materials.metal
);

addBox(
    cpu,
    [1.15, 0.12, 1.15],
    [0, 0.22, 0],
    materials.purple
);

addBox(
    cpu,
    [0.7, 0.06, 0.7],
    [0, 0.31, 0],
    materials.blue
);

// ==========================================
// 3. MÉMOIRE RAM
// ==========================================

const ram = createComponent(
    "ram",
    [1.65, -0.05, -0.5]
);

for (let i = 0; i < 2; i++) {
    addBox(
        ram,
        [0.3, 1.2, 0.4],
        [i * 0.5, 0.55, 0],
        i === 0 ? materials.purple : materials.blue
    );

    addBox(
        ram,
        [0.3, 0.12, 0.42],
        [i * 0.5, 1.17, 0],
        materials.gold
    );
}

// ==========================================
// 4. CARTE GRAPHIQUE (GPU)
// ==========================================

const gpu = createComponent(
    "gpu",
    [0, -0.05, 1.65]
);

addBox(
    gpu,
    [3.7, 0.5, 0.9],
    [0, 0.35, 0],
    materials.black
);

for (let i = 0; i < 2; i++) {
    addCylinder(
        gpu,
        0.38,
        0.16,
        [-0.95 + i * 1.9, 0.65, 0],
        materials.metal
    );

    addCylinder(
        gpu,
        0.12,
        0.18,
        [-0.95 + i * 1.9, 0.65, 0],
        materials.purple
    );
}

// ==========================================
// 5. DISQUE SSD
// ==========================================

const ssd = createComponent(
    "ssd",
    [-2.2, -0.15, -1.45]
);

addBox(
    ssd,
    [1.7, 0.18, 0.65],
    [0, 0, 0],
    materials.black
);

addBox(
    ssd,
    [0.65, 0.08, 0.4],
    [0, 0.13, 0],
    materials.blue
);

addBox(
    ssd,
    [0.25, 0.08, 0.4],
    [0.55, 0.13, 0],
    materials.gold
);

// ==========================================
// 6. ALIMENTATION ÉLECTRIQUE
// ==========================================

const power = createComponent(
    "power",
    [2.35, -0.1, 1.45]
);

addBox(
    power,
    [1.5, 1.1, 1.3],
    [0, 0, 0],
    materials.black
);

addCylinder(
    power,
    0.4,
    0.12,
    [0, 0.1, 0.68],
    materials.metal
);

// ==========================================
// 7. BOÎTIER DE L'ORDINATEUR
// ==========================================

const pcCase = createComponent(
    "case",
    [0, 0, 0]
);

const frameMaterial = new THREE.MeshStandardMaterial({
    color: "#9295a8",
    metalness: 0.7,
    roughness: 0.3,
    transparent: true,
    opacity: 0.22
});

// Quatre coins verticaux
for (const x of [-3.35, 3.35]) {
    for (const z of [-2.75, 2.75]) {
        addBox(
            pcCase,
            [0.12, 3.7, 0.12],
            [x, 0.5, z],
            frameMaterial
        );
    }
}

// Cadre supérieur et inférieur
for (const y of [-1.35, 2.35]) {
    addBox(
        pcCase,
        [6.7, 0.12, 0.12],
        [0, y, -2.75],
        frameMaterial
    );

    addBox(
        pcCase,
        [6.7, 0.12, 0.12],
        [0, y, 2.75],
        frameMaterial
    );

    addBox(
        pcCase,
        [0.12, 0.12, 5.5],
        [-3.35, y, 0],
        frameMaterial
    );

    addBox(
        pcCase,
        [0.12, 0.12, 5.5],
        [3.35, y, 0],
        frameMaterial
    );
}

// ==========================================
// VENTILATEURS RGB
// ==========================================

function createFan(x, y, z) {
    const fan = new THREE.Group();

    fan.position.set(x, y, z);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.48, 0.055, 12, 48),
        rgbPurple
    );

    fan.add(ring);

    // Trois pales rotatives
    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.68, 0.06),
            fanMaterial
        );

        const angle = i * (Math.PI * 2 / 3);

        blade.position.set(
            Math.sin(angle) * 0.17,
            Math.cos(angle) * 0.17,
            0
        );

        blade.rotation.z = -angle;
        fan.add(blade);
    }

    // Centre du ventilateur
    const center = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.12, 32),
        rgbBlue
    );

    center.rotation.x = Math.PI / 2;
    fan.add(center);

    pcCase.add(fan);
    fanRotors.push(fan);
}

// Trois ventilateurs RGB
createFan(-2.2, 1.35, 2.55);
createFan(0, 1.35, 2.55);
createFan(2.2, 1.35, 2.55);

// ==========================================
// ÉCLAIRAGE RGB
// ==========================================

addBox(
    pcCase,
    [0.045, 3, 0.045],
    [-3.1, 0.5, 2.45],
    rgbPurple
);

addBox(
    pcCase,
    [0.045, 3, 0.045],
    [3.1, 0.5, 2.45],
    rgbBlue
);

const rgbLight1 = new THREE.PointLight("#a45cff", 4, 8);
rgbLight1.position.set(-2, 1, 2);
pcCase.add(rgbLight1);

const rgbLight2 = new THREE.PointLight("#32caff", 4, 8);
rgbLight2.position.set(2, 1, 2);
pcCase.add(rgbLight2);

// ==========================================
// CÂBLES DE CONNEXION
// ==========================================

const cableGroup = new THREE.Group();
scene.add(cableGroup);

function createCable(points, color) {
    const curve = new THREE.CatmullRomCurve3(
        points.map(point => new THREE.Vector3(...point))
    );

    const geometry = new THREE.TubeGeometry(
        curve,
        40,
        0.045,
        8,
        false
    );

    const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
        metalness: 0.4,
        roughness: 0.3
    });

    const cable = new THREE.Mesh(geometry, material);

    cable.castShadow = true;
    cableGroup.add(cable);

    return cable;
}

// Carte mère vers alimentation
createCable([
    [1.8, -0.25, 0.8],
    [2.3, 0.2, 0.9],
    [2.6, 0.5, 1.1],
    [2.35, 0.2, 1.45]
], "#a45cff");

// Alimentation vers carte graphique
createCable([
    [2.35, 0.2, 1.45],
    [1.5, 0.4, 1.8],
    [0.8, 0.45, 1.65],
    [0, 0.3, 1.65]
], "#32caff");

// Carte mère vers SSD
createCable([
    [-1.5, -0.2, -1],
    [-2, 0.1, -1.4],
    [-2.2, 0.2, -1.45]
], "#a45cff");

// ==========================================
// ÉTOILES
// ==========================================

const starPositions = [];

for (let i = 0; i < 400; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 45,
        Math.random() * 20,
        (Math.random() - 0.5) * 45
    );
}

const starGeometry = new THREE.BufferGeometry();

starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
        color: "#a58aff",
        size: 0.06
    })
);

scene.add(stars);

// ==========================================
// INFORMATIONS DES COMPOSANTS
// ==========================================

const data = {
    motherboard: {
        icon: "🟩",
        number: 1,
        name: "Carte mère",
        definition: "La carte mère est la carte électronique principale de l'ordinateur. Elle relie les différents composants.",
        role: "Elle permet au processeur, à la mémoire RAM, au stockage et aux autres composants de communiquer.",
        fact: "💡 Sans carte mère, les composants ne peuvent pas fonctionner ensemble."
    },

    cpu: {
        icon: "🧠",
        number: 2,
        name: "Processeur (CPU)",
        definition: "Le processeur est souvent considéré comme le cerveau de l'ordinateur.",
        role: "Il exécute les instructions et effectue les calculs nécessaires au fonctionnement des programmes.",
        fact: "💡 CPU signifie Central Processing Unit."
    },

    ram: {
        icon: "📊",
        number: 3,
        name: "Mémoire vive (RAM)",
        definition: "La RAM est une mémoire temporaire utilisée pendant le fonctionnement de l'ordinateur.",
        role: "Elle conserve temporairement les données des applications ouvertes pour y accéder rapidement.",
        fact: "💡 Les données de la RAM disparaissent généralement lorsque l'ordinateur s'éteint."
    },

    gpu: {
        icon: "🎮",
        number: 4,
        name: "Carte graphique (GPU)",
        definition: "Le GPU est un processeur spécialisé dans le traitement graphique.",
        role: "Il permet d'afficher les images, les vidéos, les animations et les jeux.",
        fact: "💡 GPU signifie Graphics Processing Unit."
    },

    ssd: {
        icon: "💾",
        number: 5,
        name: "Disque SSD",
        definition: "Le SSD est un support de stockage qui conserve les fichiers et les programmes.",
        role: "Il sauvegarde les documents, les photos, les vidéos et le système d'exploitation.",
        fact: "💡 Contrairement à la RAM, le SSD conserve les données même sans alimentation."
    },

    power: {
        icon: "⚡",
        number: 6,
        name: "Alimentation électrique",
        definition: "L'alimentation fournit l'énergie nécessaire au fonctionnement des composants.",
        role: "Elle transforme et distribue l'électricité aux différentes pièces de l'ordinateur.",
        fact: "💡 Une alimentation adaptée est essentielle pour protéger les composants."
    },

    case: {
        icon: "🖥️",
        number: 7,
        name: "Boîtier",
        definition: "Le boîtier est la structure qui accueille et protège les composants de l'ordinateur.",
        role: "Il organise les composants, facilite la circulation de l'air et protège le matériel.",
        fact: "💡 Les boîtiers existent sous différentes formes et tailles."
    }
};

const order = [
    "motherboard",
    "cpu",
    "ram",
    "gpu",
    "ssd",
    "power",
    "case"
];

// ==========================================
// VUE ÉCLATÉE
// ==========================================

let exploded = false;
let caseVisible = true;

const explodedOffsets = {
    motherboard: [0, 0, 0],
    cpu: [0, 2.2, 0],
    ram: [2.3, 1.5, 0],
    gpu: [0, 0, 2.8],
    ssd: [-2.5, 1.2, -1.5],
    power: [3, 1.5, 1.5],
    case: [0, 0, 0]
};

function setExplodedView(value) {
    exploded = value;

    cableGroup.visible = !value;

    components.forEach(group => {
        const id = group.userData.componentId;
        const base = group.userData.basePosition;
        const offset = value ? explodedOffsets[id] : [0, 0, 0];

        group.userData.targetPosition.set(
            base.x + offset[0],
            base.y + offset[1],
            base.z + offset[2]
        );
    });

    const explodeBtn = el("explodeBtn");
    const assembleBtn = el("assembleBtn");

    if (explodeBtn) {
        explodeBtn.classList.toggle("active", value);
    }

    if (assembleBtn) {
        assembleBtn.classList.toggle("active", !value);
    }
}

// ==========================================
// AFFICHER / MASQUER LE BOÎTIER
// ==========================================

function toggleCase() {
    caseVisible = !caseVisible;

    pcCase.visible = caseVisible;

    const button = el("caseBtn");

    if (button) {
        button.textContent = caseVisible
            ? "▣ Masquer le boîtier"
            : "▣ Afficher le boîtier";
    }
}

// ==========================================
// INTERFACE
// ==========================================

const el = id => document.getElementById(id);

let currentIndex = -1;

// ==========================================
// ÉVÉNEMENTS DES BOUTONS
// ==========================================

el("explodeBtn")?.addEventListener("click", () => {
    setExplodedView(true);
});

el("assembleBtn")?.addEventListener("click", () => {
    setExplodedView(false);
});

el("caseBtn")?.addEventListener("click", toggleCase);

// Positions initiales
components.forEach(group => {
    group.userData.targetPosition =
        group.userData.basePosition.clone();
});

// ==========================================
// SÉLECTIONNER UN COMPOSANT
// ==========================================

function selectComponent(id) {
    const index = order.indexOf(id);

    if (index === -1) return;

    currentIndex = index;

    const component = data[id];

    el("componentIcon").textContent = component.icon;

    el("componentTag").textContent =
        "COMPOSANT " + component.number;

    el("componentNumber").textContent =
        String(component.number).padStart(2, "0") + " / 07";

    el("componentName").textContent = component.name;
    el("definition").textContent = component.definition;
    el("roleDescription").textContent = component.role;
    el("fact").textContent = component.fact;

    document.querySelectorAll(".component-card").forEach(card => {
        card.classList.toggle(
            "active",
            card.dataset.id === id
        );
    });

    // Mise en évidence du composant sélectionné
    components.forEach(group => {
        group.traverse(child => {
            if (!child.isMesh) return;

            const material = child.material;

            if (material.emissive) {
                material.emissiveIntensity =
                    group.userData.componentId === id ? 1 : 0.25;
            }
        });
    });
}

// ==========================================
// CENTRER LA CAMÉRA
// ==========================================

function focusComponent(id) {
    const group = components.find(
        item => item.userData.componentId === id
    );

    if (!group) return;

    controls.target.copy(group.position);

    camera.position.set(
        group.position.x + 4,
        group.position.y + 3,
        group.position.z + 5
    );

    controls.update();
}

// ==========================================
// LISTE DES COMPOSANTS
// ==========================================

function renderList() {
    const list = el("componentsList");

    list.innerHTML = "";

    order.forEach(id => {
        const info = data[id];

        const button = document.createElement("button");
        button.className = "component-card";
        button.dataset.id = id;

        const icon = document.createElement("span");
        icon.textContent = info.icon;

        const title = document.createElement("strong");
        title.textContent = info.name;

        const small = document.createElement("small");
        small.textContent = "Cliquer pour découvrir";

        button.append(icon, title, small);

        button.addEventListener("click", () => {
            selectComponent(id);
            focusComponent(id);
        });

        list.appendChild(button);
    });
}

// ==========================================
// NAVIGATION PRÉCÉDENT / SUIVANT
// ==========================================

el("previousBtn").addEventListener("click", () => {
    const index = currentIndex <= 0 ? 0 : currentIndex - 1;

    selectComponent(order[index]);
    focusComponent(order[index]);
});

el("nextBtn").addEventListener("click", () => {
    const index = currentIndex < 0
        ? 0
        : (currentIndex + 1) % order.length;

    selectComponent(order[index]);
    focusComponent(order[index]);
});

// ==========================================
// CLICS SUR LE MODÈLE 3D
// ==========================================

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener("click", event => {
    const rect = renderer.domElement.getBoundingClientRect();

    pointer.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

    pointer.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(components, true);

    if (hits.length > 0) {
        let selected = hits[0].object;

        while (selected && !selected.userData.componentId) {
            selected = selected.parent;
        }

        if (selected) {
            selectComponent(selected.userData.componentId);
        }
    }
});

// ==========================================
// RÉINITIALISER LA CAMÉRA
// ==========================================

el("resetCamera").addEventListener("click", () => {
    camera.position.copy(initialCameraPosition);
    controls.target.set(0, 0, 0);
    controls.update();
});

// ==========================================
// AFFICHAGE RESPONSIVE
// ==========================================

window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

// ==========================================
// ANIMATION
// ==========================================

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Déplacement fluide des composants
    components.forEach(group => {
        if (group.userData.componentId === "case") {
            return;
        }

        const target = group.userData.targetPosition;

        group.position.x +=
            (target.x - group.position.x) * 0.055;

        group.position.y +=
            (target.y - group.position.y) * 0.055;

        group.position.z +=
            (target.z - group.position.z) * 0.055;
    });

    // Rotation des ventilateurs RGB
    fanRotors.forEach((fan, index) => {
        fan.rotation.z += 0.08 + index * 0.01;
    });

    // Animation des lumières RGB
    rgbLight1.intensity = 3.5 + Math.sin(time * 2) * 1.5;
    rgbLight2.intensity = 3.5 + Math.cos(time * 2) * 1.5;

    // Rotation des étoiles
    stars.rotation.y += 0.0003;

    controls.update();
    renderer.render(scene, camera);
}

// ==========================================
// INITIALISATION DE L'INTERFACE
// ==========================================

function initializeInterface() {
    document.documentElement.lang = "fr";
    document.body.dir = "ltr";

    // Masquer le bouton de langue s'il existe
    const languageBtn = el("languageBtn");

    if (languageBtn) {
        languageBtn.hidden = true;
    }

    el("eyebrow").textContent = "MONDE 01 / INFORMATIQUE";

    el("mainTitle").innerHTML =
        'Découvrez le <span>matériel informatique</span>';

    el("subtitle").textContent =
        "Explorez les composants internes d'un ordinateur en 3D.";

    el("roleTitle").textContent = "QUEL EST SON RÔLE ?";

    el("listTitle").textContent = "Découvrez les composants";

    el("listSubtitle").textContent =
        "Sélectionnez un composant pour en savoir plus.";

    el("previousBtn").textContent = "← Précédent";

    el("nextBtn").textContent = "Suivant →";

    el("componentTag").textContent = "BIENVENUE";

    el("componentName").textContent = "Matériel informatique";

    el("definition").textContent =
        "Sélectionnez un composant dans le modèle 3D pour découvrir son fonctionnement.";

    el("roleDescription").textContent =
        "Un ordinateur est composé de plusieurs éléments qui fonctionnent ensemble.";

    el("fact").textContent =
        "💡 Commencez par sélectionner la carte mère.";

    const caseBtn = el("caseBtn");

    if (caseBtn) {
        caseBtn.textContent = "▣ Masquer le boîtier";
    }

    const explodeBtn = el("explodeBtn");

    if (explodeBtn) {
        explodeBtn.textContent = "✦ Vue éclatée";
    }

    const assembleBtn = el("assembleBtn");

    if (assembleBtn) {
        assembleBtn.textContent = "↻ Assembler";
    }

    const resetBtn = el("resetCamera");

    if (resetBtn) {
        resetBtn.textContent = "↻ Réinitialiser la vue";
    }

    renderList();
}

// ==========================================
// DÉMARRAGE
// ==========================================

initializeInterface();
animate();

