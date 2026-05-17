/* ============================================================
   SHERO COSMETIC — interactions
   Slider · GSAP entry animations · Scroll-driven rise
   Skin quiz · Contact form
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- 0. Shared helpers ---------- */
// Respect the OS-level reduced-motion preference. When true, decorative
// animations are skipped entirely (we still place elements at their final
// state). This is WCAG 2.3.3 territory and required for EU EAA compliance.
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Theme toggle (light / dark / system).
   The no-flash inline script in index.html has already applied the persisted
   preference to <html data-theme>. Here we wire the toggle button. */
(function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const html = document.documentElement;
  const sysDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = () => html.getAttribute('data-theme') || (sysDark() ? 'dark' : 'light');

  function apply(next) {
    if (next === current()) return;
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('shero-theme', next); } catch (e) {}
    btn.setAttribute('aria-pressed', String(next === 'dark'));
  }

  // Initial aria state
  btn.setAttribute('aria-pressed', String(current() === 'dark'));

  btn.addEventListener('click', () => apply(current() === 'dark' ? 'light' : 'dark'));

  // If the user hasn't made a manual choice yet, keep tracking OS preference
  // changes so the page flips when they change their system theme mid-session.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
    let stored = null;
    try { stored = localStorage.getItem('shero-theme'); } catch (err) {}
    if (stored !== 'dark' && stored !== 'light') {
      btn.setAttribute('aria-pressed', String(e.matches));
    }
  });
})();

// Polite live-region announcer for dynamic UI changes (slider, quiz steps).
const a11yAnnouncer = document.getElementById('a11y-announcer');
function announce(message) {
  if (!a11yAnnouncer) return;
  // Toggle textContent to ensure assistive tech picks up consecutive identical strings.
  a11yAnnouncer.textContent = '';
  setTimeout(() => { a11yAnnouncer.textContent = message; }, 30);
}

// Read the inline product data block emitted by index.html. The block is the
// runtime mirror of data/products.json; if it's missing or malformed we fail
// soft (quiz result will be empty) rather than killing the whole module.
function loadProducts() {
  const node = document.getElementById('shero-products');
  if (!node) {
    console.warn('[shero] product data block missing; quiz result will be empty');
    return {};
  }
  try {
    const parsed = JSON.parse(node.textContent);
    const map = {};
    for (const p of parsed.products || []) {
      map[p.id] = { name: p.name, tag: p.stepLabel, size: p.size };
    }
    return map;
  } catch (err) {
    console.warn('[shero] product data block failed to parse:', err);
    return {};
  }
}
const PRODUCTS = loadProducts();

/* ---------- 1. Header — solid backdrop on scroll ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- 2. Hero slider ---------- */
const slides   = Array.from(document.querySelectorAll('.slide'));
const dots     = Array.from(document.querySelectorAll('.dot'));
const prevBtn  = document.getElementById('prevSlide');
const nextBtn  = document.getElementById('nextSlide');
let current    = 0;
let autoTimer  = null;
const AUTO_MS  = 7000;

