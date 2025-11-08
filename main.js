document.addEventListener('DOMContentLoaded', function () {
  
  // --- Menu burger (null-safe partout) ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('main-nav');

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  function openNav() {
    if (!nav || !burger) return;
    nav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
  }

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Fermer la nav quand on clique sur un lien
    nav.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.matches && t.matches('a')) closeNav();
    });

    // Fermer la nav quand on clique en dehors
    document.addEventListener('click', (e) => {
      if (!nav || !burger) return;
      const target = e.target;
      if (target !== burger && !(nav.contains && nav.contains(target))) closeNav();
    });

    // Fermer la nav avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  // --- Filtres portfolio ---
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
