
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ========================================
// LEÇONS
// ========================================

export const lessons = [
    {
        title: "Le réseau informatique",
        category: "LEÇON 01 · LES BASES",
        icon: "🌐",
        description: "Un réseau informatique permet à plusieurs appareils de communiquer et de partager des informations.",
        explanation: "Un réseau informatique est un ensemble d'appareils connectés entre eux. Ces appareils peuvent être des ordinateurs, des téléphones, des imprimantes ou des serveurs. La connexion peut être filaire ou sans fil.",
        example: "Dans une maison, un ordinateur et un téléphone peuvent être connectés au même réseau Wi-Fi pour accéder à Internet.",
        question: "Quel est le rôle principal d'un réseau informatique ?",
        options: [
            "Connecter des appareils pour communiquer",
            "Augmenter la taille de l'écran",
            "Charger la batterie",
            "Imprimer automatiquement"
        ],
        answer: 0,
        feedback: "Un réseau permet aux appareils de communiquer et de partager des ressources."
    },
    {
        title: "Le routeur et le switch",
        category: "LEÇON 02 · ÉQUIPEMENTS",
        icon: "📡",
        description: "Le routeur et le switch sont deux équipements essentiels pour organiser les communications dans un réseau.",
        explanation: "Le routeur relie différents réseaux et permet notamment de connecter un réseau local à Internet. Le switch relie plusieurs appareils dans un même réseau local et transmet les données vers le bon appareil.",
        example: "Dans une salle informatique, les ordinateurs peuvent être reliés à un switch. Le routeur permet ensuite à ce réseau d'accéder à Internet.",
        question: "Quel équipement relie plusieurs appareils dans un réseau local ?",
        options: [
            "Un écran",
            "Un switch",
            "Un clavier",
            "Une souris"
        ],
        answer: 1,
        feedback: "Le switch connecte plusieurs appareils au sein d'un réseau local."
    },
    {
        title: "L'adresse IP",
        category: "LEÇON 03 · IDENTIFICATION",
        icon: "🔢",
        description: "Chaque appareil connecté à un réseau utilise une adresse IP pour être identifié et communiquer.",
        explanation: "Une adresse IP est une adresse numérique attribuée à une interface réseau. Elle permet d'identifier un appareil ou une interface dans un réseau. Exemple d'adresse IPv4 : 192.168.1.10.",
        example: "Un ordinateur peut avoir l'adresse 192.168.1.10 et une imprimante l'adresse 192.168.1.20 sur le même réseau local.",
        question: "À quoi sert une adresse IP ?",
        options: [
            "À identifier une interface sur un réseau",
            "À augmenter la mémoire",
            "À refroidir l'ordinateur",
            "À modifier la luminosité"
        ],
        answer: 0,
        feedback: "L'adresse IP permet d'identifier une interface réseau pour communiquer."
    },
    {
        title: "Serveur et Client",
        category: "LEÇON 04 · COMMUNICATION",
        icon: "🖥️",
        description: "Le client demande un service et le serveur répond à cette demande.",
        explanation: "Un serveur est un ordinateur ou un logiciel qui fournit des ressources ou des services. Un client est un appareil ou un logiciel qui demande ces ressources. Ils communiquent à travers un réseau.",
        example: "Lorsque tu ouvres un site web, ton navigateur est le client. Il envoie une demande au serveur qui héberge le site, puis reçoit les pages demandées.",
        question: "Quel est le rôle du client dans ce modèle ?",
        options: [
            "Fournir toujours l'électricité",
            "Demander un service au serveur",
            "Remplacer le routeur",
            "Créer une adresse IP automatiquement"
        ],
        answer: 1,
        feedback: "Le client envoie une demande et le serveur fournit une réponse."
    },
    {
        title: "Internet et le Wi-Fi",
        category: "LEÇON 05 · CONNEXION",
        icon: "📶",
        description: "Internet est un immense réseau mondial. Le Wi-Fi permet de connecter des appareils sans câble.",
        explanation: "Internet est un réseau mondial qui relie de nombreux réseaux entre eux. Le Wi-Fi est une technologie de communication sans fil qui permet de connecter des appareils à un réseau local. Le Wi-Fi et Internet ne sont donc pas la même chose.",
        example: "Un téléphone peut être connecté au Wi-Fi d'une maison. Si la connexion Internet de la maison est coupée, le téléphone peut rester connecté au réseau local sans accéder aux sites Internet.",
        question: "Le Wi-Fi est principalement une technologie de...",
        options: [
            "Stockage de fichiers",
            "Connexion sans fil",
            "Refroidissement",
            "Programmation"
        ],
        answer: 1,
        feedback: "Le Wi-Fi permet une connexion réseau sans utiliser de câble."
    },
    {
        title: "Les câbles et les connexions",
        category: "LEÇON 06 · TRANSMISSION",
        icon: "🔌",
        description: "Les câbles permettent de transmettre des données entre les équipements d'un réseau.",
        explanation: "Le câble Ethernet, souvent équipé d'un connecteur RJ45, est utilisé dans les réseaux locaux. La fibre optique transmet les données sous forme de signaux lumineux et permet des communications à très haut débit sur de longues distances.",
        example: "Dans un bureau, un ordinateur peut être relié à un switch avec un câble Ethernet pour bénéficier d'une connexion stable.",
        question: "Quel câble est souvent utilisé pour connecter un ordinateur à un switch ?",
        options: [
            "Câble HDMI",
            "Câble Ethernet",
            "Câble audio",
            "Câble d'alimentation uniquement"
        ],
        answer: 1,
        feedback: "Le câble Ethernet permet de relier des équipements dans un réseau local."
    }
];

