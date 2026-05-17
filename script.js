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

/* ---------- Product grid filter chips ---------- */
(function setupProductFilters() {
  const chips = document.querySelectorAll('.products__filters .chip');
  const cards = document.querySelectorAll('.product-card');
  if (!chips.length || !cards.length) return;

  // The card's data-category is a single token (cleanse/tone/treat/...).
  // 'all' shows every card; otherwise we substring-match against the token.
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-selected', String(active));
      });
      cards.forEach((card) => {
        const cat = card.dataset.category || '';
        const match = filter === 'all' || cat === filter;
        card.classList.toggle('is-filtered-out', !match);
      });
    });
  });
})();

/* ---------- Skin quiz ---------- */
(function setupQuiz() {
  const card = document.getElementById('quizCard');
  if (!card) return;

  const steps        = Array.from(card.querySelectorAll('.quiz-step'));
  const stepLabels   = Array.from(card.querySelectorAll('.quiz__steps li'));
  const progressFill = document.getElementById('quizProgress');
  const counter      = document.getElementById('quizCounter');
  const backBtn      = document.getElementById('quizBack');
  const restartBtn   = document.getElementById('quizRestart');

  const state  = { type: null, concern: null, time: null };
  let stepIdx  = 0;

  const TOTAL = 4; // 3 questions + result

  function showStep(idx) {
    steps.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    stepLabels.forEach((s, i) => s.classList.toggle('is-active', i === idx));

    const progressPct = [25, 50, 75, 100][idx] ?? 25;
    if (progressFill) progressFill.style.width = progressPct + '%';

    if (counter) {
      counter.textContent = idx === 3 ? 'Your result' : `Step ${idx + 1} of 3`;
    }
    if (backBtn) backBtn.disabled = idx === 0;

    stepIdx = idx;

    // Move focus to the heading for screen-reader + keyboard users.
    const heading = steps[idx]?.querySelector('h3');
    if (heading) {
      heading.focus({ preventScroll: true });
      const label = idx === 3 ? 'Quiz result' : `Quiz step ${idx + 1} of 3`;
      announce(`${label}: ${heading.textContent.trim()}`);
    }
  }

  // Handle option selection
  card.querySelectorAll('.quiz-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      const q = opt.dataset.q;
      const v = opt.dataset.v;
      state[q] = v;

      opt.parentElement.querySelectorAll('.quiz-option').forEach((o) => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');

      setTimeout(() => {
        if (stepIdx < 2) {
          showStep(stepIdx + 1);
        } else {
          renderResult();
          showStep(3);
        }
      }, 350);
    });
  });

  backBtn?.addEventListener('click', () => {
    if (stepIdx > 0) showStep(stepIdx - 1);
  });

  restartBtn?.addEventListener('click', () => {
    state.type = state.concern = state.time = null;
    card.querySelectorAll('.quiz-option').forEach((o) => o.classList.remove('is-selected'));
    showStep(0);
  });

  function renderResult() {
    const { type, concern, time } = state;

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

    if (titleEl) titleEl.textContent = titleByConcern[concern] || 'Your custom ritual';
    if (descEl) {
      const cadence = time === 'ritual' ? 'full' : time === 'quick' ? 'streamlined' : 'balanced';
      descEl.textContent = `A ${cadence} routine tailored to ${type} skin, focused on ${concern}.`;
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
})();
