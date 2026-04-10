// ============================================================
// Fix & Flow · רון סמרה · script.js — v3.0 Clinical Premium
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════════════════
     1. REVEAL ON SCROLL
     All .reveal elements: slide up 30px + fade in 0.8s.
     Grids: each card staggers 150ms after the previous.
  ════════════════════════════════════════════════════════ */
  (function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el     = entry.target;
        const parent = el.parentElement;

        // Stagger when the parent is a CSS grid with multiple reveal children
        const isGrid    = getComputedStyle(parent).display === 'grid';
        const siblings  = isGrid ? [...parent.querySelectorAll('.reveal')] : [];
        const idx       = siblings.indexOf(el);
        const delay     = isGrid && idx > -1 ? idx * 150 : 0;

        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    reveals.forEach(el => observer.observe(el));
  })();


  /* ════════════════════════════════════════════════════════
     2. SMOOTH COUNTERS
     Elements declare their target via data-target="35"
     and an optional data-suffix="+".
     Counts from 0 to target with easeOutQuart on scroll entry.
  ════════════════════════════════════════════════════════ */
  (function initCounters() {
    const DURATION = 2000; // ms

    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function animateValue(el, start, end, suffix) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / DURATION, 1);
        el.textContent = Math.floor(easeOutQuart(progress) * (end - start) + start) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const counterEls = document.querySelectorAll('[data-target]');
    if (!counterEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, target, suffix);
        observer.unobserve(el);
      });
    }, { threshold: 0.8 });

    counterEls.forEach(el => observer.observe(el));
  })();


  /* ════════════════════════════════════════════════════════
     3. NAVIGATION: Scroll shadow + Active link
  ════════════════════════════════════════════════════════ */
  (function initNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Scroll shadow
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Highlight the active nav link based on which section is in view
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link =>
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            )
          );
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(sec => linkObserver.observe(sec));
  })();


  /* ════════════════════════════════════════════════════════
     4. MOBILE MENU — Full-screen overlay
     Hamburger → × transition.
     Nav links and WA button stagger in with 60ms steps.
     Closes on: link click, Escape key, backdrop click.
  ════════════════════════════════════════════════════════ */
  (function initMobileMenu() {
    const hamburger = document.getElementById('nav-hamburger');
    const overlay   = document.getElementById('mobile-menu');
    if (!hamburger || !overlay) return;

    const links     = overlay.querySelectorAll('a');
    const waBtn     = overlay.querySelector('.mobile-wa-btn');

    const openMenu = () => {
      overlay.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Stagger each link in
      links.forEach((link, i) => {
        link.style.transitionDelay = `${0.18 + i * 0.06}s`;
      });
      if (waBtn) waBtn.style.transitionDelay = `${0.18 + links.length * 0.06}s`;
    };

    const closeMenu = () => {
      overlay.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      // Reset delays so the next open feels fresh
      links.forEach(link => { link.style.transitionDelay = '0s'; });
      if (waBtn) waBtn.style.transitionDelay = '0s';
    };

    hamburger.addEventListener('click', () =>
      overlay.classList.contains('open') ? closeMenu() : openMenu()
    );

    // Close on any link click inside the overlay
    links.forEach(link => link.addEventListener('click', closeMenu));

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Close on backdrop click (click outside content area)
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeMenu();
    });
  })();


  /* ════════════════════════════════════════════════════════
     5. SMOOTH SCROLL — anchor links
  ════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 68;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH,
        behavior: 'smooth',
      });
    });
  });


  /* ════════════════════════════════════════════════════════
     6. ALWAYS START AT TOP (ignore URL hash)
  ════════════════════════════════════════════════════════ */
  history.scrollRestoration = 'manual';
  if (window.location.hash) history.replaceState(null, '', window.location.pathname);
  window.scrollTo(0, 0);


  /* ════════════════════════════════════════════════════════
     7. FAQ ACCORDION
  ════════════════════════════════════════════════════════ */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ════════════════════════════════════════════════════════
     8. ACCESSIBILITY WIDGET
  ════════════════════════════════════════════════════════ */
  (function injectA11yWidget() {
    document.body.insertAdjacentHTML('beforeend', `
      <button id="a11y-btn" class="a11y-btn" aria-label="תפריט נגישות"
              aria-expanded="false" aria-controls="a11y-panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="10" r="3"/>
          <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
        </svg>
      </button>

      <div id="a11y-panel" class="a11y-panel" role="dialog" aria-modal="true"
           aria-hidden="true" aria-label="תפריט נגישות">
        <div class="a11y-header">
          <h3>התאמות נגישות</h3>
          <button id="a11y-close" class="a11y-close" aria-label="סגור תפריט נגישות">×</button>
        </div>
        <div class="a11y-content">
          <button class="a11y-toggle" data-action="keyboardNav"        aria-pressed="false">ניווט מקלדת</button>
          <button class="a11y-toggle" data-action="disableAnimations"  aria-pressed="false">ביטול אנימציות / הבהובים</button>
          <button class="a11y-toggle" data-action="highContrast"       aria-pressed="false">מצב ניגודיות גבוהה</button>
          <button class="a11y-toggle" data-action="increaseText"       aria-pressed="false">הגדלת טקסט</button>
          <button class="a11y-toggle" data-action="decreaseText"       aria-pressed="false">הקטנת טקסט</button>
          <button class="a11y-toggle" data-action="readableFont"       aria-pressed="false">גופן קריא</button>
          <button class="a11y-toggle" data-action="highlightHeadings"  aria-pressed="false">סימון כותרות</button>
          <button class="a11y-toggle" data-action="highlightLinks"     aria-pressed="false">סימון קישורים ולחצנים</button>
          <button class="a11y-toggle" data-action="resetA11y"          aria-pressed="false"
                  style="margin-top:0.35rem;opacity:.85;">↺ איפוס התאמות</button>
        </div>
      </div>
    `);

    const btn     = document.getElementById('a11y-btn');
    const panel   = document.getElementById('a11y-panel');
    const closeBtn = document.getElementById('a11y-close');
    const toggles  = panel.querySelectorAll('.a11y-toggle');
    const htmlEl   = document.documentElement;
    const bodyEl   = document.body;

    let state = {
      keyboardNav: false, disableAnimations: false, highContrast: false,
      textScale: 0, readableFont: false, highlightHeadings: false, highlightLinks: false,
    };

    const DEFAULTS = { ...state };

    const applyState = () => {
      bodyEl.classList.toggle('a11y-keyboard-nav',       state.keyboardNav);
      bodyEl.classList.toggle('a11y-no-animations',      state.disableAnimations);
      bodyEl.classList.toggle('a11y-high-contrast',      state.highContrast);
      bodyEl.classList.toggle('a11y-readable-font',      state.readableFont);
      bodyEl.classList.toggle('a11y-highlight-headings', state.highlightHeadings);
      bodyEl.classList.toggle('a11y-highlight-links',    state.highlightLinks);

      htmlEl.classList.remove('a11y-text-1', 'a11y-text-2', 'a11y-text-3');
      if (state.textScale > 0) htmlEl.classList.add(`a11y-text-${state.textScale}`);

      toggles.forEach(t => {
        const a = t.dataset.action;
        const pressed = (a === 'increaseText' || a === 'decreaseText')
          ? state.textScale > 0
          : !!state[a];
        t.setAttribute('aria-pressed', pressed);
      });
    };

    applyState();

    toggles.forEach(t => {
      t.addEventListener('click', () => {
        const a = t.dataset.action;
        if      (a === 'resetA11y')     state = { ...DEFAULTS };
        else if (a === 'increaseText')  state.textScale = Math.min(state.textScale + 1, 3);
        else if (a === 'decreaseText')  state.textScale = Math.max(state.textScale - 1, 0);
        else                            state[a] = !state[a];
        applyState();
      });
    });

    const togglePanel = (force) => {
      const opening = force !== undefined ? force : !panel.classList.contains('open');
      panel.classList.toggle('open', opening);
      btn.setAttribute('aria-expanded', opening);
      panel.setAttribute('aria-hidden', !opening);
      if (opening) closeBtn.focus();
    };

    btn.addEventListener('click', () => togglePanel());
    closeBtn.addEventListener('click', () => togglePanel(false));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        togglePanel(false);
        btn.focus();
      }
    });

    document.addEventListener('click', e => {
      if (panel.classList.contains('open') &&
          !panel.contains(e.target) && !btn.contains(e.target)) {
        togglePanel(false);
      }
    });
  })();


  /* ════════════════════════════════════════════════════════
     9. ARTICLES LIST PAGE — Category Filter
  ════════════════════════════════════════════════════════ */
  (function initArticleFilter() {
    const filterBar = document.querySelector('.alp-filter-bar');
    if (!filterBar) return;

    const filterBtns   = filterBar.querySelectorAll('.alp-filter-btn');
    const cards        = document.querySelectorAll('.alp-card');
    const featuredCard = document.querySelector('.alp-featured-card');
    const noResults    = document.querySelector('.alp-no-results');
    const featuredWrap = document.querySelector('.alp-featured-wrap');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });

        if (featuredWrap) {
          const featuredCat = featuredCard ? featuredCard.dataset.category : '';
          featuredWrap.style.display =
            filter === 'all' || filter === featuredCat ? '' : 'none';
        }

        let visible = 0;
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
          if (match) visible++;
        });

        if (noResults) noResults.style.display = visible === 0 ? '' : 'none';
      });
    });
  })();

});
