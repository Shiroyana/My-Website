(() => {
  // Motion preference. CSS covers the declarative animations; this covers
  // the pricing count-up and the back-to-top smooth scroll, which a
  // stylesheet can't reach.
  const reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  // Industry marquee - build enough repeated groups that each half of the
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
      marqueeTrack.innerHTML = templateHTML.repeat(repeats * 2);

      // Keep scroll speed constant (~30px/s) regardless of how much content
      // that took, since a wider half otherwise travels further in the same
      // fixed duration and visibly speeds up.
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

  // Hero carousel - rotates the client screenshots in the browser frame.
  // Auto-advance pauses on hover/focus and stops for good once someone uses
  // the indicators, which is the WCAG 2.2.2 pause mechanism for this.
  const heroTrack = document.getElementById('heroTrack');
  const heroDots = document.getElementById('heroDots');
  if (heroTrack && heroDots) {
    const slides = Array.from(heroTrack.querySelectorAll('img'));
    const dots = Array.from(heroDots.querySelectorAll('button'));
    const label = document.getElementById('frameLabel');
    const carousel = document.getElementById('heroCarousel');
    const INTERVAL = 5000;
    let index = 0;
    let timer = null;
    let userTookOver = false;

    const show = (n) => {
      index = (n + slides.length) % slides.length;
      // Slide the whole track by whole slide-widths. Transform only, so the
      // browser can composite it without touching layout.
      heroTrack.style.transform = `translate3d(${index * -100}%, 0, 0)`;
      slides.forEach((img, i) => img.setAttribute('aria-hidden', String(i !== index)));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', String(i === index));
      });
      if (label) label.textContent = slides[index].dataset.label || '';
    };
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };
    const start = () => {
      if (userTookOver || reduceMotion.matches || timer || slides.length < 2) return;
      timer = setInterval(() => show(index + 1), INTERVAL);
    };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        userTookOver = true;
        stop();
        show(i);
      });
    });

    if (carousel) {
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      carousel.addEventListener('focusin', stop);
      carousel.addEventListener('focusout', start);
    }
    // Don't animate against a tab nobody is looking at.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    show(0);
    start();
  }

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
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

  // Process spine fill - fallback for browsers without scroll-driven CSS
  // animations (animation-timeline: view()). Under @supports that CSS wins
  // and .is-filled's transition is disabled, so this is a no-op there.
  const processLine = document.getElementById('processLine');
  if (processLine && 'IntersectionObserver' in window) {
    const lineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            processLine.classList.add('is-filled');
            lineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    lineObserver.observe(processLine.parentElement || processLine);
  } else if (processLine) {
    processLine.classList.add('is-filled');
  }

  // Count-up numbers (pricing)
  const countEls = document.querySelectorAll('.count[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion.matches) {
      el.textContent = target.toLocaleString('en-US');
      return;
    }
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

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;

  // Chat widget
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (chatToggle && chatPanel && chatForm && chatInput && chatMessages) {
    const history = [];
    const openChat = () => {
      chatPanel.hidden = false;
      chatToggle.classList.add('is-open');
      chatToggle.setAttribute('aria-expanded', 'true');
      chatToggle.setAttribute('aria-label', 'Close chat');
      chatInput.focus();
    };
    const closeChat = () => {
      chatPanel.hidden = true;
      chatToggle.classList.remove('is-open');
      chatToggle.setAttribute('aria-expanded', 'false');
      chatToggle.setAttribute('aria-label', 'Open chat');
    };
    chatToggle.addEventListener('click', () => {
      if (chatPanel.hidden) openChat(); else closeChat();
    });
    chatClose.addEventListener('click', closeChat);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !chatPanel.hidden) {
        closeChat();
        chatToggle.focus();
      }
    });

    const addMessage = (role, text) => {
      const el = document.createElement('div');
      el.className = `chat-msg chat-msg-${role}`;
      el.textContent = text;
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return el;
    };

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      addMessage('user', text);
      history.push({ role: 'user', content: text });
      chatInput.value = '';
      chatInput.disabled = true;
      const typingEl = addMessage('typing', 'Thinking...');
      try {
        const res = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });
        const data = await res.json();
        typingEl.remove();
        if (!res.ok || !data.reply) {
          addMessage('error', data.error || 'Something went wrong, try again in a moment.');
        } else {
          addMessage('bot', data.reply);
          history.push({ role: 'assistant', content: data.reply });
        }
      } catch {
        typingEl.remove();
        addMessage('error', "Couldn't reach the assistant. Check your connection and try again.");
      } finally {
        chatInput.disabled = false;
        chatInput.focus();
      }
    });
  }

  // Back-to-top - visible once the first section has scrolled off the top.
  // Observes that section instead of listening on every scroll frame.
  const backToTop = document.getElementById('backToTop');
  const firstSection = document.querySelector('main > section');
  if (backToTop && firstSection && 'IntersectionObserver' in window) {
    const topObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          backToTop.classList.toggle('is-visible', scrolledPast);
        });
      },
      { threshold: 0 }
    );
    topObserver.observe(firstSection);
  }
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  }
})();