function animateSlideIn(slide) {
  const tag     = slide.querySelector('.slide__tag');
  const title   = slide.querySelector('.slide__title');
  const desc    = slide.querySelector('.slide__desc');
  const actions = slide.querySelector('.slide__actions');
  const meta    = slide.querySelector('.slide__meta');
  const bottle  = slide.querySelector('.bottle');
  const glow    = slide.querySelector('.product-glow');

  // Reduced-motion path: snap everything to the final state, no transition.
  if (REDUCE_MOTION) {
    gsap.set([tag, title, desc, actions, meta, bottle, glow],
             { autoAlpha: 1, y: 0, scale: 1, rotate: 0 });
    return;
  }

  // Reset positions so the same animation can re-run for each slide
  gsap.set([tag, title, desc, actions, meta], { autoAlpha: 0, y: 40 });
  gsap.set(bottle, { autoAlpha: 0, y: 80, scale: .92, rotate: -2 });
  gsap.set(glow,   { autoAlpha: 0, scale: .7 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to(glow,    { autoAlpha: 1, scale: 1, duration: 1.4 }, 0)
    .to(bottle,  { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 1.2 }, 0.1)
    .to(tag,     { autoAlpha: 1, y: 0, duration: .7 }, 0.25)
    .to(title,   { autoAlpha: 1, y: 0, duration: .9 }, 0.35)
    .to(desc,    { autoAlpha: 1, y: 0, duration: .8 }, 0.55)
    .to(actions, { autoAlpha: 1, y: 0, duration: .7 }, 0.7)
    .to(meta,    { autoAlpha: 1, y: 0, duration: .6 }, 0.85);
}

function goToSlide(idx, { auto = false } = {}) {
  if (idx === current && !auto) return;
  const total = slides.length;
  const next  = (idx + total) % total;

  slides[current].classList.remove('is-active');
  dots[current].classList.remove('is-active');

  slides[next].classList.add('is-active');
  dots[next].classList.add('is-active');

  animateSlideIn(slides[next]);

  // Announce slide change to screen readers (only on manual nav, not auto —
  // auto-rotation announcements would be noisy). We read innerHTML and convert
  // <br> to a space; textContent would collapse "Hydra<br>Cream" to "HydraCream"
  // and innerText returns "" because animateSlideIn just reset opacity to 0.
  if (!auto) {
    const titleHtml = slides[next].querySelector('.slide__title')?.innerHTML || '';
    const title = titleHtml.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (title) announce(`Showing ${title}. Slide ${next + 1} of ${total}.`);
  }

  current = next;
  resetAutoplay();
}

function resetAutoplay() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goToSlide(current + 1, { auto: true }), AUTO_MS);
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.go, 10)));
});
prevBtn?.addEventListener('click', () => goToSlide(current - 1));
nextBtn?.addEventListener('click', () => goToSlide(current + 1));

// Pause autoplay when hero leaves viewport, resume on return
const hero = document.getElementById('hero');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) resetAutoplay();
    else clearInterval(autoTimer);
  });
}, { threshold: .25 });
heroObserver.observe(hero);

// Keyboard nav
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') goToSlide(current + 1);
  if (e.key === 'ArrowLeft')  goToSlide(current - 1);
});

// First slide entrance — kick it off on load
window.addEventListener('load', () => {
  animateSlideIn(slides[0]);
  resetAutoplay();
});

/* ---------- 3. Hero scroll-up: product + big text rise smoothly ----------
   Scroll-driven parallax is the kind of motion that can trigger vestibular
   discomfort. Skip the whole block when reduced motion is requested. */
if (!REDUCE_MOTION) {
  gsap.utils.toArray('.slide').forEach((slide) => {
    const product = slide.querySelector('.slide__product');
    const content = slide.querySelector('.slide__content');

    gsap.to(product, {
      yPercent: -45,
      scale: .85,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start:   'top top',
        end:     'bottom top',
        scrub:   true,
      },
    });

    gsap.to(content, {
      yPercent: -25,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start:   'top top',
        end:     'bottom top',
        scrub:   true,
      },
    });
  });

  // Big "SHERO COSMETIC" wordmark — slow parallax, drifts up & fades as hero leaves
  gsap.to('.hero__bg-text span:first-child', {
    yPercent: -60,
    letterSpacing: '.04em',
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__bg-text span:last-child', {
    yPercent: -30,
    letterSpacing: '.06em',
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });

  // Fade out scroll hint quickly
  gsap.to('.hero__scroll-hint', {
    opacity: 0,
    y: 40,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: '20% top', scrub: true },
  });
}

/* ---------- 4. Section reveal animations (bulletproof pattern) ---------- */
// Helper: fromTo + immediateRender:false + once:true survives ScrollTrigger.refresh().
// Reduced-motion path: just set the final state immediately, skip the transition.
function reveal(target, fromVars, toVars, st) {
  if (REDUCE_MOTION) {
    return gsap.set(target, toVars);
  }
  return gsap.fromTo(target, fromVars, {
    ...toVars,
    immediateRender: false,
    scrollTrigger: { once: true, toggleActions: 'play none none none', ...st },
  });
}