// ========================================
// VARIABLES DU MONDE 3D
// ========================================

let scene;
let camera;
let renderer;
let controls;
let animationId;

let stations = [];
let stationMeshes = [];
let activeStation = 0;

let clickCallback = null;
let raycaster;
let pointer;

let resizeObserver;

// ========================================
// COULEURS
// ========================================

const colors = [
    0x9b6dff,
    0x45c8ff,
    0x43e0bd,
    0xffc45c,
    0xff78b7,
    0x9ca8ff
];

// ========================================
// CRÉER UN TEXTE 3D
// ========================================

function createLabel(text) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 128;

    context.fillStyle = "rgba(35, 25, 60, 0.88)";
    context.beginPath();
    context.roundRect(8, 8, 496, 112, 24);
    context.fill();

    context.strokeStyle = "rgba(190, 160, 255, 0.8)";
    context.lineWidth = 4;
    context.stroke();

    context.fillStyle = "#ffffff";
    context.font = "bold 34px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 64, 460);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(3.3, 0.82, 1);

    return sprite;
}

// ========================================
// CRÉER UNE STATION
// ========================================

function createStation(index, position) {
    const group = new THREE.Group();
    group.position.copy(position);

    const color = colors[index];

    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.05, 1.2, 0.22, 48),
        new THREE.MeshStandardMaterial({
            color: 0x30234f,
            metalness: 0.5,
            roughness: 0.35
        })
    );
    base.position.y = 0;
    group.add(base);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.035, 12, 64),
        new THREE.MeshBasicMaterial({ color })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.15;
    group.add(ring);

    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 24),
        new THREE.MeshBasicMaterial({ color })
    );
    glow.position.y = 0.35;
    group.add(glow);

    // Forme différente pour chaque station
    let object;

    if (index === 0) {
        // Réseau : plusieurs petits ordinateurs
        object = new THREE.Group();

        for (let i = 0; i < 3; i++) {
            const pc = new THREE.Group();

            const screen = new THREE.Mesh(
                new THREE.BoxGeometry(0.65, 0.48, 0.08),
                new THREE.MeshStandardMaterial({
                    color: 0x25243d,
                    metalness: 0.5
                })
            );

            const display = new THREE.Mesh(
                new THREE.BoxGeometry(0.55, 0.37, 0.02),
                new THREE.MeshBasicMaterial({ color })
            );
            display.position.z = 0.055;

            const stand = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.2, 0.1),
                new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
            );
            stand.position.y = -0.32;

            pc.add(screen, display, stand);
            pc.position.set((i - 1) * 0.9, 0.7, 0);
            object.add(pc);
        }
    } else if (index === 1) {
        // Routeur et switch
        object = new THREE.Group();

        const router = new THREE.Mesh(
            new THREE.BoxGeometry(1.35, 0.35, 0.8),
            new THREE.MeshStandardMaterial({
                color: 0x38344d,
                metalness: 0.65,
                roughness: 0.3
            })
        );

        const routerLight = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.04, 0.03),
            new THREE.MeshBasicMaterial({ color: 0x43e0bd })
        );
        routerLight.position.set(0, 0.12, 0.42);

        object.add(router, routerLight);

        for (let i = 0; i < 2; i++) {
            const antenna = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 0.75, 12),
                new THREE.MeshStandardMaterial({ color: 0xdddddd })
            );
            antenna.position.set(i === 0 ? -0.48 : 0.48, 0.5, -0.25);
            antenna.rotation.z = -0.12;
            object.add(antenna);
        }
    } else if (index === 2) {
        // Adresse IP : cube numérique
        object = new THREE.Group();

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1.15, 1.15, 1.15),
            new THREE.MeshStandardMaterial({
                color,
                metalness: 0.45,
                roughness: 0.25
            })
        );
        object.add(cube);

        const smallCube = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.45, 0.45),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        smallCube.position.set(0.85, 0.65, 0.2);
        object.add(smallCube);
    } else if (index === 3) {
        // Serveur
        object = new THREE.Group();

        for (let i = 0; i < 3; i++) {
            const server = new THREE.Mesh(
                new THREE.BoxGeometry(0.9, 0.38, 0.65),
                new THREE.MeshStandardMaterial({
                    color: 0x34354e,
                    metalness: 0.6
                })
            );
            server.position.y = 0.25 + i * 0.45;
            object.add(server);

            const light = new THREE.Mesh(
                new THREE.SphereGeometry(0.055, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0x43e0bd })
            );
            light.position.set(-0.3, 0.25 + i * 0.45, 0.34);
            object.add(light);
        }
    } else if (index === 4) {
        // Wi-Fi : sphère et anneaux
        object = new THREE.Group();

        const center = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 24, 24),
            new THREE.MeshStandardMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0.6
            })
        );
        object.add(center);

        for (let i = 1; i <= 3; i++) {
            const arc = new THREE.Mesh(
                new THREE.TorusGeometry(0.35 + i * 0.2, 0.025, 10, 48, Math.PI),
                new THREE.MeshBasicMaterial({ color })
            );
            arc.position.y = 0.15 + i * 0.13;
            arc.rotation.z = Math.PI;
            object.add(arc);
        }
    } else {
        // Câble Ethernet
        object = new THREE.Group();

        const cable = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 1.7, 20),
            new THREE.MeshStandardMaterial({
                color: 0x8c7bff,
                metalness: 0.3
            })
        );
        cable.rotation.z = Math.PI / 2;
        object.add(cable);

        for (let i = 0; i < 2; i++) {
            const connector = new THREE.Mesh(
                new THREE.BoxGeometry(0.35, 0.3, 0.35),
                new THREE.MeshStandardMaterial({ color: 0xd6d6e5 })
            );
            connector.position.x = i === 0 ? -0.95 : 0.95;
            object.add(connector);
        }
    }

    object.position.y = 0.95;
    group.add(object);

    const label = createLabel(lessons[index].title);
    label.position.set(0, 2.45, 0);
    group.add(label);

    // Lumière autour de la station
    const pointLight = new THREE.PointLight(color, 1.5, 5);
    pointLight.position.set(0, 1.5, 1);
    group.add(pointLight);

    scene.add(group);

    stations.push(group);
    stationMeshes.push(...object.children.filter(child => child.isMesh));
}

