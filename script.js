/* =====================================================================
   Nutrivae Foods — Premium Animation Script
   Inspired by voldogfood.com design language
   ===================================================================== */

gsap.registerPlugin(ScrollTrigger);

let lenis;

// ══════════════════════════════════════════════════════════════════════
// 1. LENIS SMOOTH SCROLL
// ══════════════════════════════════════════════════════════════════════
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

// ══════════════════════════════════════════════════════════════════════
// 2. PAGE LOADER
// ══════════════════════════════════════════════════════════════════════
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) { initAfterLoad(); return; }

  const bar   = document.getElementById('loader-bar');
  const label = document.getElementById('loader-label');
  let progress = 0;

  const interval = setInterval(() => {
    progress += progress < 70 ? Math.random() * 12 : Math.random() * 2;
    progress = Math.min(progress, 92);
    if (bar)   bar.style.width   = progress + '%';
    if (label) label.textContent = Math.round(progress) + '%';
  }, 60);

  function finishLoader() {
    clearInterval(interval);
    if (bar)   bar.style.width   = '100%';
    if (label) label.textContent = '100%';
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      delay: 0.3,
      onComplete: () => { loader.classList.add('hidden'); initAfterLoad(); }
    });
  }

  if (document.readyState === 'complete') { finishLoader(); }
  else {
    window.addEventListener('load', finishLoader);
    setTimeout(finishLoader, 3000);
  }
}

// ══════════════════════════════════════════════════════════════════════
// 3. INIT AFTER LOADER
// ══════════════════════════════════════════════════════════════════════
function initAfterLoad() {
  initLenis();
  animateHero();
  initBrandSection();   // ← new brand section
  initScrollAnimations();
  initStorytelling();
  initCounter();
  initCustomCursor();
  initMagneticButtons();
  initHeader();
  initHamburger();
}

