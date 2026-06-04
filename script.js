(function() {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==================== PARTICLES ====================
  function createParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = 40;
    let animId;
    let running = true;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        a: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(233, 69, 96, ' + p.a + ')';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(233, 69, 96, ' + (0.06 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    // Pause particles when hero is off-screen
    const hero = document.getElementById('top');
    if (hero && !prefersReducedMotion) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          running = entry.isIntersecting;
          if (running) {
            animId = requestAnimationFrame(draw);
          } else {
            cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0 });
      observer.observe(hero);
    }

    if (!prefersReducedMotion) {
      draw();
    }
  }

  // ==================== TYPING EFFECT ====================
  function startTyping() {
    if (prefersReducedMotion) return;
    const el = document.getElementById('typed-text');
    if (!el) return;
    const strings = [
      'We build systems that grow your business',
      'Building Kenya\'s Digital Future',
      'Code. Innovate. Deploy.',
      'Powering African Innovation'
    ];
    let strIndex = 0;
    let charIndex = el.textContent.length;
    let isDeleting = false;
    const speed = 80;

    function type() {
      const current = strings[strIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          strIndex = (strIndex + 1) % strings.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 40);
      } else {
        el.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, speed);
      }
    }

    el.classList.add('typing');
    setTimeout(type, 1500);
  }

  // ==================== HERO SHOWCASE CAROUSEL ====================
  function setupHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    const track = document.getElementById('heroTrack');
    if (!track) return;
    const slides = track.querySelectorAll('.showcase-slide');
    if (slides.length < 2) return;
    const dotsContainer = document.getElementById('heroDots');
    if (!dotsContainer) return;

    slides.forEach(function(_, i) {
      const dot = document.createElement('span');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function() { goTo(i); });
      dot.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
      dotsContainer.appendChild(dot);
    });

    let index = 0;
    const total = slides.length;
    let timer;

    function goTo(i) {
      if (i === index) return;
      index = i;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      const dots = dotsContainer.children;
      for (let d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('active', d === index);
      }
      resetTimer();
    }

    function next() { goTo((index + 1) % total); }
    function prev() { goTo((index - 1 + total) % total); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 4500);
    }

    const nextBtn = carousel.querySelector('.showcase-next');
    const prevBtn = carousel.querySelector('.showcase-prev');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    if (!prefersReducedMotion) {
      timer = setInterval(next, 4500);
    }
  }

  // ==================== ABOUT CAROUSEL ====================
  function setupAboutCarousel() {
    const carousel = document.getElementById('aboutCarousel');
    if (!carousel) return;
    const track = document.getElementById('aboutTrack');
    if (!track) return;
    const slides = track.querySelectorAll('.about-slide');
    if (slides.length < 2) return;
    const dotsContainer = document.getElementById('aboutDots');
    if (!dotsContainer) return;

    slides.forEach(function(_, i) {
      const dot = document.createElement('span');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function() { goTo(i); });
      dot.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
      dotsContainer.appendChild(dot);
    });

    let index = 0;
    const total = slides.length;
    let timer;

    function goTo(i) {
      if (i === index) return;
      index = i;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      const dots = dotsContainer.children;
      for (let d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('active', d === index);
      }
      resetTimer();
    }

    function next() { goTo((index + 1) % total); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 4000);
    }

    if (!prefersReducedMotion) {
      timer = setInterval(next, 4000);
    }
  }

  // ==================== SCROLL REVEAL ====================
  function observeFadeIn() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function(el) { observer.observe(el); });
  }

  // ==================== COUNTER ANIMATION ====================
  function animateCounters() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.stat-number').forEach(function(el) {
        el.textContent = el.getAttribute('data-target');
      });
      return;
    }
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          let current = 0;
          const step = Math.ceil(target / 50);
          const timer = setInterval(function() {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current;
          }, 30);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el) { observer.observe(el); });
  }

  // ==================== MOBILE MENU ====================
  function setupMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav-menu');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        nav.classList.remove('open');
      });
    });
  }

  // ==================== FORM HANDLER ====================
  function setupForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      const data = new FormData(form);
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Sending...';
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function(res) {
        if (res.ok) {
          btn.innerHTML = '&#10003; Message Sent!';
          btn.style.background = '#22c55e';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      }).catch(function() {
        btn.innerHTML = '&#10007; Failed to send';
        btn.style.background = '#dc2626';
      }).finally(function() {
        setTimeout(function() {
          btn.innerHTML = 'Send Project Request ' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">' +
            '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      });
    });
  }

  // ==================== MODALS ====================
  let lastFocusedEl = null;

  function setupModals() {
    document.querySelectorAll('[data-modal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const modal = document.getElementById(this.getAttribute('data-modal'));
        if (modal) {
          lastFocusedEl = document.activeElement;
          modal.classList.add('active');
          document.body.classList.add('modal-open');
          // Focus the close button
          const closeBtn = modal.querySelector('.modal-close');
          if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 100);
        }
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.classList.contains('modal-close')) {
          closeModal(overlay);
        }
      });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function(m) {
          closeModal(m);
        });
      }
      // Trap focus within modal
      if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (!activeModal) return;
        const focusable = activeModal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  function closeModal(overlay) {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  // ==================== SCROLL NAV ====================
  function setupScrollNav() {
    const links = document.querySelectorAll('nav a');
    if (!links.length) return;
    const sections = [];
    links.forEach(function(a) {
      const id = a.getAttribute('href');
      if (id && id.charAt(0) === '#') {
        const el = document.getElementById(id.substring(1));
        if (el) sections.push({ id: id.substring(1), el: el, link: a });
      }
    });
    if (!sections.length) return;
    const observer = new IntersectionObserver(function() {
      const scrollY = window.scrollY + 120;
      let current = sections[0].id;
      sections.forEach(function(s) {
        const top = s.el.offsetTop;
        const bottom = top + s.el.offsetHeight;
        if (scrollY >= top && scrollY < bottom) current = s.id;
      });
      sections.forEach(function(s) {
        s.link.classList.toggle('active', s.id === current);
      });
    }, { threshold: 0, rootMargin: '-120px 0px -60% 0px' });
    sections.forEach(function(s) { observer.observe(s.el); });
  }

  // ==================== DYNAMIC YEAR ====================
  function setYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ==================== INIT ====================
  document.addEventListener('DOMContentLoaded', function() {
    try { createParticles(); } catch(e) {}
    setupHeroCarousel();
    setupAboutCarousel();
    startTyping();
    observeFadeIn();
    animateCounters();
    setupMobileMenu();
    setupForm();
    setupModals();
    setupScrollNav();
    setYear();
  });

})();