// ========================================
// CRÉER LES CONNEXIONS
// ========================================

function createConnections() {
    const points = [
        new THREE.Vector3(-7.5, 0.25, 0),
        new THREE.Vector3(-4.5, 0.25, 0),
        new THREE.Vector3(-1.5, 0.25, 0),
        new THREE.Vector3(1.5, 0.25, 0),
        new THREE.Vector3(4.5, 0.25, 0),
        new THREE.Vector3(7.5, 0.25, 0)
    ];

    const curve = new THREE.CatmullRomCurve3(points);

    const line = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 100, 0.035, 8, false),
        new THREE.MeshBasicMaterial({
            color: 0x8261c7,
            transparent: true,
            opacity: 0.7
        })
    );

    scene.add(line);
}

// ========================================
// SÉLECTION VISUELLE
// ========================================

export function selectWorldStation(index) {
    if (!stations.length) return;

    activeStation = Math.max(0, Math.min(index, stations.length - 1));

    stations.forEach((station, i) => {
        const scale = i === activeStation ? 1.12 : 1;
        station.scale.setScalar(scale);
    });
}

// ========================================
// CLIC SUR UNE STATION
// ========================================

function handlePointerClick(event, container) {
    const rect = container.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(stations, true);

    if (intersections.length > 0) {
        let selected = intersections[0].object;

        while (selected.parent && !stations.includes(selected)) {
            selected = selected.parent;
        }

        const index = stations.indexOf(selected);

        if (index !== -1) {
            selectWorldStation(index);

            if (typeof clickCallback === "function") {
                clickCallback(index);
            }
        }
    }
}