// ══════════════════════════════════════════════════════════════════════
// 4. HERO ENTRANCE TIMELINE
// ══════════════════════════════════════════════════════════════════════
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('#hero-cover-bg img', 
      { scale: 1.1, filter: 'blur(10px)' }, 
      { scale: 1, filter: 'blur(0px)', duration: 1.8, ease: 'power3.out' }, 0.1)
    .to('#float-card-1', { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, 0.6)
    .to('#float-card-2', { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.4)' }, 0.75);

  // Intro text (now below fold) scroll trigger
  const introTl = gsap.timeline({
    scrollTrigger: { trigger: '.intro-section', start: 'top 75%' },
    defaults: { ease: 'power3.out' }
  });
  introTl.to('.word-inner', { y: 0, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, 0)
         .to('.underline-path', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.6);
}

// ══════════════════════════════════════════════════════════════════════
// 5. BRAND SECTION — canvas + letters + SVG draw-paths
// ══════════════════════════════════════════════════════════════════════
function initBrandSection() {
  const section = document.getElementById('brand-section');
  if (!section) return;

  // ── 5a. Canvas particle background ─────────────────────────────────
  initBrandCanvas();

  // ── 5b. Letter animation on scroll ─────────────────────────────────
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#brand-section',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
    defaults: { ease: 'power4.out' }
  });

  // Letters cascade up with 3-D flip from below
  tl.to('.bl', {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.85,
    stagger: {
      each: 0.07,
      ease: 'power2.inOut',
    },
  }, 0)

  // Rule line expands
  .to('#brand-rule', { width: '100%', duration: 1, ease: 'power3.inOut' }, 0.55)

  // Tagline fades in
  .to('#brand-tagline', { opacity: 1, y: 0, duration: 0.8 }, 0.7)

  // Pills fade in
  .to('#brand-pills', { opacity: 1, y: 0, duration: 0.7 }, 0.9)

  // Scroll cue appears
  .to('#brand-scroll-cue', { opacity: 1, duration: 0.6 }, 1.2);

  // ── 5c. SVG draw-paths trace themselves (staggered) ─────────────────
  gsap.to('.brand-drawpath .dp', {
    strokeDashoffset: 0,
    duration: 1.6,
    ease: 'power2.inOut',
    stagger: 0.25,
    scrollTrigger: {
      trigger: '#brand-section',
      start: 'top 70%',
    }
  });

  // ── 5d. Parallax on scroll within the section ───────────────────────
  gsap.to('.brand-content', {
    yPercent: -12,
    ease: 'none',
    scrollTrigger: {
      trigger: '#brand-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // ── 5e. Hide scroll cue when leaving section ────────────────────────
  ScrollTrigger.create({
    trigger: '#brand-section',
    start: 'top top',
    onEnter: () => gsap.to('#brand-scroll-cue', { opacity: 1, duration: 0.4 }),
    onLeave: () => gsap.to('#brand-scroll-cue', { opacity: 0, duration: 0.3 }),
    onEnterBack: () => gsap.to('#brand-scroll-cue', { opacity: 1, duration: 0.4 }),
  });
}

// ── Canvas: floating organic particles (seeds / pollen) ──────────────
function initBrandCanvas() {
  const canvas = document.getElementById('brand-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle pool — small circles + occasional larger rings
  const count = Math.min(80, Math.floor(canvas.width / 18));
  const particles = Array.from({ length: count }, () => createParticle(canvas));

  function createParticle(cv, startAtBottom = false) {
    const isRing = Math.random() < 0.2;
    return {
      x:       Math.random() * cv.width,
      y:       startAtBottom ? cv.height + 10 : Math.random() * cv.height,
      r:       isRing ? Math.random() * 6 + 3 : Math.random() * 2.5 + 0.5,
      isRing,
      speedX:  (Math.random() - 0.5) * 0.25,
      speedY:  -(Math.random() * 0.4 + 0.15),
      opacity: Math.random() * 0.45 + 0.08,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    };
  }

  let running = true;

  // Stop canvas when section is far from view (performance)
  const observer = new IntersectionObserver(
    (entries) => { running = entries[0].isIntersecting; },
    { rootMargin: '200px' }
  );
  observer.observe(canvas);

  function draw() {
    requestAnimationFrame(draw);
    if (!running) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      ctx.beginPath();
      if (p.isRing) {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,168,75,${p.opacity})`;
        ctx.lineWidth   = 0.8;
        ctx.stroke();
      } else {
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,217,138,${p.opacity})`;
        ctx.fill();
      }

      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Twinkle
      p.opacity += p.opacityDir * 0.002;
      if (p.opacity > 0.55 || p.opacity < 0.05) p.opacityDir *= -1;

      // Slight horizontal drift
      p.speedX += (Math.random() - 0.5) * 0.008;
      p.speedX   = Math.max(-0.4, Math.min(0.4, p.speedX));

      // Reset when off top
      if (p.y < -p.r * 2) {
        Object.assign(p, createParticle(canvas, true));
      }
    });
  }

  draw();
}

// ══════════════════════════════════════════════════════════════════════
// 6. SCROLL-TRIGGERED ANIMATIONS
// ══════════════════════════════════════════════════════════════════════
function initScrollAnimations() {
  // Hero parallax
  gsap.to('#hero-img', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });

  // Philosophy cards
  gsap.fromTo('.phil-card',
    { opacity: 0, y: 60, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.philosophy-grid', start: 'top 82%' } }
  );

  gsap.from('.philosophy-header', {
    opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.philosophy-header', start: 'top 85%' }
  });

  // Products
  gsap.from('.products-header', {
    opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.products-header', start: 'top 85%' }
  });

  gsap.fromTo('.product-card',
    { opacity: 0, y: 80, scale: 0.93 },
    { opacity: 1, y: 0, scale: 1, stagger: 0.14, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.products-grid', start: 'top 82%' } }
  );

  // Stats
  gsap.fromTo('.stat-item',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.stats-band', start: 'top 85%' } }
  );

  // CTA banner
  gsap.fromTo('.cta-banner-text', 
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-banner', start: 'top 90%' }
  });
  gsap.fromTo('.cta-banner-img',
    { opacity: 0, x: 50, scale: 1.05 },
    { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta-banner', start: 'top 90%' }
  });

  // Generic data-animate fallback
  gsap.utils.toArray('[data-animate]').forEach(el => {
    const delay = parseInt(el.dataset.delay || 0) / 1000;
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' } }
    );
  });
}

