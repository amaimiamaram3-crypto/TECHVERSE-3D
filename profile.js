
const STORAGE_KEY = "itworldProfile";

function getProfile() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        name: "Apprenant",
        totalPoints: 0,
        bestScore: 0,
        quizCompleted: 0
    };
}

function saveProfile(profile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function updateProfile() {
    const profile = getProfile();

    document.getElementById("userName").textContent = profile.name;

    document.getElementById("totalPoints").textContent =
        profile.totalPoints;

    document.getElementById("quizCompleted").textContent =
        profile.quizCompleted;

    document.getElementById("bestScore").textContent =
        `${profile.bestScore} / 60`;

    let level = "Débutant";

    if (profile.totalPoints >= 100) {
        level = "Expert";
    } else if (profile.totalPoints >= 40) {
        level = "Intermédiaire";
    }

    document.getElementById("userLevel").textContent = level;

    const percentage = Math.min(
        100,
        Math.round((profile.bestScore / 60) * 100)
    );

    document.getElementById("progressPercent").textContent =
        percentage + "%";

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("progressMessage").textContent =
        profile.quizCompleted === 0
            ? "Terminez votre premier quiz pour commencer votre progression."
            : `Vous avez terminé ${profile.quizCompleted} quiz. Continuez vos efforts !`;

    if (profile.quizCompleted > 0) {
        document.getElementById("badgeBeginner").classList.remove("locked");
    }

    if (profile.bestScore >= 60) {
        document.getElementById("badgeHardware").classList.remove("locked");
        document.getElementById("badgePerfect").classList.remove("locked");
    }
}

// Modifier le nom
document.getElementById("editNameBtn").addEventListener("click", () => {
    const profile = getProfile();

    const newName = prompt("Entrez votre nom :", profile.name);

    if (newName && newName.trim()) {
        profile.name = newName.trim();
        saveProfile(profile);
        updateProfile();
    }
});

// Réinitialiser les statistiques
document.getElementById("resetProfileBtn").addEventListener("click", () => {
    const confirmation = confirm(
        "Voulez-vous vraiment réinitialiser toutes vos statistiques ?"
    );

    if (confirmation) {
        localStorage.removeItem(STORAGE_KEY);
        updateProfile();
    }
});

updateProfile();
