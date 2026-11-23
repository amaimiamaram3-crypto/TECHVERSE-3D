
import {
    lessons,
    initPythonWorld,
    selectWorldStation
} from "./python-world.js";

// ==========================================
// IT WORLD 3D - GESTION DE L'ACADÉMIE PYTHON
// ==========================================

// ==========================================
// ÉLÉMENTS HTML
// ==========================================

const getElement = id => document.getElementById(id);

const elements = {
    progressText: getElement("progressText"),
    progressBar: getElement("progressBar"),
    progressDescription: getElement("progressDescription"),

    lessonCounter: getElement("lessonCounter"),
    lessonIcon: getElement("lessonIcon"),
    lessonCategory: getElement("lessonCategory"),
    lessonTitle: getElement("lessonTitle"),
    lessonDescription: getElement("lessonDescription"),
    lessonExplanation: getElement("lessonExplanation"),
    lessonCode: getElement("lessonCode"),
    copyCode: getElement("copyCode"),
    lessonOutput: getElement("lessonOutput"),
    lessonTip: getElement("lessonTip"),

    quizQuestion: getElement("quizQuestion"),
    quizOptions: getElement("quizOptions"),
    quizFeedback: getElement("quizFeedback"),

    previousBtn: getElement("previousBtn"),
    nextBtn: getElement("nextBtn"),
    resetCamera: getElement("resetCamera"),

    pythonWorld: getElement("pythonWorld"),
    loadingMessage: getElement("loadingMessage")
};

// ==========================================
// VÉRIFICATION DES ÉLÉMENTS
// ==========================================

if (!elements.pythonWorld) {
    throw new Error("Conteneur pythonWorld introuvable !");
}

// ==========================================
// VARIABLES
// ==========================================

let currentLesson = 0;

const completedLessons = new Set();

let selectedAnswer = null;
let quizValidated = false;
let worldController = null;

// ==========================================
// AFFICHER UNE LEÇON
// ==========================================

function showLesson(index) {
    if (index < 0 || index >= lessons.length) return;

    currentLesson = index;

    const lesson = lessons[index];

    selectedAnswer = null;
    quizValidated = false;

    // Informations de la leçon
    if (elements.lessonCounter) {
        elements.lessonCounter.textContent =
            `LEÇON ${index + 1} / ${lessons.length}`;
    }

    if (elements.lessonIcon) {
        elements.lessonIcon.textContent = lesson.icon;
    }

    if (elements.lessonCategory) {
        elements.lessonCategory.textContent = lesson.category;
    }

    if (elements.lessonTitle) {
        elements.lessonTitle.textContent = lesson.title;
    }

    if (elements.lessonDescription) {
        elements.lessonDescription.textContent = lesson.description;
    }

    if (elements.lessonExplanation) {
        elements.lessonExplanation.textContent = lesson.explanation;
    }

    if (elements.lessonCode) {
        elements.lessonCode.textContent = lesson.code;
    }

    if (elements.lessonOutput) {
        elements.lessonOutput.textContent = lesson.output;
    }

    if (elements.lessonTip) {
        elements.lessonTip.textContent = lesson.tip;
    }

    // Quiz
    if (elements.quizQuestion) {
        elements.quizQuestion.textContent = lesson.question;
    }

    if (elements.quizFeedback) {
        elements.quizFeedback.textContent = "";
        elements.quizFeedback.className = "";
    }

    displayQuizOptions(lesson);

    // Navigation
    if (elements.previousBtn) {
        elements.previousBtn.disabled = index === 0;
    }

    if (elements.nextBtn) {
        elements.nextBtn.textContent =
            index === lessons.length - 1
                ? "Terminer le parcours"
                : "Leçon suivante →";
    }

    // Menu des leçons
    updateLessonMenu();

    // Progression
    updateProgress();

    // Mettre à jour la station 3D
    selectWorldStation(index);

    // Défilement vers le début de la leçon
    const lessonPanel = document.querySelector(".lesson-panel");

    if (lessonPanel) {
        lessonPanel.scrollTop = 0;
    }
}

// ==========================================
// AFFICHER LES RÉPONSES DU QUIZ
// ==========================================

function displayQuizOptions(lesson) {
    const quizContainer = elements.quizOptions;

    if (!quizContainer) return;

    quizContainer.innerHTML = "";

    lesson.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            chooseAnswer(index);
        });

        quizContainer.appendChild(button);
    });
}

// ==========================================
// CHOISIR UNE RÉPONSE
// ==========================================

function chooseAnswer(index) {
    if (quizValidated) return;

    selectedAnswer = index;

    const buttons = elements.quizOptions?.querySelectorAll(
        ".quiz-option"
    );

    buttons?.forEach((button, buttonIndex) => {
        button.classList.toggle(
            "selected",
            buttonIndex === index
        );
    });

    validateAnswer();
}

// ==========================================
// VÉRIFIER LA RÉPONSE
// ==========================================

