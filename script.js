(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const nav = $('#primary-nav');
  const menuToggle = $('.menu-toggle');
  const toast = $('.toast');
  const progress = $('.progress span');
  const topbar = $('#topbar');
  let toastTimer;
  let lenis;
  let roleTimer;

  if ($('#year')) $('#year').textContent = String(new Date().getFullYear());

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2100);
  }

  function setMenu(open) {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
    if (open) requestAnimationFrame(() => $('.nav-link', nav)?.focus({ preventScroll: true }));
    else if (nav.contains(document.activeElement)) menuToggle.focus({ preventScroll: true });
  }

  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  $$('.nav-link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
    if (event.key === 'Tab' && nav?.classList.contains('is-open') && menuToggle) {
      const focusable = [menuToggle, ...$$('.nav-link', nav)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', (event) => {
    if (nav?.classList.contains('is-open') && !nav.contains(event.target) && !menuToggle?.contains(event.target)) setMenu(false);
  });

  function updateChrome() {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${scrollRange > 0 ? (window.scrollY / scrollRange) * 100 : 0}%`;
    topbar?.classList.toggle('is-scrolled', window.scrollY > 18);
  }
  window.addEventListener('scroll', updateChrome, { passive: true });
  window.addEventListener('resize', updateChrome, { passive: true });
  updateChrome();

  const sections = $$('.hero[id], main section[id]');
  const navLinks = $$('.nav-link[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) moveIndicator(link);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => navObserver.observe(section));
  }

  function moveIndicator(link) {
    const indicator = $('.nav-indicator');
    if (!indicator || !nav || window.innerWidth <= 760) return;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  }
  navLinks.forEach((link) => link.addEventListener('focus', () => moveIndicator(link)));
  window.addEventListener('resize', () => moveIndicator($('.nav-link.is-active')));
  moveIndicator($('.nav-link.is-active'));

  const roles = ['Digital Marketing', 'Performance Marketing', 'Growth Strategy', 'Technology'];
  const roleElement = $('.role-rotator');
  if (roleElement && !reducedMotion.matches) {
    let roleIndex = 0;
    roleTimer = window.setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      if (gsap) {
        gsap.to(roleElement, { autoAlpha: 0, y: -7, duration: .18, onComplete: () => {
          roleElement.textContent = roles[roleIndex];
          gsap.fromTo(roleElement, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .32, ease: 'power2.out' });
        } });
      } else {
        roleElement.textContent = roles[roleIndex];
      }
    }, 2400);
  }

  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis && !reducedMotion.matches) {
      try {
        lenis = new window.Lenis({ anchors: true, lerp: .085, wheelMultiplier: .9, touchMultiplier: 1, respectReducedMotion: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch (error) {
        console.warn('Smooth scrolling unavailable; using native scrolling.', error);
      }
    }

    if (!reducedMotion.matches) {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .08 });
      intro.from('.hero-eyebrow', { y: 14, autoAlpha: 0, duration: .55 })
        .from('.headline-line', { yPercent: 112, duration: .9, stagger: .13 }, '-=.2')
        .from('.hero-role, .hero-sub, .hero-actions, .hero-proof', { y: 18, autoAlpha: 0, duration: .55, stagger: .1 }, '-=.42')
        .from('.portrait-frame', { y: 24, autoAlpha: 0, scale: .985, duration: .9 }, '-=.6')
        .fromTo('.profile-photo', { clipPath: 'inset(100% 0 0 0 round 48% 48% 2px 2px)', scale: 1.08 }, { clipPath: 'inset(0% 0 0 0 round 48% 48% 2px 2px)', scale: 1, duration: 1.15, ease: 'power3.inOut' }, '-=.76')
        .fromTo('.hero-orbit', { autoAlpha: 0, scale: .7, rotation: -30 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .75, ease: 'back.out(1.4)' }, '-=.78')
        .from('.portrait-caption', { y: 8, autoAlpha: 0, duration: .4 }, '-=.35');

      $$('.section-kicker,.section-heading,.intro-heading,.intro-aside,.values-row,.about-note,.service,.case,.client-card,.certification-card,.film-copy,.number,.timeline-item,.contact-main,.contact-bottom,.contact-card')
        .forEach((element) => {
          gsap.fromTo(element,
            { y: 26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: .75, ease: 'power2.out',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true } }
          );
        });

      $$('.skill-card').forEach((card, index) => gsap.fromTo(card,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, delay: index * .08, duration: .7, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true } }
      ));

      $$('.number [data-count]').forEach((element) => {
        const end = Number(element.dataset.count || 0);
        gsap.fromTo({ value: 0 }, { value: end }, {
          duration: 1.25,
          ease: 'power2.out',
          onUpdate() { element.textContent = String(Math.round(this.targets()[0].value)); },
          scrollTrigger: { trigger: element, start: 'top 90%', once: true }
        });
      });

      if (finePointer.matches) {
        $$('.client-card').forEach((card) => {
          card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;
            gsap.to(card, { '--tilt-x': `${x * 4}deg`, '--tilt-y': `${y * -4}deg`, duration: .35, overwrite: 'auto' });
          });
          card.addEventListener('pointerleave', () => gsap.to(card, { '--tilt-x': '0deg', '--tilt-y': '0deg', duration: .5, ease: 'power2.out' }));
        });
      }

      const portrait = $('.portrait-frame');
      if (portrait && window.innerWidth > 760) {
        gsap.to(portrait, { yPercent: -3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 } });
      }
    } else {
      $$('.number [data-count]').forEach((element) => { element.textContent = element.dataset.count || '0'; });
    }

    ScrollTrigger.refresh();
  } else {
    if (window.Lenis && !reducedMotion.matches) {
      try { lenis = new window.Lenis({ anchors: true, autoRaf: true, respectReducedMotion: true }); }
      catch (error) { console.warn('Smooth scrolling unavailable; using native scrolling.', error); }
    }
    $$('.number [data-count]').forEach((element) => { element.textContent = element.dataset.count || '0'; });
  }

  const soundToggle = $('.sound-toggle');
  soundToggle?.addEventListener('click', () => {
    const active = soundToggle.getAttribute('aria-pressed') !== 'true';
    soundToggle.setAttribute('aria-pressed', String(active));
    soundToggle.querySelector(':scope > span:last-child').textContent = active ? 'DEMO ON' : 'SOUND OFF';
    showToast(active ? 'Ambient sound demo enabled' : 'Ambient sound off');
  });

  const modal = document.createElement('dialog');
  modal.className = 'reel-modal';
  modal.setAttribute('aria-labelledby', 'reel-title');
  modal.innerHTML = '<button class="reel-close" type="button" aria-label="Close showreel">×</button><div class="reel-screen"><div class="reel-orb" aria-hidden="true"></div><div class="reel-silhouette" aria-hidden="true"></div><span class="reel-label">YOUR CAMPAIGN FILM GOES HERE</span><strong id="reel-title">STORIES<br>THAT <em>MOVE.</em></strong><small>REPLACE THIS MOTION PREVIEW WITH YOUR SHOWREEL VIDEO</small></div>';
  document.body.append(modal);
  const openModal = () => {
    if (typeof modal.showModal === 'function') modal.showModal();
    else showToast('Showreel preview is not supported in this browser');
  };
  $$('.film-play,.play').forEach((button) => button.addEventListener('click', openModal));
  $('.reel-close', modal)?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
  modal.addEventListener('close', () => { $('.film-play')?.focus({ preventScroll: true }); });

  if (finePointer.matches && !reducedMotion.matches) {
    const cursor = document.createElement('span');
    cursor.className = 'cursor-orbit';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);
    document.body.classList.add('has-cursor');
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    document.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0) translate(-50%,-50%)`;
        pointerFrame = 0;
      });
    }, { passive: true });

    $$('.magnetic').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const bounds = element.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
        const y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
        element.style.setProperty('--mag-x', `${x * 5}px`);
        element.style.setProperty('--mag-y', `${y * 5}px`);
      });
      element.addEventListener('pointerleave', () => {
        element.style.setProperty('--mag-x', '0px');
        element.style.setProperty('--mag-y', '0px');
      });
    });

    const hero = $('.hero');
    const heroArt = $('.hero-art');
    hero?.addEventListener('pointermove', (event) => {
      if (!heroArt || window.innerWidth <= 760) return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      heroArt.style.setProperty('--parallax-x', `${x * -9}px`);
      heroArt.style.setProperty('--parallax-y', `${y * -7}px`);
    }, { passive: true });
    hero?.addEventListener('pointerleave', () => {
      heroArt?.style.setProperty('--parallax-x', '0px');
      heroArt?.style.setProperty('--parallax-y', '0px');
    });
  }

  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches) {
      window.clearInterval(roleTimer);
      lenis?.destroy();
      if (gsap) {
        gsap.globalTimeline.pause();
        ScrollTrigger?.getAll().forEach((trigger) => trigger.kill());
        gsap.set('.section-kicker,.section-heading,.intro-heading,.intro-aside,.values-row,.about-note,.service,.case,.client-card,.certification-card,.film-copy,.number,.timeline-item,.contact-main,.contact-bottom,.contact-card', { clearProps: 'opacity,visibility,transform' });
      }
    }
  });
})();
