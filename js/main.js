(() => {
  // Industry marquee — build enough repeated groups that each half of the
  // track is at least as wide as the visible bar, so the seamless loop
  // (translateX 0 -> -50%) never runs out of content mid-cycle and jumps.
  const marqueeTrack = document.getElementById('marqueeTrack');
  if (marqueeTrack) {
    const templateHTML = marqueeTrack.querySelector('.marquee-group').outerHTML;
    const buildMarquee = () => {
      marqueeTrack.innerHTML = templateHTML;
      const containerWidth = marqueeTrack.parentElement.clientWidth || window.innerWidth;
      const groupWidth = marqueeTrack.firstElementChild.getBoundingClientRect().width;
      if (!groupWidth) return;
      const repeats = Math.ceil(containerWidth / groupWidth) + 1;
      const half = templateHTML.repeat(repeats);
      marqueeTrack.innerHTML = half + half;

      // Keep scroll speed constant (~30px/s) regardless of how much
      // content that took, since a wider half otherwise has to travel
      // further in the same fixed duration and visibly speeds up.
      const halfWidth = repeats * groupWidth;
      marqueeTrack.style.animationDuration = `${(halfWidth / 30).toFixed(1)}s`;
    };
    buildMarquee();
    let marqueeTicking = false;
    window.addEventListener('resize', () => {
      if (!marqueeTicking) {
        requestAnimationFrame(() => { buildMarquee(); marqueeTicking = false; });
        marqueeTicking = true;
      }
    });
  }

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Reveal-on-scroll, staggered within each container
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const groups = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach((els) => {
      els.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Count-up numbers (pricing)
  const countEls = document.querySelectorAll('.count[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && countEls.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    countEls.forEach((el) => countObserver.observe(el));
  } else {
    countEls.forEach((el) => { el.textContent = el.getAttribute('data-count'); });
  }

  // Pricing toggle ($0 down vs. pay upfront)
  const pricingSection = document.getElementById('pricing');
  const pricingToggle = document.querySelector('.pricing-toggle');
  const pricingGrid = document.getElementById('pricingGrid');
  if (pricingSection && pricingToggle && pricingGrid) {
    const toggleBtns = pricingToggle.querySelectorAll('.toggle-btn');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (pricingGrid.getAttribute('data-mode') === mode) return;

        toggleBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        pricingToggle.classList.toggle('mode-zerodown', mode === 'zerodown');
        pricingGrid.setAttribute('data-mode', mode);

        pricingSection.querySelectorAll('.mode-content').forEach((el) => {
          const isMatch = el.getAttribute('data-mode') === mode;
          el.hidden = !isMatch;
          if (isMatch) {
            el.querySelectorAll('.count[data-count]').forEach(animateCount);
          }
        });
      });
    });
  }

  // Process vertical progress line
  const processTrack = document.querySelector('.process-track');
  const processLine = document.getElementById('processLine');
  if (processTrack && processLine) {
    const updateProgress = () => {
      const rect = processTrack.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const started = vh * 0.75 - rect.top;
      const pct = Math.max(0, Math.min(1, started / (total + vh * 0.5)));
      processLine.style.setProperty('--progress', `${pct * 100}%`);
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { updateProgress(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // Diagram fork/merge bars — measure real tick positions instead of
  // guessing a fixed percentage, since branch nodes have unequal widths
  // ("Automation" vs "SEO"/"Analytics") which throws off any fixed guess.
  // Branch widths are also equalized first: flex `justify-content: center`
  // only centers the whole row as a block, so unless the two outer nodes
  // (SEO, Analytics) are equal width, the middle node (Automation) ends up
  // off-center under Website even though the block itself is centered.
  const diagramRow = document.querySelector('.d-row');
  if (diagramRow) {
    const updateDiagramBars = () => {
      const branches = Array.from(diagramRow.querySelectorAll('.d-branch'));
      const topBar = diagramRow.querySelector('.d-bar-top');
      const bottomBar = diagramRow.querySelector('.d-bar-bottom');
      if (branches.length < 2 || !topBar || !bottomBar) return;

      // Centering the middle node only requires the two outer (flanking)
      // nodes to match each other — the middle node's own width is
      // irrelevant to the math. Equalizing all three (rather than just
      // the outer pair) would widen the row unnecessarily and risks
      // wrapping sooner on narrow viewports.
      const outer = [branches[0], branches[branches.length - 1]];
      outer.forEach((b) => { b.style.minWidth = ''; });
      const outerWidth = Math.max(...outer.map((b) => b.getBoundingClientRect().width));
      outer.forEach((b) => { b.style.minWidth = `${outerWidth}px`; });

      const rowRect = diagramRow.getBoundingClientRect();
      const first = branches[0].getBoundingClientRect();
      const last = branches[branches.length - 1].getBoundingClientRect();
      const wrapped = Math.abs(first.top - last.top) > 1;

      const ticks = diagramRow.querySelectorAll('.d-tick');
      if (wrapped) {
        topBar.style.display = 'none';
        bottomBar.style.display = 'none';
        ticks.forEach((t) => { t.style.display = 'none'; });
        return;
      }

      const leftPx = (first.left + first.width / 2) - rowRect.left;
      const rightPx = rowRect.right - (last.left + last.width / 2);
      [topBar, bottomBar].forEach((bar) => {
        bar.style.display = '';
        bar.style.left = `${leftPx}px`;
        bar.style.right = `${rightPx}px`;
      });
      ticks.forEach((t) => { t.style.display = ''; });
    };

    updateDiagramBars();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateDiagramBars);
    }
    let diagramTicking = false;
    window.addEventListener('resize', () => {
      if (!diagramTicking) {
        requestAnimationFrame(() => { updateDiagramBars(); diagramTicking = false; });
        diagramTicking = true;
      }
    });
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;
})();