// About
reveal('.about__text > *',
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .12 },
  { trigger: '.about', start: 'top 75%' }
);
reveal('.about__visual',
  { scale: .85, opacity: 0 },
  { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' },
  { trigger: '.about', start: 'top 75%' }
);
reveal('.about__leaf',
  { y: 60, rotation: -8 },
  { y: 0, rotation: 0, duration: 1.6, ease: 'power3.out' },
  { trigger: '.about', start: 'top 70%' }
);

// Floating leaf parallax (scrub — separate concern, no reveal pattern needed)
if (!REDUCE_MOTION) {
  gsap.to('.about__leaf', {
    y: -50, rotation: 4, ease: 'none',
    scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

// Quiz card
reveal('.quiz .section-head > *',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1 },
  { trigger: '.quiz', start: 'top 75%' }
);
reveal('.quiz__card',
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  { trigger: '.quiz__card', start: 'top 80%' }
);

// Routine
reveal('.routine .section-head > *',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1 },
  { trigger: '.routine', start: 'top 75%' }
);
reveal('.routine-step',
  { y: 80, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1 },
  { trigger: '.routine__steps', start: 'top 80%' }
);
reveal('.routine__cta',
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: .9, ease: 'power3.out' },
  { trigger: '.routine__cta', start: 'top 85%' }
);

// Contact
reveal('.contact__intro > *',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1 },
  { trigger: '.contact', start: 'top 75%' }
);
reveal('.contact__form',
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  { trigger: '.contact', start: 'top 75%' }
);

// Footer
reveal('.footer__grid > *',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .08 },
  { trigger: '.site-footer', start: 'top 90%' }
);

/* ---------- 5. Skin quiz flow ---------- */
const quizState = { type: null, concern: null, time: null };
const quizSteps    = Array.from(document.querySelectorAll('.quiz-step'));
const quizStepLbls = Array.from(document.querySelectorAll('.quiz__steps span'));
const quizProgress = document.getElementById('quizProgress');
const quizBack     = document.getElementById('quizBack');
let quizIdx = 0;

function showQuizStep(idx) {
  quizSteps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
  quizStepLbls.forEach((s, i) => s.classList.toggle('is-active', i === idx));

  // progress bar value: 0, 33, 66, 100
  const map = [0, 33, 66, 100];
  if (quizProgress) {
    quizProgress.dataset.progress = map[idx];
    quizProgress.style.setProperty('--p', map[idx] + '%');
    quizProgress.style.background = `linear-gradient(90deg, var(--blush) 0%, var(--rose-gold) ${map[idx]}%, var(--line) ${map[idx]}%)`;
  }

  if (quizBack) quizBack.disabled = idx === 0;
  quizIdx = idx;

  // Animate step in (or just show if reduced motion)
  const active = quizSteps[idx];
  if (REDUCE_MOTION) {
    gsap.set(active, { opacity: 1, y: 0 });
  } else {
    gsap.fromTo(active,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: .5, ease: 'power3.out' }
    );
  }

  // Move focus into the new step's heading so screen-reader and keyboard users
  // land on the new content. Announce the change politely as a backstop.
  const heading = active?.querySelector('h3');
  if (heading) {
    heading.focus({ preventScroll: true });
    const label = idx === 3 ? 'Quiz result' : `Quiz step ${idx + 1} of 3`;
    announce(`${label}: ${heading.textContent.trim()}`);
  }
}

document.querySelectorAll('.quiz-option').forEach((opt) => {
  opt.addEventListener('click', () => {
    const q = opt.dataset.q;
    const v = opt.dataset.v;
    quizState[q] = v;

    // Mark selected, briefly highlight, then advance
    opt.parentElement.querySelectorAll('.quiz-option').forEach((o) => o.classList.remove('is-selected'));
    opt.classList.add('is-selected');

    setTimeout(() => {
      if (quizIdx < 2) {
        showQuizStep(quizIdx + 1);
      } else {
        renderQuizResult();
        showQuizStep(3);
      }
    }, 350);
  });
});

