
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ========================================
// CONTENU DES LEÇONS
// ========================================

export const lessons = [
    {
        title: "Les bases de la cybersécurité",
        category: "LEÇON 01 · INTRODUCTION",
        icon: "🔐",
        description: "La cybersécurité consiste à protéger les systèmes informatiques, les réseaux et les données contre les attaques.",
        explanation: "La cybersécurité regroupe les méthodes et les outils utilisés pour protéger les ordinateurs, les téléphones, les réseaux et les informations numériques. Elle vise notamment à préserver la confidentialité, l'intégrité et la disponibilité des données.",
        example: "Verrouiller son téléphone, installer les mises à jour et éviter les liens suspects sont des gestes simples de cybersécurité.",
        question: "Quel est l'objectif principal de la cybersécurité ?",
        options: [
            "Protéger les systèmes et les données",
            "Augmenter la taille de l'écran",
            "Accélérer le clavier",
            "Changer la couleur de l'ordinateur"
        ],
        answer: 0,
        feedback: "La cybersécurité sert à protéger les appareils, les réseaux et les données."
    },
    {
        title: "Les logiciels malveillants",
        category: "LEÇON 02 · MENACES",
        icon: "🦠",
        description: "Les logiciels malveillants sont des programmes conçus pour endommager un appareil ou accéder à des informations sans autorisation.",
        explanation: "Un logiciel malveillant, ou malware, est un programme dangereux. Il peut voler des informations, espionner un utilisateur, bloquer des fichiers ou perturber le fonctionnement d'un appareil. Les virus, les chevaux de Troie et les rançongiciels sont des exemples de malwares.",
        example: "Un fichier joint provenant d'un expéditeur inconnu peut contenir un programme malveillant. Il faut vérifier sa source avant de l'ouvrir.",
        question: "Comment appelle-t-on un logiciel conçu pour nuire à un appareil ?",
        options: [
            "Un navigateur",
            "Un logiciel malveillant",
            "Un traitement de texte",
            "Un système de fichiers"
        ],
        answer: 1,
        feedback: "Un malware est un logiciel conçu pour effectuer des actions nuisibles."
    },
    {
        title: "Les mots de passe sécurisés",
        category: "LEÇON 03 · AUTHENTIFICATION",
        icon: "🔑",
        description: "Un mot de passe robuste aide à empêcher les personnes non autorisées d'accéder à vos comptes.",
        explanation: "Un bon mot de passe doit être long, difficile à deviner et différent pour chaque compte. Il est préférable d'utiliser une phrase de passe longue ou un gestionnaire de mots de passe. L'authentification à deux facteurs ajoute une protection supplémentaire.",
        example: "Évitez les mots de passe comme 123456 ou votre date de naissance. Utilisez un mot de passe long et unique pour chaque service.",
        question: "Quelle pratique améliore la sécurité de vos comptes ?",
        options: [
            "Utiliser le même mot de passe partout",
            "Partager son mot de passe",
            "Créer un mot de passe long et unique",
            "Choisir uniquement son prénom"
        ],
        answer: 2,
        feedback: "Un mot de passe long et unique réduit le risque d'accès non autorisé."
    },
    {
        title: "Le phishing",
        category: "LEÇON 04 · HAMEÇONNAGE",
        icon: "🎣",
        description: "Le phishing est une technique de fraude qui cherche à tromper une personne pour obtenir ses informations personnelles.",
        explanation: "Le phishing, ou hameçonnage, utilise souvent de faux e-mails, messages ou sites web qui imitent des organisations connues. Le but est de pousser la victime à communiquer un mot de passe, des informations bancaires ou d'autres données sensibles.",
        example: "Un message prétend que votre compte sera fermé et vous demande de cliquer sur un lien urgent. Vérifiez l'adresse de l'expéditeur et le site officiel avant toute action.",
        question: "Quel comportement est le plus prudent face à un message suspect ?",
        options: [
            "Cliquer rapidement sur son lien",
            "Envoyer son mot de passe",
            "Vérifier l'expéditeur et le lien",
            "Transférer le message à tout le monde"
        ],
        answer: 2,
        feedback: "Il faut vérifier la source du message et éviter les liens suspects."
    },
    {
        title: "Les pare-feu",
        category: "LEÇON 05 · PROTECTION",
        icon: "🧱",
        description: "Un pare-feu contrôle les communications réseau et applique des règles pour autoriser ou bloquer certains échanges.",
        explanation: "Un pare-feu, ou firewall, surveille le trafic entrant et sortant d'un appareil ou d'un réseau. Il compare les communications à des règles de sécurité et peut bloquer celles qui ne sont pas autorisées.",
        example: "Le pare-feu d'un ordinateur peut empêcher une application inconnue de recevoir des connexions non autorisées.",
        question: "Quel est le rôle d'un pare-feu ?",
        options: [
            "Contrôler le trafic réseau",
            "Augmenter la mémoire vive",
            "Créer des documents",
            "Recharger la batterie"
        ],
        answer: 0,
        feedback: "Le pare-feu filtre les communications selon des règles de sécurité."
    },
    {
        title: "La protection des données",
        category: "LEÇON 06 · CONFIDENTIALITÉ",
        icon: "🗄️",
        description: "Les données personnelles doivent être protégées contre la perte, le vol et les accès non autorisés.",
        explanation: "La protection des données consiste à limiter l'accès aux informations personnelles et à les conserver de manière sécurisée. Les sauvegardes, le chiffrement, les mises à jour et les paramètres de confidentialité sont des moyens importants de protection.",
        example: "Faire une sauvegarde de ses fichiers importants sur un support sécurisé permet de les récupérer en cas de panne ou de perte de l'appareil.",
        question: "Pourquoi faut-il sauvegarder ses fichiers importants ?",
        options: [
            "Pour les rendre publics",
            "Pour pouvoir les récupérer en cas de perte",
            "Pour supprimer les mots de passe",
            "Pour désactiver Internet"
        ],
        answer: 1,
        feedback: "Une sauvegarde permet de récupérer des données après une panne, une erreur ou une perte."
    }
];

