// ============================================================
// Fix & Flow · רון סמרה · script.js — v2.0
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Navigation: Scroll shadow + Hamburger ── */
  const nav = document.querySelector('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── 2. FAQ Accordion ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── 3. Scroll Reveal Animation ── */
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on index within parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  /* ── 4. Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 5. Always start at top (ignore URL hash) ── */
  history.scrollRestoration = 'manual';
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
  }
  window.scrollTo(0, 0);

  /* ── 6. Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const linkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => linkObserver.observe(sec));

  /* ── 7. Accessibility Widget ── */
  const injectA11yWidget = () => {
    // Inject HTML
    const htmlSnippet = `
      <button id="a11y-btn" class="a11y-btn" aria-label="תפריט נגישות" aria-expanded="false" aria-controls="a11y-panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <circle cx="12" cy="12" r="10"></circle>
           <circle cx="12" cy="10" r="3"></circle>
           <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
        </svg>
      </button>

      <div id="a11y-panel" class="a11y-panel" role="dialog" aria-modal="true" aria-hidden="true" aria-label="תפריט נגישות">
        <div class="a11y-header">
          <h3>התאמות נגישות</h3>
          <button id="a11y-close" class="a11y-close" aria-label="סגור תפריט נגישות">×</button>
        </div>
        <div class="a11y-content">
          <button class="a11y-toggle" data-action="keyboardNav" aria-pressed="false">ניווט מקלדת</button>
          <button class="a11y-toggle" data-action="disableAnimations" aria-pressed="false">ביטול אנימציות / הבהובים</button>
          <button class="a11y-toggle" data-action="highContrast" aria-pressed="false">מצב ניגודיות גבוהה</button>
          <button class="a11y-toggle" data-action="increaseText" aria-pressed="false">הגדלת טקסט</button>
          <button class="a11y-toggle" data-action="decreaseText" aria-pressed="false">הקטנת טקסט</button>
          <button class="a11y-toggle" data-action="readableFont" aria-pressed="false">גופן קריא</button>
          <button class="a11y-toggle" data-action="highlightHeadings" aria-pressed="false">סימון כותרות</button>
          <button class="a11y-toggle" data-action="highlightLinks" aria-pressed="false">סימון קישורים ולחצנים</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', htmlSnippet);

    const btn = document.getElementById('a11y-btn');
    const panel = document.getElementById('a11y-panel');
    const closeBtn = document.getElementById('a11y-close');
    const toggles = panel.querySelectorAll('.a11y-toggle');
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    // Default state
    let state = {
      keyboardNav: false,
      disableAnimations: false,
      highContrast: false,
      textScale: 0,
      readableFont: false,
      highlightHeadings: false,
      highlightLinks: false
    };

    // Load from local storage
    const saved = localStorage.getItem('a11y-settings');
    if (saved) {
      try { state = { ...state, ...JSON.parse(saved) }; } catch (e) {}
    }

    const saveState = () => localStorage.setItem('a11y-settings', JSON.stringify(state));

    const applyState = () => {
      // Toggle body classes based on booleans
      bodyEl.classList.toggle('a11y-keyboard-nav', state.keyboardNav);
      bodyEl.classList.toggle('a11y-no-animations', state.disableAnimations);
      bodyEl.classList.toggle('a11y-high-contrast', state.highContrast);
      bodyEl.classList.toggle('a11y-readable-font', state.readableFont);
      bodyEl.classList.toggle('a11y-highlight-headings', state.highlightHeadings);
      bodyEl.classList.toggle('a11y-highlight-links', state.highlightLinks);
      
      // Text scale logic
      htmlEl.classList.remove('a11y-text-1', 'a11y-text-2', 'a11y-text-3');
      if (state.textScale > 0) {
        htmlEl.classList.add(`a11y-text-${state.textScale}`);
      }

      // Sync aria-pressed
      toggles.forEach(t => {
        const action = t.dataset.action;
        if (action === 'increaseText' || action === 'decreaseText') {
          // Visual state not crucial as boolean toggles, but helpful
          t.setAttribute('aria-pressed', state.textScale > 0 ? 'true' : 'false');
        } else {
          t.setAttribute('aria-pressed', state[action] ? 'true' : 'false');
        }
      });
    };

    applyState();

    // Toggle logic
    toggles.forEach(t => {
      t.addEventListener('click', () => {
        const action = t.dataset.action;
        if (action === 'increaseText') {
          state.textScale = Math.min(state.textScale + 1, 3);
        } else if (action === 'decreaseText') {
          state.textScale = Math.max(state.textScale - 1, 0);
        } else {
          state[action] = !state[action];
        }
        saveState();
        applyState();
      });
    });

    // Open/Close
    const togglePanel = (force) => {
      const isOpening = force !== undefined ? force : !panel.classList.contains('open');
      panel.classList.toggle('open', isOpening);
      btn.setAttribute('aria-expanded', isOpening);
      panel.setAttribute('aria-hidden', !isOpening);
      if (isOpening) closeBtn.focus();
    };

    btn.addEventListener('click', () => togglePanel());
    closeBtn.addEventListener('click', () => togglePanel(false));

    // Close on click outside or escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        togglePanel(false);
        btn.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) {
        togglePanel(false);
      }
    });
  };

  injectA11yWidget();

});
