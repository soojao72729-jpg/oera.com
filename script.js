/* ======================================================
   OERA AGENCY — JavaScript
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
  });

  /* ── ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }

  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  /* ── PARTICLE CANVAS ── */
  const canvas = document.getElementById('particlesCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.gold = Math.random() > 0.7;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(201,168,76,${this.opacity})`
        : `rgba(255,255,255,${this.opacity * 0.5})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ── COUNTER ANIMATION ── */
  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;
  function checkCounters() {
    if (countersStarted) return;
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      counterEls.forEach(el => animateCounter(el, parseInt(el.dataset.target)));
    }
  }
  window.addEventListener('scroll', checkCounters);
  setTimeout(checkCounters, 1500);

  /* ── SCROLL REVEAL ── */
  const revealElements = document.querySelectorAll(
    '.service-card, .team-card, .contact-info-card, .about-stat-card, .value-chip, .mission-box'
  );
  revealElements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });

  document.querySelector('.about-content')?.classList.add('reveal-right');
  document.querySelector('.about-visual')?.classList.add('reveal-left');
  document.querySelector('.contact-info')?.classList.add('reveal-left');
  document.querySelector('.contact-form')?.classList.add('reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

  /* ── CONTACT FORM ── */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    submitText.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate sending
    setTimeout(() => {
      form.reset();
      submitText.textContent = 'Send Message';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });

  /* ── 3D TILT ON SERVICE CARDS ── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── SMOOTH NAV CLICK ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── GLARE EFFECT ON ABOUT CARD ── */
  const aboutCard = document.querySelector('.about-card-inner');
  if (aboutCard) {
    document.querySelector('.about-card-3d')?.addEventListener('mousemove', e => {
      const rect = aboutCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      aboutCard.style.transform = `rotateY(${(x - 0.5) * 20}deg) rotateX(${(0.5 - y) * 10}deg)`;
    });
    document.querySelector('.about-card-3d')?.addEventListener('mouseleave', () => {
      aboutCard.style.transform = 'rotateY(-8deg) rotateX(4deg)';
    });
  }
});