quizBack?.addEventListener('click', () => {
  if (quizIdx > 0) showQuizStep(quizIdx - 1);
});

document.getElementById('quizRestart')?.addEventListener('click', () => {
  quizState.type = quizState.concern = quizState.time = null;
  document.querySelectorAll('.quiz-option').forEach((o) => o.classList.remove('is-selected'));
  showQuizStep(0);
});

function renderQuizResult() {
  const { type, concern, time } = quizState;

  const titleByConcern = {
    dullness:  'The Radiant Reset',
    aging:     'The Smooth & Renew',
    acne:      'The Clear Calm',
    hydration: 'The Hydration Deep-Dive',
  };

  const concernToProductIds = {
    dullness:  ['cleanser', 'serumC', 'spf'],
    aging:     ['retinol', 'hydra', 'spf'],
    acne:      ['cleanser', 'essence', 'hydra'],
    hydration: ['essence', 'hydra', 'spf'],
  };

  let pickIds = concernToProductIds[concern] || [];

  if (time === 'ritual' && pickIds.length < 5) {
    pickIds = ['cleanser', 'essence', 'serumC', 'hydra', 'spf'];
  } else if (time === 'quick') {
    pickIds = pickIds.slice(0, 3);
  }

  const picks = pickIds.map((id) => PRODUCTS[id]).filter(Boolean);

  const titleEl = document.getElementById('resultTitle');
  const descEl  = document.getElementById('resultDesc');
  const wrap    = document.getElementById('resultProducts');

  if (titleEl) titleEl.textContent = titleByConcern[concern] || 'Your Custom Ritual';
  if (descEl) {
    descEl.textContent =
      `A ${time === 'ritual' ? 'full' : time === 'quick' ? 'streamlined' : 'balanced'} routine ` +
      `tailored to ${type} skin, focused on ${concern}.`;
  }
  if (wrap) {
    wrap.innerHTML = picks.map((p) => `
      <div class="result-product">
        <strong>${p.name}</strong>
        <span>${p.tag}</span>
      </div>
    `).join('');
  }
}

/* ---------- 6. Contact form ---------- */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    return;
  }
  if (formNote) {
    formNote.hidden = false;
    gsap.from(formNote, { opacity: 0, y: 10, duration: .5, ease: 'power3.out' });
  }
  contactForm.reset();
});

/* ---------- 7. Smooth scroll for in-page anchors (respects reduced-motion) ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: REDUCE_MOTION ? 'auto' : 'smooth',
      block: 'start',
    });
  });
});

/* ---------- 8. Mobile menu ---------- */
const mobileNav      = document.getElementById('mobileNav');
const menuBtn        = document.getElementById('menuBtn');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileOverlay  = document.getElementById('mobileNavOverlay');

// Remember the element that opened the menu so we can return focus on close.
let lastFocusBeforeNav = null;

// Tabbable elements inside the open mobile nav, used by the focus trap.
// Excludes anything still transitioning to visibility:visible (otherwise
// the first focus call lands on an element the browser refuses to focus).
function mobileNavFocusables() {
  if (!mobileNav) return [];
  return Array.from(mobileNav.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter((el) => {
    if (el.hasAttribute('hidden')) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none';
  });
}

function openMobileNav() {
  if (!mobileNav) return;
  lastFocusBeforeNav = document.activeElement;
  mobileNav.classList.add('is-open');
  mobileNav.setAttribute('aria-hidden', 'false');
  menuBtn?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('is-locked');
  // Move focus into the panel so keyboard users can actually use the menu.
  const first = mobileNavFocusables()[0];
  setTimeout(() => first?.focus(), 50);
}

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  menuBtn?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-locked');
  // Return focus to whatever triggered the open, or the menu button as fallback.
  (lastFocusBeforeNav instanceof HTMLElement ? lastFocusBeforeNav : menuBtn)?.focus();
}

