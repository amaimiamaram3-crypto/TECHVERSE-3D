
import {
    lessons,
    initSoftwareWorld,
    selectSoftwareStation
} from "./software-world.js";

// ==========================================
// SOFTWARE WORLD - MAIN SCRIPT
// ==========================================

const elements = {
    world: document.getElementById("softwareWorld"),
    loading: document.getElementById("loadingMessage"),

    lessonItems: document.querySelectorAll(".lesson-item"),

    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    progressDescription: document.getElementById("progressDescription"),

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
    nextBtn: document.getElementById("nextBtn"),
    resetCamera: document.getElementById("resetCamera")
};

// ==========================================
// STATE
// ==========================================

let currentLesson = 0;

const completedLessons = new Set();

let worldControls = null;

// ==========================================
// CHECK HTML ELEMENTS
// ==========================================

const requiredElements = [
    "world",
    "lessonTitle",
    "lessonDescription",
    "lessonExplanation",
    "lessonExample",
    "quizQuestion",
    "quizOptions",
    "previousBtn",
    "nextBtn"
];

for (const key of requiredElements) {

    if (!elements[key]) {
        console.error(`Élément HTML introuvable : ${key}`);
    }

}

// ==========================================
// UPDATE PROGRESS
// ==========================================

function updateProgress() {

    const completed = completedLessons.size;

    const total = lessons.length;

    const percentage = Math.round(
        (completed / total) * 100
    );

    if (elements.progressText) {
        elements.progressText.textContent =
            `${completed} / ${total}`;
    }

    if (elements.progressBar) {
        elements.progressBar.style.width =
            `${percentage}%`;
    }

    if (elements.progressDescription) {
        elements.progressDescription.textContent =
            `${percentage}% du parcours terminé`;
    }

}

// ==========================================
// DISPLAY QUIZ
// ==========================================

function displayQuiz(lesson) {

    elements.quizQuestion.textContent =
        lesson.question;

    elements.quizOptions.innerHTML = "";

    elements.quizFeedback.textContent = "";

    elements.quizFeedback.className = "quiz-feedback";

    lesson.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "quiz-option";

        button.textContent = option;

        button.addEventListener("click", () => {

            checkAnswer(index, lesson);

        });

        elements.quizOptions.appendChild(button);

    });

    if (completedLessons.has(currentLesson)) {

        elements.quizFeedback.textContent =
            "✓ Leçon déjà validée !";

        elements.quizFeedback.classList.add("success");

    }

}

// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(selectedIndex, lesson) {

    const buttons = elements.quizOptions.querySelectorAll(
        ".quiz-option"
    );

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selectedIndex === lesson.answer) {

        completedLessons.add(currentLesson);

        buttons[selectedIndex].classList.add("correct");

        elements.quizFeedback.textContent =
            "Excellent ! Bonne réponse 🎉";

        elements.quizFeedback.className =
            "quiz-feedback success";

        updateProgress();

    } else {

        buttons[selectedIndex].classList.add("incorrect");

        buttons[lesson.answer].classList.add("correct");

        elements.quizFeedback.textContent =
            "Pas tout à fait ! La bonne réponse est : " +
            lesson.options[lesson.answer];

        elements.quizFeedback.className =
            "quiz-feedback error";

        setTimeout(() => {

            if (currentLesson === lessons.indexOf(lesson)) {
                displayQuiz(lesson);
            }

        }, 1600);

    }

}

// ==========================================
// SHOW LESSON
// ==========================================

function showLesson(index, updateWorld = true) {

    if (index < 0 || index >= lessons.length) return;

    currentLesson = index;

    const lesson = lessons[index];

    // Lesson information

    elements.lessonCategory.textContent =
        lesson.category;

    elements.lessonIcon.textContent =
        lesson.icon;

    elements.lessonTitle.textContent =
        lesson.title;

    elements.lessonDescription.textContent =
        lesson.description;

    elements.lessonExplanation.textContent =
        lesson.explanation;

    elements.lessonExample.textContent =
        lesson.example;

    // Active lesson in sidebar

    elements.lessonItems.forEach((item, itemIndex) => {

        item.classList.toggle(
            "active",
            itemIndex === index
        );

        item.classList.toggle(
            "completed",
            completedLessons.has(itemIndex)
        );

    });

    // Quiz

    displayQuiz(lesson);

    // Navigation

    elements.previousBtn.disabled = index === 0;

    elements.nextBtn.disabled =
        index === lessons.length - 1;

    elements.previousBtn.style.opacity =
        index === 0 ? "0.45" : "1";

    elements.nextBtn.style.opacity =
        index === lessons.length - 1 ? "0.45" : "1";

    // 3D world

    if (updateWorld) {
        selectSoftwareStation(index);
    }

}

// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

elements.lessonItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        showLesson(index);

    });

});

// ==========================================
// PREVIOUS BUTTON
// ==========================================

elements.previousBtn.addEventListener("click", () => {

    if (currentLesson > 0) {

        showLesson(currentLesson - 1);

    }

});

// ==========================================
// NEXT BUTTON
// ==========================================

elements.nextBtn.addEventListener("click", () => {

    if (currentLesson < lessons.length - 1) {

        showLesson(currentLesson + 1);

    }

});

// ==========================================
// RESET CAMERA
// ==========================================

elements.resetCamera.addEventListener("click", () => {

    if (worldControls) {
        worldControls.resetCamera();
    }

});

// ==========================================
// INITIALIZE 3D WORLD
// ==========================================

function initializeWorld() {

    try {

        worldControls = initSoftwareWorld({

            container: elements.world,

            onSelect: (index) => {

                showLesson(index, false);

            }

        });

        if (elements.loading) {
            elements.loading.style.display = "none";
        }

    } catch (error) {

        console.error(
            "Erreur lors du chargement du monde 3D :",
            error
        );

        if (elements.loading) {

            elements.loading.textContent =
                "Impossible de charger le monde 3D. Vérifiez votre connexion Internet.";

        }

    }

}

// ==========================================
// START APPLICATION
// ==========================================

showLesson(0, false);

updateProgress();

initializeWorld();