// ══════════════════════════════════════════════════════════════════════
// 7. STORYTELLING — scroll-position math
// ══════════════════════════════════════════════════════════════════════
function initStorytelling() {
  const section    = document.getElementById('story-section');
  if (!section) return;
  const scrollSpace = section.querySelector('.story-scroll-space');
  if (!scrollSpace) return;

  const textSteps   = Array.from(section.querySelectorAll('.story-step-text'));
  const imgSteps    = Array.from(section.querySelectorAll('.story-img'));
  const dots        = Array.from(section.querySelectorAll('.story-dot'));
  const progressBar = document.getElementById('story-progress-bar');
  const totalSteps  = textSteps.length;
  let currentStep   = -1;

  function setStep(index) {
    if (index === currentStep) return;
    currentStep = index;
    textSteps.forEach((el, i) => el.classList.toggle('active', i === index));
    imgSteps.forEach((el, i)  => el.classList.toggle('active', i === index));
    dots.forEach((el, i)      => el.classList.toggle('active', i === index));
    if (progressBar) progressBar.style.height = `${((index + 1) / totalSteps) * 100}%`;
  }

  function onScroll() {
    const rect        = scrollSpace.getBoundingClientRect();
    const scrolled    = -rect.top;
    const totalScroll = scrollSpace.offsetHeight - window.innerHeight;
    const progress    = Math.max(0, Math.min(1, scrolled / totalScroll));
    setStep(Math.min(Math.floor(progress * totalSteps), totalSteps - 1));
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const top       = scrollSpace.getBoundingClientRect().top + window.scrollY;
      const maxScroll = scrollSpace.offsetHeight - window.innerHeight;
      const target    = top + (i / totalSteps) * maxScroll;
      lenis ? lenis.scrollTo(target, { duration: 1.2 })
            : window.scrollTo({ top: target, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ══════════════════════════════════════════════════════════════════════
// 8. ANIMATED COUNTERS
// ══════════════════════════════════════════════════════════════════════
function initCounter() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const target = parseInt(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || '';
      const start  = performance.now();
      const tick   = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        const e = 1 - Math.pow(1 - p, 4);
        entry.target.textContent = Math.round(e * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════════════════════════════
// 9. CUSTOM CURSOR
// ══════════════════════════════════════════════════════════════════════
function initCustomCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let cX = 0, cY = 0, fX = 0, fY = 0;

  document.addEventListener('mousemove', (e) => {
    cX = e.clientX; cY = e.clientY;
    cursor.style.left = cX + 'px';
    cursor.style.top  = cY + 'px';
  });

  (function animateFollower() {
    fX += (cX - fX) * 0.1;
    fY += (cY - fY) * 0.1;
    follower.style.left = fX + 'px';
    follower.style.top  = fY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, .product-card, .phil-card, .bl').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
}

// ══════════════════════════════════════════════════════════════════════
// 10. MAGNETIC BUTTONS
// ══════════════════════════════════════════════════════════════════════
function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx   = (e.clientX - rect.left - rect.width  / 2) * 0.3;
      const dy   = (e.clientY - rect.top  - rect.height / 2) * 0.3;
      gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// ══════════════════════════════════════════════════════════════════════
// 11. HEADER
// ══════════════════════════════════════════════════════════════════════
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ══════════════════════════════════════════════════════════════════════
// 12. HAMBURGER
// ══════════════════════════════════════════════════════════════════════
function initHamburger() {
  const header     = document.getElementById('header');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    if (header) header.classList.toggle('menu-open', isOpen);
    if (lenis) isOpen ? lenis.stop() : lenis.start();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      if (header) header.classList.remove('menu-open');
      if (lenis) lenis.start();
    });
  });
}

// ══════════════════════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════════════════════
initLoader();
