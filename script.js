
import { createWorld } from "./world.js";

// ======================================
// IT WORLD 3D - VERSION FRANÇAISE
// ======================================

const topics = {
    hardware: {
        icon: "💻",
        tag: "MONDE 01",
        title: "Matériel informatique",
        description: "Découvrez les composants physiques d'un ordinateur : processeur, mémoire vive (RAM), disque dur et carte mère."
    },

    software: {
        icon: "⚙️",
        tag: "MONDE 02",
        title: "Logiciels et applications",
        description: "Découvrez les logiciels, les applications et les systèmes d'exploitation."
    },

    programming: {
        icon: "💻",
        tag: "MONDE 03",
        title: "Programmation",
        description: "Apprenez à programmer avec Python depuis zéro grâce à un univers 3D interactif."
    },

    network: {
        icon: "🌐",
        tag: "MONDE 04",
        title: "Réseaux et Internet",
        description: "Comprenez comment les ordinateurs communiquent et comment les informations circulent sur Internet."
    },

    security: {
        icon: "🔐",
        tag: "MONDE 05",
        title: "Cybersécurité",
        description: "Découvrez les méthodes de protection des données, des comptes et des systèmes informatiques."
    },

    ai: {
        icon: "🤖",
        tag: "MONDE 06",
        title: "Intelligence artificielle",
        description: "Explorez l'intelligence artificielle, les robots et les nouvelles technologies."
    }
};

// ======================================
// TEXTES EN FRANÇAIS
// ======================================

const texts = {
    eyebrow: "BIENVENUE DANS L'UNIVERS NUMÉRIQUE",

    title: "Découvrez le monde de l'informatique",

    description:
        "Explorez, interagissez et apprenez. Votre voyage dans le monde de la technologie commence ici.",

    instruction:
        "🖱️ Faites glisser pour explorer · Cliquez sur un monde pour le découvrir",

    tag: "EXPLOREZ LE MONDE",

    panelTitle: "Choisissez votre univers",

    panelDescription:
        "Cliquez sur l'un des six mondes pour commencer votre aventure.",

    footer: "APPRENDRE · EXPLORER · CRÉER",

    exploreButton: "Explorer ce monde →"
};

// ======================================
// LIENS DES PAGES
// ======================================


const topicLinks = {
    hardware: "hardware.html",
    software: "software.html",
    programming: "python.html",
    network: "network.html",
    security: "security.html",
    ai: "ai.html"
};


// ======================================
// SHOW TOPIC
// ======================================

function showTopic(key) {
    const topic = topics[key];
    

    if (!topic) return;

    document.getElementById("topicIcon").textContent = topic.icon;

    document.getElementById("topicTag").textContent = topic.tag;

    const title = document.getElementById("topicTitle");

    title.textContent = topic.title;
    title.dataset.topic = key;

    document.getElementById("topicDescription").textContent =
        topic.description;

    const exploreBtn = document.getElementById("exploreBtn");

    if (!exploreBtn) return;

    const page = topicLinks[key];

    if (page) {
        exploreBtn.hidden = false;
        exploreBtn.href = page;
        exploreBtn.textContent = texts.exploreButton;
    } else {
        exploreBtn.hidden = true;
    }
}

// ======================================
// INITIALISER LES TEXTES
// ======================================

function initializeText() {
    document.documentElement.lang = "fr";
    document.body.dir = "ltr";

    const languageBtn = document.getElementById("languageBtn");

    if (languageBtn) {
        languageBtn.hidden = true;
    }

    document.getElementById("eyebrow").textContent =
        texts.eyebrow;

    document.getElementById("mainTitle").textContent =
        texts.title;

    document.getElementById("description").textContent =
        texts.description;

    document.getElementById("instruction").textContent =
        texts.instruction;

    document.getElementById("footerText").textContent =
        texts.footer;

    document.getElementById("topicTag").textContent =
        texts.tag;

    document.getElementById("topicTitle").textContent =
        texts.panelTitle;

    document.getElementById("topicDescription").textContent =
        texts.panelDescription;

    const exploreBtn = document.getElementById("exploreBtn");

    if (exploreBtn) {
        exploreBtn.hidden = true;
    }
}

// ======================================
// CLOSE PANEL
// ======================================

document.getElementById("closePanel").addEventListener("click", () => {

    document.getElementById("topicIcon").textContent = "🌍";

    document.getElementById("topicTag").textContent =
        texts.tag;

    const title = document.getElementById("topicTitle");

    title.textContent = texts.panelTitle;

    delete title.dataset.topic;

    document.getElementById("topicDescription").textContent =
        texts.panelDescription;

    const exploreBtn = document.getElementById("exploreBtn");

    if (exploreBtn) {
        exploreBtn.hidden = true;
    }
});

// ======================================
// RECEIVE 3D WORLD CLICKS
// ======================================

window.addEventListener("itworld:topic", (event) => {
    showTopic(event.detail);
});

// ======================================
// START APPLICATION
// ======================================

initializeText();

const worldContainer = document.getElementById("world3d");

if (worldContainer) {
    createWorld(worldContainer);
}