// ========================================
// INITIALISATION
// ========================================

export function initNetworkWorld({ container, onSelect }) {
    if (!container) {
        throw new Error("Conteneur networkWorld introuvable !");
    }

    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    stations = [];
    stationMeshes = [];
    clickCallback = onSelect;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1b1630);

    scene.fog = new THREE.Fog(0x1b1630, 18, 38);

    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 9, 17);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 9;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0.8, 0);

    // Lumières
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const purpleLight = new THREE.PointLight(0x8957ff, 3, 25);
    purpleLight.position.set(-5, 4, -3);
    scene.add(purpleLight);

    // Sol
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 18),
        new THREE.MeshStandardMaterial({
            color: 0x28203e,
            roughness: 0.8,
            metalness: 0.1
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.15;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(30, 30, 0x7656a8, 0x42345f);
    grid.position.y = -0.13;
    scene.add(grid);

    // Positions des 6 stations
    const positions = [
        new THREE.Vector3(-7.5, 0, 0),
        new THREE.Vector3(-4.5, 0, 0),
        new THREE.Vector3(-1.5, 0, 0),
        new THREE.Vector3(1.5, 0, 0),
        new THREE.Vector3(4.5, 0, 0),
        new THREE.Vector3(7.5, 0, 0)
    ];

    positions.forEach((position, index) => {
        createStation(index, position);
    });

    createConnections();

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    const clickHandler = event => handlePointerClick(event, container);
    renderer.domElement.addEventListener("click", clickHandler);

    // Redimensionnement
    resizeObserver = new ResizeObserver(() => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        animationId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        stations.forEach((station, index) => {
            station.position.y = Math.sin(elapsed * 1.4 + index) * 0.08;

            if (index === activeStation) {
                station.rotation.y = Math.sin(elapsed * 0.8) * 0.08;
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    selectWorldStation(0);

    // Masquer le message de chargement
    const loading = document.getElementById("loadingMessage");
    if (loading) loading.style.display = "none";

    function resetCamera() {
        camera.position.set(0, 9, 17);
        controls.target.set(0, 0.8, 0);
        controls.update();
    }

    return { resetCamera };
}
