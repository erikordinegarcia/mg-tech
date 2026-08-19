/* =====================================================
   MENU MOBILE
===================================================== */

const nav = document.querySelector('.nav');

const menuToggle = document.querySelector('.menu-toggle');

const navLinks = document.querySelectorAll('.nav-links a');

/* Abrir / fechar menu */

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('menu-open');

  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

/* Fechar menu ao clicar */

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('menu-open');

    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

/* =====================================================
   ANIMAÇÕES AO ENTRAR NA TELA
===================================================== */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

document.querySelectorAll('.reveal').forEach((element) => {
  observer.observe(element);
});

/* =====================================================
   MENU ATIVO
===================================================== */

const sections = document.querySelectorAll('main section[id]');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;

    if (window.scrollY >= sectionTop - 180) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute('href');

    link.classList.toggle('active', target === `#${current}`);
  });
});
