// ===== MODO OSCURO =====
const root = document.documentElement;
const themeBtn = document.getElementById('btn-theme');

// Si el usuario no guardó preferencia, usa la del sistema
const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const startDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark;

if (startDark) {
  root.classList.add('dark');
  if (themeBtn) themeBtn.setAttribute('aria-pressed', 'true');
}

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    themeBtn.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ===== VOLVER ARRIBA =====
const toTopBtn = document.getElementById('to-top');
if (toTopBtn) {
  const onScroll = () => {
    toTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== FORMULARIO  =====

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = (form.nombre?.value || '').trim();
    const email   = (form.email?.value || '').trim();
    const mensaje = (form.mensaje?.value || '').trim();
    const status  = document.getElementById('form-status');

    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!nombre || !emailOK || !mensaje) {
      if (status) {
        status.textContent = 'Por favor completa todos los campos con un email válido.';
        status.style.color = 'crimson';
      }
      return;
    }

    if (status) {
      status.textContent = '¡Listo! Abriendo tu gestor de correo…';
      status.style.color = 'seagreen';
    }

    // Correo destino: toma del atributo data-to del formulario; si no, usa el propio por defecto
    const to = form.getAttribute('data-to') || 'pablodavidgomezv@gmail.com';
    const subject = encodeURIComponent(`Contacto CV — ${nombre}`);
    const body    = encodeURIComponent(`${mensaje}\n\n${nombre} — ${email}`);

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    form.reset();
  });
}




// ===== Acordeón (solo uno abierto) =====
const toggles = Array.from(document.querySelectorAll('.acc-toggle'));
const panels  = toggles.map(btn => document.getElementById(btn.getAttribute('aria-controls')));

// Cierra todas
function closeAll() {
  toggles.forEach((btn, i) => {
    btn.setAttribute('aria-expanded', 'false');
    if (panels[i]) panels[i].hidden = true;
  });
}

// Abrir una
function openOne(idx) {
  toggles[idx].setAttribute('aria-expanded', 'true');
  if (panels[idx]) panels[idx].hidden = false;
}

// Click: cierra otras y abre la seleccionada (o cierra si ya estaba abierta)
toggles.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    closeAll();
    if (!isOpen) openOne(idx);
  });
});

//  abre la primera por defecto
// if (toggles.length) openOne(0);





// ===== HOVER EN PROYECTOS/IMÁGENES =====
const cards = Array.from(document.querySelectorAll('.project-card'));

cards.forEach(card => {
  
  let overlay = card.querySelector('.hover-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'hover-overlay';
   // overlay.textContent = card.getAttribute('data-title') || 'Ver proyecto';
    card.appendChild(overlay);
  }

  // Accesibilidad con teclado: que la tarjeta sea focusable
  if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button'); // semántica interactiva

  const enter = () => card.classList.add('is-hover');
  const leave = () => card.classList.remove('is-hover');

  card.addEventListener('mouseenter', enter);
  card.addEventListener('mouseleave', leave);
  card.addEventListener('focus', enter);
  card.addEventListener('blur', leave);

  // Efecto leve parallax con el mouse
  let rect = null;
  const onMove = (e) => {
    if (!rect) rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Rotación sutil
    card.style.transform = `rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-2px) scale(1.01)`;
  };
  const resetTilt = () => { card.style.transform = ''; rect = null; };

  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', resetTilt);
  card.addEventListener('blur', resetTilt);

  // Enter/Space simulan click 
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click?.();
    }
  });
});

// ===== (OPCIONAL) REVELAR AL HACER SCROLL =====
const io = ('IntersectionObserver' in window)
  ? new IntersectionObserver(entries => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          ent.target.style.opacity = '1';
          ent.target.style.transform = 'none';
          io.unobserve(ent.target);
        }
      }
    }, { threshold: 0.15 })
  : null;

if (io) {
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(12px)';
    c.style.transition = 'opacity .28s ease, transform .28s ease';
    io.observe(c);
  });
}





// === Botón de menú accesible ===
const menuBtn = document.getElementById('btn-menu');
if (menuBtn) {
  const closeMenu = () => menuBtn.setAttribute('aria-expanded', 'false');

  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
  });

  // Cerrar con Escape
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Cerrar al pasar a desktop
  window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
}
