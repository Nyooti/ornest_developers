(function() {
  'use strict';

  // Mark JS as active — enables fade-in CSS rules
  document.documentElement.classList.add('js-enabled');

  // ==================== PARTICLES ====================
  function createParticles() {
    var canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var count = 50;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        a: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
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

        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
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
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ==================== TYPING EFFECT ====================
  function startTyping() {
    var el = document.getElementById('typed-text');
    if (!el) return;
    var strings = [
      'Building Kenya\'s Digital Future',
      'Code. Innovate. Deploy.',
      'Where Tech Meets Excellence',
      'Powering African Innovation'
    ];
    var strIndex = 0;
    var charIndex = el.textContent.length;
    var isDeleting = false;
    var speed = 80;

    function type() {
      var current = strings[strIndex];
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
    // Start after a brief pause
    setTimeout(type, 1500);
  }

  // ==================== HERO CAROUSEL ====================
  function setupHeroCarousel() {
    var slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;

    var reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    var index = 0;
    setInterval(function() {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, 5200);
  }

  // ==================== ABOUT CAROUSEL ====================
  function setupAboutCarousel() {
    var carousel = document.getElementById('aboutCarousel');
    if (!carousel) return;
    var track = document.getElementById('aboutTrack');
    if (!track) return;
    var slides = track.querySelectorAll('.about-slide');
    var dotsContainer = document.getElementById('aboutDots');
    if (slides.length < 2 || !dotsContainer) return;

    slides.forEach(function(_, i) {
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function() { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    var index = 0;
    var total = slides.length;
    var timer;
    var counterEl = document.getElementById('aboutCounter');

    function updateCounter() {
      if (counterEl) counterEl.textContent = (index + 1) + ' / ' + total;
    }

    function goTo(i) {
      if (i === index) return;
      index = i;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      var dots = dotsContainer.children;
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('active', d === index);
      }
      updateCounter();
      resetTimer();
    }

    function next() { goTo((index + 1) % total); }
    function prev() { goTo((index - 1 + total) % total); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 4000);
    }

    var nextBtn = carousel.querySelector('.about-carousel-next');
    var prevBtn = carousel.querySelector('.about-carousel-prev');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    timer = setTimeout(function() {
      next();
      timer = setInterval(next, 4000);
    }, 3000);
  }

  // ==================== SCROLL REVEAL ====================
  function observeFadeIn() {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    var observer = new IntersectionObserver(function(entries) {
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
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var current = 0;
          var step = Math.ceil(target / 50);
          var timer = setInterval(function() {
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
    var toggle = document.getElementById('menuToggle');
    var nav = document.getElementById('nav-menu');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        nav.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // ==================== FORM HANDLER ====================
  function setupForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('.btn');
      var data = new FormData(form);
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Sending...';
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function(res) {
        if (res.ok) {
          btn.innerHTML = '✓ Message Sent!';
          btn.style.background = '#22c55e';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      }).catch(function() {
        btn.innerHTML = '✗ Failed to send';
        btn.style.background = '#dc2626';
      }).finally(function() {
        setTimeout(function() {
          btn.innerHTML = 'Send Message ' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">' +
            '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      });
    });
  }

  // ==================== MODALS ====================
  function setupModals() {
    document.querySelectorAll('[data-modal]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var modal = document.getElementById(this.getAttribute('data-modal'));
        if (modal) modal.classList.add('active');
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.classList.contains('modal-close')) {
          overlay.classList.remove('active');
        }
      });
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function(m) {
          m.classList.remove('active');
        });
      }
    });
  }

  // ==================== SCROLL NAV ====================
  function setupScrollNav() {
    var links = document.querySelectorAll('nav a');
    if (!links.length) return;
    var sections = [];
    links.forEach(function(a) {
      var id = a.getAttribute('href');
      if (id && id.charAt(0) === '#') {
        var el = document.getElementById(id.substring(1));
        if (el) sections.push({ id: id.substring(1), el: el, link: a });
      }
    });
    if (!sections.length) return;
    var observer = new IntersectionObserver(function() {
      var scrollY = window.scrollY + 120;
      var current = sections[0].id;
      sections.forEach(function(s) {
        var top = s.el.offsetTop;
        var bottom = top + s.el.offsetHeight;
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
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ==================== INIT ====================
  document.addEventListener('DOMContentLoaded', function() {
    try { createParticles(); } catch(e) { /* canvas not supported */ }
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
