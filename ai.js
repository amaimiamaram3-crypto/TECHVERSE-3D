
import {
    lessons,
    initAIWorld,
    selectWorldStation
} from "./ai-world.js";

// ==========================================
// IA WORLD - MAIN JAVASCRIPT
// ==========================================

const elements = {
    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    progressDescription: document.getElementById("progressDescription"),

    lessonItems: document.querySelectorAll(".lesson-item"),

    world: document.getElementById("aiWorld"),
    loading: document.getElementById("loadingMessage"),

    category: document.getElementById("lessonCategory"),
    icon: document.getElementById("lessonIcon"),
    title: document.getElementById("lessonTitle"),
    description: document.getElementById("lessonDescription"),
    explanation: document.getElementById("lessonExplanation"),
    example: document.getElementById("lessonExample"),

    quizQuestion: document.getElementById("quizQuestion"),
    quizOptions: document.getElementById("quizOptions"),
    quizFeedback: document.getElementById("quizFeedback"),

    previousBtn: document.getElementById("previousBtn"),
    nextBtn: document.getElementById("nextBtn"),
    resetCamera: document.getElementById("resetCamera")
};

// ==========================================
// VARIABLES
// ==========================================

let currentLesson = 0;

let completedLessons = new Set();

let answeredLessons = new Set();

let worldControls = null;

// ==========================================
// CHECK HTML ELEMENTS
// ==========================================

for (const [name, element] of Object.entries(elements)) {

    if (!element) {
        console.error("Élément HTML introuvable :", name);
    }

}

if (!elements.world) {
    throw new Error("Conteneur aiWorld introuvable !");
}

// ==========================================
// UPDATE PROGRESS
// ==========================================

function updateProgress() {

    const total = lessons.length;

    const completed = completedLessons.size;

    const percentage = Math.round(
        (completed / total) * 100
    );

    elements.progressText.textContent =
        percentage + "%";

    elements.progressBar.style.width =
        percentage + "%";

    if (completed === 0) {

        elements.progressDescription.textContent =
            "Commencez votre première leçon !";

    } else if (completed === total) {

        elements.progressDescription.textContent =
            "Félicitations ! Toutes les leçons sont terminées 🎉";

    } else {

        elements.progressDescription.textContent =
            `${completed} leçon(s) terminée(s) sur ${total}`;

    }

    // Update lesson menu

    elements.lessonItems.forEach((item, index) => {

        item.classList.toggle(
            "completed",
            completedLessons.has(index)
        );

        if (completedLessons.has(index)) {

            item.classList.add("completed");

        }

    });

}

// ==========================================
// DISPLAY QUIZ
// ==========================================

function displayQuiz(lesson) {

    elements.quizQuestion.textContent =
        lesson.question;

    elements.quizOptions.innerHTML = "";

    elements.quizFeedback.textContent = "";

    const alreadyAnswered =
        answeredLessons.has(currentLesson);

    lesson.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "quiz-option";

        button.textContent = option;

        button.type = "button";

        if (alreadyAnswered) {

            button.disabled = true;

            if (index === lesson.answer) {

                button.style.borderColor = "#38b985";
                button.style.background = "#eaf8f1";

            }

        } else {

            button.addEventListener("click", () => {

                checkAnswer(index, lesson);

            });

        }

        elements.quizOptions.appendChild(button);

    });

    if (alreadyAnswered) {

        elements.quizFeedback.textContent =
            "Leçon déjà validée ✓";

        elements.quizFeedback.style.color = "#29966c";

    }

}

// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(selectedIndex, lesson) {

    if (answeredLessons.has(currentLesson)) return;

    const buttons =
        elements.quizOptions.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (selectedIndex === lesson.answer) {

        completedLessons.add(currentLesson);

        answeredLessons.add(currentLesson);

        elements.quizFeedback.textContent =
            "Bonne réponse ! Excellent travail 🎉";

        elements.quizFeedback.style.color =
            "#29966c";

        buttons[selectedIndex].style.borderColor =
            "#38b985";

        buttons[selectedIndex].style.background =
            "#eaf8f1";

        updateProgress();

    } else {

        elements.quizFeedback.textContent =
            "Réponse incorrecte. Essayez de relire la leçon et de réessayer.";

        elements.quizFeedback.style.color =
            "#d65b6b";

        buttons[selectedIndex].style.borderColor =
            "#e46b79";

        buttons[selectedIndex].style.background =
            "#fff0f1";

        buttons.forEach((button, index) => {

            if (index === lesson.answer) {

                button.style.borderColor = "#38b985";
                button.style.background = "#eaf8f1";

            }

        });

        // Allow another attempt

        setTimeout(() => {

            if (currentLesson !== lessons.indexOf(lesson)) return;

            answeredLessons.delete(currentLesson);

            displayQuiz(lesson);

        }, 1300);

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

    elements.category.textContent =
        lesson.category;

    elements.icon.textContent =
        lesson.icon;

    elements.title.textContent =
        lesson.title;

    elements.description.textContent =
        lesson.description;

    elements.explanation.textContent =
        lesson.explanation;

    elements.example.textContent =
        lesson.example;

    // Quiz

    displayQuiz(lesson);

    // Active menu item

    elements.lessonItems.forEach((item, itemIndex) => {

        item.classList.toggle(
            "active",
            itemIndex === index
        );

    });

    // Navigation buttons

    elements.previousBtn.disabled = index === 0;

    elements.nextBtn.disabled =
        index === lessons.length - 1;

    elements.nextBtn.textContent =
        index === lessons.length - 1
            ? "Dernière leçon"
            : "Leçon suivante →";

    // Update 3D world

    if (updateWorld) {

        selectWorldStation(index);

    }

}

// ==========================================
// LESSON MENU
// ==========================================

elements.lessonItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        showLesson(index);

    });

});

// ==========================================
// PREVIOUS LESSON
// ==========================================

elements.previousBtn.addEventListener("click", () => {

    if (currentLesson > 0) {

        showLesson(currentLesson - 1);

    }

});

// ==========================================
// NEXT LESSON
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

        worldControls = initAIWorld({

            container: elements.world,

            onSelect: (index) => {

                // false avoids updating the 3D world twice

                showLesson(index, false);

            }

        });

        elements.loading.style.display = "none";

    } catch (error) {

        console.error("Erreur IA World :", error);

        elements.loading.style.display = "grid";

        elements.loading.textContent =
            "Impossible de charger le monde 3D. Vérifiez votre connexion Internet.";

    }

}

// ==========================================
// START APPLICATION
// ==========================================

showLesson(0, false);

updateProgress();

initializeWorld();
