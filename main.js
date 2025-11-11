document.addEventListener('DOMContentLoaded', function () {
  
  // --- Sticky Header Logic (Ajoute/retire la classe 'on-hero') ---
  const header = document.querySelector('.site-header');
  const heroSection = document.getElementById('hero-aprilford');

  function checkHeaderPosition() {
    if (header && heroSection) {
      if (window.scrollY < heroSection.offsetHeight - header.offsetHeight) {
        header.classList.add('on-hero');
      } else {
        header.classList.remove('on-hero');
      }
    }
  }

  // Active la vérification au chargement et au défilement
  if (header && heroSection) {
      checkHeaderPosition(); 
      window.addEventListener('scroll', checkHeaderPosition);
  }


  // ⚠️ NOUVEAU: Logique de Menu Burger Simplifiée
  const burgerBtn = document.getElementById('nav-toggle'); // Mis à jour
  const navElement = document.getElementById('site-nav');     // Mis à jour

  if (burgerBtn && header && navElement) {
    burgerBtn.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      burgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Fermer le menu quand on clique un lien
    navElement.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        header.classList.remove('nav-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Optionnel: Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }


  // --- Filtres portfolio (Logiciel existant conservé) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  if (filterBtns.length && projects.length) {
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');

      const f = btn.dataset.filter;
      projects.forEach(p => {
        const isVisible = f === '*' || p.dataset.category === f;
        p.style.display = isVisible ? '' : 'none';
      });
    }));
  }

  // --- Formulaire (EmailJS optionnel + honeypot + messages) ---
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
      emailjs.sendForm("service_nkgb4gz", "template_8ji7se4", this, "WbzOTI6oQfjkK_62D")
        .then(() => { flash("✅ Message envoyé avec succès !", 'green'); form.reset(); })
        .catch((error) => { console.error("Erreur EmailJS:", error); flash("❌ Erreur d’envoi. Réessayez ou contactez-moi directement.", 'red'); });
    });
  }
});