menuBtn?.addEventListener('click', () => {
  if (!mobileNav) return;
  mobileNav.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
});
mobileNavClose?.addEventListener('click', closeMobileNav);
mobileOverlay?.addEventListener('click', closeMobileNav);
// Close on link tap (after the smooth-scroll fires)
mobileNav?.querySelectorAll('.mobile-nav__links a, .mobile-nav__cta a').forEach((a) => {
  a.addEventListener('click', () => setTimeout(closeMobileNav, 50));
});

// Keyboard handling while the mobile nav is open: Escape closes, Tab wraps.
window.addEventListener('keydown', (e) => {
  if (!mobileNav?.classList.contains('is-open')) return;
  if (e.key === 'Escape') { closeMobileNav(); return; }
  if (e.key !== 'Tab') return;

  const items = mobileNavFocusables();
  if (items.length === 0) return;
  const first = items[0];
  const last  = items[items.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ---------- 9. Testimonials carousel ---------- */
const testimonials = Array.from(document.querySelectorAll('.testimonial'));
const testDots     = Array.from(document.querySelectorAll('#testimonialsDots .dot'));
const testPrev     = document.getElementById('testPrev');
const testNext     = document.getElementById('testNext');
let testIdx        = 0;
let testTimer      = null;
const TEST_AUTO_MS = 6500;

function goToTestimonial(i) {
  const total = testimonials.length;
  const next  = (i + total) % total;
  if (next === testIdx) return;
  testimonials[testIdx].classList.remove('is-active');
  testDots[testIdx].classList.remove('is-active');
  testimonials[next].classList.add('is-active');
  testDots[next].classList.add('is-active');
  testIdx = next;
  resetTestAutoplay();
}
function resetTestAutoplay() {
  clearInterval(testTimer);
  testTimer = setInterval(() => goToTestimonial(testIdx + 1), TEST_AUTO_MS);
}
testDots.forEach((d) => d.addEventListener('click', () => goToTestimonial(parseInt(d.dataset.i, 10))));
testPrev?.addEventListener('click', () => goToTestimonial(testIdx - 1));
testNext?.addEventListener('click', () => goToTestimonial(testIdx + 1));

// Pause autoplay when off-screen
const testSection = document.getElementById('testimonials');
if (testSection) {
  const testObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) resetTestAutoplay();
      else clearInterval(testTimer);
    });
  }, { threshold: .3 });
  testObserver.observe(testSection);
}

/* ---------- 10. Reveal animations for new sections (bulletproof) ---------- */

// Press bar
reveal('.press',
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out' },
  { trigger: '.press', start: 'top 90%' }
);

// Ingredients
reveal('.ingredients .section-head > *',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1 },
  { trigger: '.ingredients', start: 'top 75%' }
);
reveal('.ingredient',
  { y: 60, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1 },
  { trigger: '.ingredients__grid', start: 'top 85%' }
);
reveal('.ingredients__note',
  { y: 20, opacity: 0 },
  { y: 0, opacity: 1, duration: .7, ease: 'power3.out' },
  { trigger: '.ingredients__note', start: 'top 90%' }
);

// Testimonials
reveal('.testimonials .section-head > *',
  { y: 40, opacity: 0 },
  { y: 0, opacity: 1, duration: .8, ease: 'power3.out', stagger: .1 },
  { trigger: '.testimonials', start: 'top 75%' }
);
reveal('.testimonials__rating',
  { y: 20, opacity: 0 },
  { y: 0, opacity: 1, duration: .7, ease: 'power3.out' },
  { trigger: '.testimonials__rating', start: 'top 85%' }
);
reveal('.testimonials__viewport',
  { y: 50, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
  { trigger: '.testimonials__viewport', start: 'top 85%' }
);

/* ---------- 11. Refresh once after fonts load so trigger positions are accurate ---------- */
// (once:true on reveals ensures completed tweens stay completed across refreshes)
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}
