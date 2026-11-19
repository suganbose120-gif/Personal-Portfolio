(() => {
  const progress = document.querySelector('.progress span');
  const year = document.querySelector('#year');
  year.textContent = new Date().getFullYear();

  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealElements = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealElements.forEach((el) => {
      el.classList.add('will-reveal');
      revealObserver.observe(el);
    });

    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const started = performance.now();
        const duration = 1300;
        const frame = (now) => {
          const t = Math.min(1, (now - started) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.7 });
    counters.forEach((el) => countObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
    counters.forEach((el) => { el.textContent = el.dataset.count || '0'; });
  }

  const soundToggle = document.querySelector('.sound-toggle');
  const toggleSound = () => {
    const active = soundToggle.classList.toggle('on');
    soundToggle.setAttribute('aria-label', active ? 'Turn ambient sound off' : 'Turn ambient sound on');
    soundToggle.querySelector(':scope > span:last-child').textContent = active ? 'SOUND ON' : 'SOUND OFF';
    showToast(active ? 'Ambient sound demo enabled' : 'Ambient sound off');
  };
  soundToggle.addEventListener('click', toggleSound);
  soundToggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSound(); }
  });

  const toast = document.querySelector('.toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2100);
  }

  const modal = document.createElement('dialog');
  modal.className = 'reel-modal';
  modal.innerHTML = '<button class="reel-close" aria-label="Close showreel">×</button><div class="reel-screen"><div class="reel-orb"></div><div class="reel-silhouette"></div><span class="reel-label">YOUR CAMPAIGN FILM GOES HERE</span><strong>STORIES<br>THAT <em>MOVE.</em></strong><small>REPLACE THIS MOTION PREVIEW WITH YOUR SHOWREEL VIDEO</small></div>';
  document.body.append(modal);
  const openModal = () => modal.showModal();
  document.querySelectorAll('.film-play, .play').forEach((button) => button.addEventListener('click', openModal));
  modal.querySelector('.reel-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
})();
