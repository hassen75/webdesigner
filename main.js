document.addEventListener('DOMContentLoaded', function () {
  
  // --- Sticky Header Logic (Ajoute/retire la classe 'on-hero') ---
  const header = document.querySelector('.site-header');
  const heroSection = document.getElementById('hero-aprilford');

  function checkHeaderPosition() {
    if (header && heroSection) {
      // Détermine si le défilement est en haut de la section Hero.
      // Si la position de défilement est inférieure à la hauteur du Hero moins la hauteur du Header
      if (window.scrollY < heroSection.offsetHeight - header.offsetHeight) {
        header.classList.add('on-hero');
      } else {
        header.classList.remove('on-hero');
      }
    }
  }

  // Active la vérification au chargement et au défilement
  if (header && heroSection) {
      // Vérifie immédiatement au chargement (pour l'affichage initial)
      checkHeaderPosition(); 
      // Écoute l'événement de défilement
      window.addEventListener('scroll', checkHeaderPosition);
  }


  // --- Menu burger (Finalisé et stable) ---
  const burger = document.getElementById('nav-toggle'); // Cible l'ID du bouton
  const nav = document.getElementById('main-nav');     // Cible l'ID de la nav

  if (burger && nav && header) {
    // ⚠️ Le clic sur le burger active/désactive la classe 'nav-open' sur le HEADER
    burger.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      // Bloque le défilement du body quand le menu est ouvert (utile sur mobile)
      document.body.style.overflowY = isOpen ? 'hidden' : 'auto'; 
    });

    // Fermer le menu quand on clique un lien (utile sur mobile)
    nav.addEventListener('click', (e) => {
      const t = e.target;
      // Vérifie si l'élément cliqué est un lien <a>
      if (t && t.matches && t.matches('a')) {
        header.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflowY = 'auto';
      }
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflowY = 'auto';
      }
    });
  }

  // --- Filtres Portfolio (Isotope/class-based filtering) ---
  const projectContainer = document.getElementById('projects');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (projectContainer && filterBtns.length) {
    // Aucune bibliothèque n'étant utilisée (Isotope, etc.), nous ferons un filtrage simple par classes.
    filterBtns.forEach(button => {
        button.addEventListener('click', function() {
            // 1. Mise à jour du bouton actif
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // 2. Récupération du filtre
            const filterValue = this.getAttribute('data-filter');

            // 3. Filtrage
            const projects = projectContainer.querySelectorAll('.project-card');
            projects.forEach(project => {
                const category = project.getAttribute('data-category');
                
                // Afficher tous les projets si le filtre est '*'
                if (filterValue === '*' || category === filterValue) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });
  }
  
  // --- Formulaire de Contact EmailJS ---
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const honey = document.querySelector('input.honeypot');

  function flash(msg, color) {
    if (!status) return;
    status.textContent = msg;
    status.style.color = color || 'inherit';
    setTimeout(() => { if (status.textContent === msg) status.textContent = ''; }, 6000);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (honey && honey.value.trim() !== '') return; // bot probable

      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        flash('Merci de remplir tous les champs.', 'tomato');
        return;
      }

      if (typeof emailjs === 'undefined') {
        console.warn("EmailJS n'est pas chargé.");
        flash("EmailJS indisponible. Écrivez-moi : mokdadhassen@yahoo.fr", 'orange');
        return;
      }

      flash('Envoi en cours...', 'orange');

      // ⚠️ ASSUREZ-VOUS QUE CES CLÉS SONT CORRECTES (SERVICE ID, TEMPLATE ID, PUBLIC KEY)
      emailjs.sendForm("service_nkgb4gz", "template_d64o7zg", form, "d95wJ_P4d216f40W7")
        .then(function() {
          flash('Message envoyé avec succès !', 'green');
          form.reset();
        }, function(error) {
          console.error('Échec de l\'envoi:', error);
          flash('Erreur lors de l\'envoi du message.', 'tomato');
        });
    });
  }
});