// ========================================
// VARIABLES 3D
// ========================================

let scene;
let camera;
let renderer;
let controls;
let animationId;
let resizeObserver;

let stations = [];
let activeStation = 0;
let clickCallback = null;
let raycaster;
let pointer;

const colors = [
    0x9b6dff,
    0xff526b,
    0x45c8ff,
    0xffb84d,
    0x43d6a0,
    0xc18aff
];

// ========================================
// CRÉER UNE ÉTIQUETTE
// ========================================

function createLabel(text) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 128;

    context.fillStyle = "rgba(35, 25, 60, 0.92)";
    context.beginPath();
    context.roundRect(8, 8, 496, 112, 24);
    context.fill();

    context.strokeStyle = "rgba(190, 160, 255, 0.8)";
    context.lineWidth = 4;
    context.stroke();

    context.fillStyle = "#ffffff";
    context.font = "bold 32px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 64, 460);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        })
    );

    sprite.scale.set(3.5, 0.88, 1);

    return sprite;
}

// ========================================
// CRÉER UN OBJET SELON LA LEÇON
// ========================================

function createSecurityObject(index, color) {
    const group = new THREE.Group();

    if (index === 0) {
        // Bouclier
        const shieldShape = new THREE.Shape();
        shieldShape.moveTo(0, 1.2);
        shieldShape.lineTo(0.85, 0.85);
        shieldShape.lineTo(0.72, -0.3);
        shieldShape.lineTo(0, -1.1);
        shieldShape.lineTo(-0.72, -0.3);
        shieldShape.lineTo(-0.85, 0.85);
        shieldShape.closePath();

        const shield = new THREE.Mesh(
            new THREE.ExtrudeGeometry(shieldShape, {
                depth: 0.22,
                bevelEnabled: true,
                bevelSegments: 3,
                bevelSize: 0.08,
                bevelThickness: 0.08
            }),
            new THREE.MeshStandardMaterial({
                color,
                metalness: 0.55,
                roughness: 0.25,
                emissive: color,
                emissiveIntensity: 0.2
            })
        );

        group.add(shield);

        const check = new THREE.Mesh(
            new THREE.TorusGeometry(0.35, 0.07, 12, 40, Math.PI * 1.4),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );

        check.position.set(0, -0.05, 0.28);
        check.rotation.z = -0.5;
        group.add(check);

    } else if (index === 1) {
        // Virus stylisé
        const core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.65, 1),
            new THREE.MeshStandardMaterial({
                color,
                emissive: color,
                emissiveIntensity: 0.5,
                roughness: 0.3
            })
        );

        group.add(core);

        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;

            const spike = new THREE.Mesh(
                new THREE.CylinderGeometry(0.07, 0.12, 0.55, 8),
                new THREE.MeshStandardMaterial({ color })
            );

            spike.position.set(
                Math.cos(angle) * 0.78,
                Math.sin(angle) * 0.78,
                0
            );

            spike.rotation.z = -angle + Math.PI / 2;
            group.add(spike);

            const tip = new THREE.Mesh(
                new THREE.SphereGeometry(0.11, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );

            tip.position.set(
                Math.cos(angle) * 1.05,
                Math.sin(angle) * 1.05,
                0
            );

            group.add(tip);
        }

    } else if (index === 2) {
        // Cadenas
        const lockBody = new THREE.Mesh(
            new THREE.BoxGeometry(1.1, 0.9, 0.45),
            new THREE.MeshStandardMaterial({
                color,
                metalness: 0.5,
                roughness: 0.25
            })
        );

        lockBody.position.y = -0.25;
        group.add(lockBody);

        const shackle = new THREE.Mesh(
            new THREE.TorusGeometry(0.35, 0.1, 12, 40, Math.PI),
            new THREE.MeshStandardMaterial({
                color: 0xd8d5e5,
                metalness: 0.8
            })
        );

        shackle.position.y = 0.35;
        group.add(shackle);

        const keyhole = new THREE.Mesh(
            new THREE.CircleGeometry(0.09, 20),
            new THREE.MeshBasicMaterial({ color: 0x211b36 })
        );

        keyhole.position.set(0, -0.2, 0.24);
        group.add(keyhole);

    } else if (index === 3) {
        // Message suspect
        const message = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 0.9, 0.12),
            new THREE.MeshStandardMaterial({
                color: 0xf5f1ff,
                roughness: 0.4
            })
        );

        group.add(message);

        const warning = new THREE.Mesh(
            new THREE.ConeGeometry(0.28, 0.5, 3),
            new THREE.MeshBasicMaterial({ color: 0xff526b })
        );

        warning.position.set(0, 0, 0.12);
        group.add(warning);

        const lineMaterial = new THREE.MeshBasicMaterial({
            color: 0x7654ae
        });

        for (let i = 0; i < 2; i++) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(0.65, 0.035, 0.03),
                lineMaterial
            );

            line.position.set(0, -0.35 - i * 0.13, 0.08);
            group.add(line);
        }

    } else if (index === 4) {
        // Mur / pare-feu
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 1.3, 0.35),
            new THREE.MeshStandardMaterial({
                color,
                metalness: 0.4,
                roughness: 0.4
            })
        );

        group.add(wall);

        const brickMaterial = new THREE.MeshStandardMaterial({
            color: 0xe7dfff
        });

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                const brick = new THREE.Mesh(
                    new THREE.BoxGeometry(0.58, 0.25, 0.04),
                    brickMaterial
                );

                brick.position.set(
                    col === 0 ? -0.32 : 0.32,
                    0.42 - row * 0.42,
                    0.2
                );

                group.add(brick);
            }
        }

    } else {
        // Base de données
        const database = new THREE.Mesh(
            new THREE.CylinderGeometry(0.7, 0.7, 1.25, 40),
            new THREE.MeshStandardMaterial({
                color,
                metalness: 0.45,
                roughness: 0.3
            })
        );

        group.add(database);

        for (let i = 0; i < 3; i++) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.7, 0.025, 10, 48),
                new THREE.MeshBasicMaterial({ color: 0xffffff })
            );

            ring.position.y = -0.35 + i * 0.35;
            group.add(ring);
        }
    }

    return group;
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

    group.add(base);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.85, 0.035, 12, 64),
        new THREE.MeshBasicMaterial({ color })
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.15;
    group.add(ring);

    const object = createSecurityObject(index, color);
    object.position.y = 1.1;
    group.add(object);

    const label = createLabel(lessons[index].title);
    label.position.set(0, 2.75, 0);
    group.add(label);

    const light = new THREE.PointLight(color, 1.5, 5);
    light.position.set(0, 1.5, 1);
    group.add(light);

    scene.add(group);
    stations.push(group);
}

