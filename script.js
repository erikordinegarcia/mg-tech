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

// =====================================================
// FAQ — ACORDEÃO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const estaAberto = item.classList.contains("active");

      // Fecha todos os outros itens
      faqItems.forEach((outroItem) => {
        outroItem.classList.remove("active");
        outroItem.querySelector(".faq-answer").style.maxHeight = null;
      });

      // Se o clicado já estava aberto, deixa fechado (toggle).
      // Se estava fechado, abre.
      if (!estaAberto) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});
