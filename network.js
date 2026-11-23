
import {
    lessons,
    initNetworkWorld,
    selectWorldStation
} from "./network-world.js";

// ========================================
// ELEMENTS HTML
// ========================================

const elements = {
    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    progressDescription: document.getElementById("progressDescription"),

    networkWorld: document.getElementById("networkWorld"),
    resetCamera: document.getElementById("resetCamera"),

    lessonItems: document.querySelectorAll(".lesson-item"),

    lessonCategory: document.getElementById("lessonCategory"),
    lessonIcon: document.getElementById("lessonIcon"),
    lessonTitle: document.getElementById("lessonTitle"),
    lessonDescription: document.getElementById("lessonDescription"),
    lessonExplanation: document.getElementById("lessonExplanation"),
    lessonExample: document.getElementById("lessonExample"),

    quizQuestion: document.getElementById("quizQuestion"),
    quizOptions: document.getElementById("quizOptions"),
    quizFeedback: document.getElementById("quizFeedback"),

    previousBtn: document.getElementById("previousBtn"),
    nextBtn: document.getElementById("nextBtn")
};

// ========================================
// VARIABLES
// ========================================

let currentLesson = 0;
let completedLessons = new Set();
let worldControls = null;

// ========================================
// AFFICHER LA PROGRESSION
// ========================================

function updateProgress() {
    const completed = completedLessons.size;
    const total = lessons.length;
    const percentage = (completed / total) * 100;

    elements.progressText.textContent = `${completed} / ${total}`;
    elements.progressBar.style.width = `${percentage}%`;

    if (completed === 0) {
        elements.progressDescription.textContent =
            "Commencez votre première leçon !";
    } else if (completed === total) {
        elements.progressDescription.textContent =
            "Félicitations ! Vous avez terminé toutes les leçons.";
    } else {
        elements.progressDescription.textContent =
            "Continuez votre apprentissage !";
    }
}

// ========================================
// AFFICHER LES OPTIONS DU QUIZ
// ========================================

function displayQuiz(lesson) {
    elements.quizQuestion.textContent = lesson.question;
    elements.quizOptions.innerHTML = "";
    elements.quizFeedback.textContent = "";
    elements.quizFeedback.style.color = "";

    lesson.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            checkAnswer(index, button, lesson);
        });

        elements.quizOptions.appendChild(button);
    });
}

// ========================================
// VÉRIFIER LA RÉPONSE
// ========================================

function checkAnswer(selectedIndex, selectedButton, lesson) {
    const buttons = elements.quizOptions.querySelectorAll("button");

    // Empêcher plusieurs réponses
    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selectedIndex === lesson.answer) {
        selectedButton.classList.add("correct");

        elements.quizFeedback.textContent =
            "✓ Bonne réponse ! " + lesson.feedback;

        elements.quizFeedback.style.color = "#23834f";

        completedLessons.add(currentLesson);
        updateProgress();

        const menuItem = document.querySelector(
            `.lesson-item[data-lesson="${currentLesson}"]`
        );

        if (menuItem) {
            menuItem.classList.add("completed");
        }
    } else {
        selectedButton.classList.add("incorrect");

        buttons[lesson.answer].classList.add("correct");

        elements.quizFeedback.textContent =
            "✗ Ce n'est pas la bonne réponse. " + lesson.feedback;

        elements.quizFeedback.style.color = "#c34c4c";
    }
}

// ========================================
// AFFICHER UNE LEÇON
// ========================================

function showLesson(index, updateWorld = true) {
    if (index < 0 || index >= lessons.length) return;

    currentLesson = index;

    const lesson = lessons[index];

    elements.lessonCategory.textContent = lesson.category;
    elements.lessonIcon.textContent = lesson.icon;
    elements.lessonTitle.textContent = lesson.title;
    elements.lessonDescription.textContent = lesson.description;
    elements.lessonExplanation.textContent = lesson.explanation;
    elements.lessonExample.textContent = lesson.example;

    // Mettre à jour le menu
    elements.lessonItems.forEach((item, itemIndex) => {
        item.classList.toggle("active", itemIndex === index);
    });

    // Mettre à jour le quiz
    displayQuiz(lesson);

    // Boutons de navigation
    elements.previousBtn.disabled = index === 0;

    elements.nextBtn.textContent =
        index === lessons.length - 1
            ? "Retour au début ↻"
            : "Leçon suivante →";

    // Mettre à jour la station 3D sans rappeler le callback
    if (updateWorld) {
        selectWorldStation(index);
    }
}

// ========================================
// MENU DES LEÇONS
// ========================================

elements.lessonItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        showLesson(index);
    });
});

// ========================================
// NAVIGATION PRÉCÉDENT / SUIVANT
// ========================================

elements.previousBtn.addEventListener("click", () => {
    showLesson(currentLesson - 1);
});

elements.nextBtn.addEventListener("click", () => {
    if (currentLesson === lessons.length - 1) {
        showLesson(0);
    } else {
        showLesson(currentLesson + 1);
    }
});

// ========================================
// RÉINITIALISER LA CAMÉRA
// ========================================

elements.resetCamera.addEventListener("click", () => {
    if (worldControls) {
        worldControls.resetCamera();
    }
});

// ========================================
// INITIALISER LE MONDE 3D
// ========================================

function initializeNetworkWorld() {
    worldControls = initNetworkWorld({
        container: elements.networkWorld,

        // Quand on clique sur une station 3D
        // on affiche sa leçon sans rappeler selectWorldStation
        onSelect: index => {
            showLesson(index, false);
        }
    });
}

// ========================================
// DÉMARRAGE
// ========================================

showLesson(0);
updateProgress();
initializeNetworkWorld();