// ========================================
// CONNEXIONS ENTRE LES STATIONS
// ========================================

function createConnections() {
    const points = [];

    for (let i = 0; i < 6; i++) {
        points.push(
            new THREE.Vector3(-7.5 + i * 3, 0.25, 0)
        );
    }

    const curve = new THREE.CatmullRomCurve3(points);

    const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 100, 0.035, 8, false),
        new THREE.MeshBasicMaterial({
            color: 0x8261c7,
            transparent: true,
            opacity: 0.75
        })
    );

    scene.add(tube);
}

// ========================================
// SÉLECTION D'UNE STATION
// ========================================

export function selectWorldStation(index) {
    if (!stations.length) return;

    activeStation = Math.max(0, Math.min(index, stations.length - 1));

    stations.forEach((station, i) => {
        station.scale.setScalar(i === activeStation ? 1.12 : 1);
    });
}

// ========================================
// DÉTECTER LES CLICS
// ========================================

function handlePointerClick(event, container) {
    const rect = container.getBoundingClientRect();

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(stations, true);

    if (!intersections.length) return;

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

// ========================================
// INITIALISATION DU MONDE
// ========================================

export function initSecurityWorld({ container, onSelect }) {
    if (!container) {
        throw new Error("Conteneur securityWorld introuvable !");
    }

    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    if (resizeObserver) {
        resizeObserver.disconnect();
    }

    stations = [];
    activeStation = 0;
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

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 9;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0.8, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const mainLight = new THREE.DirectionalLight(0xffffff, 2);
    mainLight.position.set(5, 10, 7);
    scene.add(mainLight);

    const purpleLight = new THREE.PointLight(0x8957ff, 3, 25);
    purpleLight.position.set(-5, 4, -3);
    scene.add(purpleLight);

    // Sol
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 18),
        new THREE.MeshStandardMaterial({
            color: 0x28203e,
            roughness: 0.8
        })
    );

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.15;
    scene.add(floor);

    const grid = new THREE.GridHelper(30, 30, 0x7656a8, 0x42345f);
    grid.position.y = -0.13;
    scene.add(grid);

    // Les six stations
    for (let i = 0; i < 6; i++) {
        createStation(
            i,
            new THREE.Vector3(-7.5 + i * 3, 0, 0)
        );
    }

    createConnections();

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    renderer.domElement.addEventListener("click", event => {
        handlePointerClick(event, container);
    });

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
            station.position.y = Math.sin(elapsed * 1.4 + index) * 0.07;

            if (index === activeStation) {
                station.rotation.y = Math.sin(elapsed * 0.8) * 0.07;
            }
        });

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    selectWorldStation(0);

    const loading = document.getElementById("loadingMessage");
    if (loading) loading.style.display = "none";

    function resetCamera() {
        camera.position.set(0, 9, 17);
        controls.target.set(0, 0.8, 0);
        controls.update();
    }

    return { resetCamera };
}
