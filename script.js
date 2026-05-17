/* ============================================================
   SHERO COSMETIC — interactions (foundation)
   Section-specific behavior (slider, quiz, routine, testimonials)
   lands as each section block is built.
   ============================================================ */

const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Theme toggle ---------- */
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

  btn.setAttribute('aria-pressed', String(current() === 'dark'));
  btn.addEventListener('click', () => apply(current() === 'dark' ? 'light' : 'dark'));

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
    let stored = null;
    try { stored = localStorage.getItem('shero-theme'); } catch (err) {}
    if (stored !== 'dark' && stored !== 'light') {
      btn.setAttribute('aria-pressed', String(e.matches));
    }
  });
})();

/* ---------- Live-region announcer (used by future quiz / slider blocks) ---------- */
const a11yAnnouncer = document.getElementById('a11y-announcer');
function announce(message) {
  if (!a11yAnnouncer) return;
  a11yAnnouncer.textContent = '';
  setTimeout(() => { a11yAnnouncer.textContent = message; }, 30);
}

/* ---------- Product data (inline JSON mirror of data/products.json) ---------- */
function loadProducts() {
  const node = document.getElementById('shero-products');
  if (!node) return {};
  try {
    const parsed = JSON.parse(node.textContent);
    const map = {};
    for (const p of parsed.products || []) {
      map[p.id] = { name: p.name, tag: p.stepLabel, size: p.size, hero: p.hero, step: p.step, category: p.category };
    }
    return map;
  } catch (err) {
    console.warn('[shero] product data block failed to parse:', err);
    return {};
  }
}
const PRODUCTS = loadProducts();

/* ---------- Smooth scroll for in-page anchors ---------- */
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

/* ---------- Lightweight reveal-on-scroll ----------
   Adds `is-revealed` to elements with [data-reveal] when they enter the
   viewport. CSS handles the transition. IntersectionObserver, not GSAP —
   the rebuild aims for a calmer animation system overall. */
if (!REDUCE_MOTION && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}

/* ---------- Mobile menu (stub — full markup arrives with final nav block) ---------- */
const menuBtn = document.getElementById('menuBtn');
menuBtn?.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!expanded));
  // Full mobile drawer markup re-introduced in the final block.
});