function validateAnswer() {
    if (selectedAnswer === null || quizValidated) return;

    const lesson = lessons[currentLesson];

    const buttons = elements.quizOptions?.querySelectorAll(
        ".quiz-option"
    );

    const isCorrect = selectedAnswer === lesson.answer;

    quizValidated = true;

    buttons?.forEach((button, index) => {
        button.disabled = true;

        if (index === lesson.answer) {
            button.classList.add("correct");
        } else if (index === selectedAnswer && !isCorrect) {
            button.classList.add("incorrect");
        }
    });

    if (elements.quizFeedback) {
        if (isCorrect) {
            elements.quizFeedback.textContent =
                "✓ Bonne réponse ! " + lesson.feedback;

            elements.quizFeedback.className = "quiz-feedback success";

            completedLessons.add(currentLesson);
            updateProgress();
            updateLessonMenu();
        } else {
            elements.quizFeedback.textContent =
                "✗ Ce n'est pas la bonne réponse. Réessayez dans cette leçon après avoir consulté l'explication.";

            elements.quizFeedback.className = "quiz-feedback error";
        }
    }
}

// ==========================================
// METTRE À JOUR LE MENU DES LEÇONS
// ==========================================

function updateLessonMenu() {
    const items = document.querySelectorAll(
        ".lesson-item[data-lesson]"
    );

    items.forEach(item => {
        const index = Number(item.dataset.lesson);

        item.classList.toggle(
            "active",
            index === currentLesson
        );

        item.classList.toggle(
            "completed",
            completedLessons.has(index)
        );

        const existingMark = item.querySelector(".completion-mark");

        if (existingMark) {
            existingMark.remove();
        }

        if (completedLessons.has(index)) {
            const mark = document.createElement("span");

            mark.className = "completion-mark";
            mark.textContent = " ✓";

            item.appendChild(mark);
        }
    });
}

// ==========================================
// METTRE À JOUR LA PROGRESSION
// ==========================================

function updateProgress() {
    const completed = completedLessons.size;

    const percentage = Math.round(
        (completed / lessons.length) * 100
    );

    if (elements.progressText) {
        elements.progressText.textContent =
            `${percentage}%`;
    }

    if (elements.progressBar) {
        elements.progressBar.style.width =
            `${percentage}%`;
    }

    if (elements.progressDescription) {
        if (percentage === 100) {
            elements.progressDescription.textContent =
                "Félicitations ! Vous avez terminé toutes les leçons.";
        } else if (completed === 0) {
            elements.progressDescription.textContent =
                "Commencez votre première leçon !";
        } else {
            elements.progressDescription.textContent =
                `${completed} leçon(s) terminée(s) sur ${lessons.length}.`;
        }
    }
}

// ==========================================
// LEÇON PRÉCÉDENTE
// ==========================================

elements.previousBtn?.addEventListener("click", () => {
    if (currentLesson > 0) {
        showLesson(currentLesson - 1);
    }
});

// ==========================================
// LEÇON SUIVANTE
// ==========================================

elements.nextBtn?.addEventListener("click", () => {
    if (currentLesson < lessons.length - 1) {
        showLesson(currentLesson + 1);
    } else {
        if (completedLessons.size === lessons.length) {
            if (elements.lessonTitle) {
                elements.lessonTitle.textContent =
                    "Félicitations !";
            }

            if (elements.lessonDescription) {
                elements.lessonDescription.textContent =
                    "Vous avez terminé le parcours d'initiation à Python.";
            }
        } else {
            showLesson(0);
        }
    }
});

// ==========================================
// SÉLECTION DEPUIS LE MENU
// ==========================================

document.querySelectorAll(
    ".lesson-item[data-lesson]"
).forEach(item => {
    item.addEventListener("click", () => {
        const index = Number(item.dataset.lesson);

        showLesson(index);
    });
});

// ==========================================
// COPIER LE CODE PYTHON
// ==========================================

elements.copyCode?.addEventListener("click", async () => {
    const code = lessons[currentLesson].code;

    try {
        await navigator.clipboard.writeText(code);

        elements.copyCode.textContent = "Copié !";

        setTimeout(() => {
            elements.copyCode.textContent = "Copier";
        }, 1500);

    } catch (error) {
        // Solution de secours
        const textArea = document.createElement("textarea");

        textArea.value = code;
        document.body.appendChild(textArea);

        textArea.select();
        document.execCommand("copy");

        textArea.remove();

        elements.copyCode.textContent = "Copié !";

        setTimeout(() => {
            elements.copyCode.textContent = "Copier";
        }, 1500);
    }
});

// ==========================================
// RÉINITIALISER LA CAMÉRA 3D
// ==========================================

elements.resetCamera?.addEventListener("click", () => {
    if (worldController?.resetCamera) {
        worldController.resetCamera();
    }
});

// ==========================================
// INITIALISER LE MONDE 3D
// ==========================================

function initializePythonWorld() {
    try {
        worldController = initPythonWorld({
            container: elements.pythonWorld,

            onSelect: index => {
                showLesson(index);
            }
        });

        if (elements.loadingMessage) {
            elements.loadingMessage.style.display = "none";
        }

    } catch (error) {
        console.error(
            "Erreur lors du chargement du monde Python :",
            error
        );

        if (elements.loadingMessage) {
            elements.loadingMessage.textContent =
                "Impossible de charger le monde 3D. Vérifiez votre connexion Internet.";
        }
    }
}

// ==========================================
// INITIALISATION
// ==========================================

function initializeApplication() {
    document.documentElement.lang = "fr";

    // Afficher la première leçon
    showLesson(0);

    // Créer le monde 3D
    initializePythonWorld();
}

initializeApplication();

