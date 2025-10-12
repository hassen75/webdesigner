document.addEventListener('DOMContentLoaded', function () {
    // --- Gestion du Thème (Dark/Light Mode) ---
    const body = document.body;
    const toggle = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');

    // Applique le thème sauvegardé, ou le mode sombre par défaut
    if (saved === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.add('dark-mode');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    // --- Menu Burger ---
    const burger = document.getElementById('burger');
    const nav = document.getElementById('main-nav');
    if (burger) {
        burger.addEventListener('click', () => nav.classList.toggle('open'));
    }

    // --- Filtre de Projets ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
        // Active le bouton cliqué
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const f = btn.dataset.filter;

        // Filtre les projets (ce code devrait maintenant fonctionner)
        projects.forEach(p => {
            const isVisible = f === '*' || p.dataset.category === f;
            p.style.display = isVisible ? '' : 'none';
        });
    }));

    // --- Gestion du Formulaire de Contact (EmailJS) ---
    // Cette section a été unifiée pour éviter la double soumission et les erreurs.
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (form && typeof emailjs !== 'undefined') {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const fd = new FormData(form);

            // 1. Validation locale des champs requis
            if (!fd.get('name') || !fd.get('email') || !fd.get('message')) {
                status.textContent = 'Merci de remplir tous les champs.';
                status.style.color = 'tomato';
                setTimeout(() => { status.textContent = ""; }, 5000);
                return;
            }

            // Affiche l'état d'envoi
            status.textContent = 'Envoi en cours...';
            status.style.color = 'orange';

            // 2. Envoi via EmailJS (Utilisez vos clés EmailJS)
            emailjs.sendForm("service_nkgb4gz", "template_8ji7se4", this, "WbzOTI6oQfjkK_62D")
                .then(() => {
                    status.innerText = "✅ Message envoyé avec succès !";
                    status.style.color = "green";
                    form.reset();
                    setTimeout(() => { status.innerText = ""; }, 5000);
                })
                .catch((error) => {
                    console.error("Erreur EmailJS:", error);
                    status.innerText = "❌ Erreur lors de l’envoi. Veuillez réessayer ou contacter directement.";
                    status.style.color = "red";
                    setTimeout(() => { status.innerText = ""; }, 8000);
                });
        });
    } else if (form) {
        // Message si EmailJS n'est pas chargé (vérifiez l'inclusion dans l'HTML)
        console.warn("EmailJS n'est pas chargé. Le formulaire de contact ne fonctionnera pas.");
    }
});