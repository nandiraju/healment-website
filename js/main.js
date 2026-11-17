/* HealMent — page behaviour. Small, no libraries (the animation player loads on demand). */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) {}
    return null;
  }

  /* ---------- Theme ---------- */
  function setTheme(theme) {
    // Switch instantly: no colour transitions firing across the whole page
    root.setAttribute('data-theme', theme);
    store('healment_theme', theme);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#fbfaff' : '#0e1020');
  }
  function toggleTheme() {
    setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  }
  ['themeToggle', 'themeDemo'].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', toggleTheme);
  });

  /* ---------- Menu, header link highlight, back to top ---------- */
  var menuBtn = document.getElementById('menuToggle');
  var links = document.getElementById('navLinks');
  function setMenu(open) {
    if (!links || !menuBtn) return;
    links.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && links) {
    menuBtn.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
    $$('a', links).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  var toTop = document.getElementById('toTop');
  if (toTop) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        toTop.classList.toggle('show', window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  if ('IntersectionObserver' in window) {
    var navAnchors = $$('.nav-links a[href^="#"]');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAnchors.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navAnchors.forEach(function (a) {
      var t = document.getElementById(a.getAttribute('href').slice(1));
      if (t) spy.observe(t);
    });
  }

  /* ---------- Animated illustrations (Lottie) ----------
     The player and each animation file are fetched only when the picture is about to be seen. */
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var playerPromise = null;
  function loadPlayer() {
    if (playerPromise) return playerPromise;
    playerPromise = new Promise(function (resolve, reject) {
      if (window.lottie) return resolve(window.lottie);
      var s = document.createElement('script');
      s.src = 'js/vendor/lottie_light.min.js';
      s.async = true;
      s.onload = function () { resolve(window.lottie); };
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return playerPromise;
  }

  function mountAnimation(el) {
    var path = el.getAttribute('data-lottie');
    Promise.all([loadPlayer(), fetch(path).then(function (r) { return r.json(); })]).then(function (res) {
      var anim = res[0].loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: res[1],
        rendererSettings: { progressiveLoad: true, preserveAspectRatio: 'xMidYMid meet' }
      });
      if (reduceMotion) { anim.goToAndStop(Math.floor(anim.totalFrames / 2), true); return; }
      // Play only while visible: saves battery and keeps scrolling smooth
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? anim.play() : anim.pause(); });
      }, { threshold: 0.15 }).observe(el);
    }).catch(function () { /* animation is a bonus; the page works without it */ });
  }

  var animEls = $$('[data-lottie]');
  if (animEls.length && 'IntersectionObserver' in window) {
    var lazy = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        mountAnimation(en.target);
      });
    }, { rootMargin: '300px 0px' });
    animEls.forEach(function (el) { lazy.observe(el); });
  }

  /* ---------- Journal box ---------- */
  var replies = {
    calm: 'Peace is a practice. Taking this quiet moment keeps you steady.',
    anxious: 'It is okay to feel anxious. Be kind to yourself. This feeling will pass.',
    grateful: 'Gratitude turns your attention to what is good. Hold on to this warmth.',
    overwhelmed: 'You do not have to carry everything at once. Take just the next slow breath.',
    reflective: 'Looking inward is how change begins. Take your time.'
  };
  var reply = document.getElementById('reply');
  function say(label, text) {
    if (!reply) return;
    reply.textContent = '';
    var b = document.createElement('strong');
    b.textContent = label + ' ';
    reply.appendChild(b);
    reply.appendChild(document.createTextNode(text));
  }
  var moodChips = $$('[data-mood]');
  moodChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      moodChips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      say('A gentle thought:', replies[chip.dataset.mood] || '');
    });
  });
  var thought = document.getElementById('thought');
  if (thought) {
    thought.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.shiftKey) return;
      e.preventDefault();
      var v = thought.value.trim();
      if (v) say('Well done for writing that down.', 'Putting a thought into words makes it lighter to carry.');
    });
  }

  /* ---------- Prompts ---------- */
  var prompts = [
    ['anxiety', 'Calm', 'What is one worry on your mind right now, and what tells you it will be okay?'],
    ['anxiety', 'Calm', 'Name three things you can control today, and one you can let go of.'],
    ['anxiety', 'Calm', 'If a close friend felt this way, what kind words would you say to them?'],
    ['anxiety', 'Calm', 'Take a slow breath. How does your body feel right now? Describe it without judging.'],
    ['gratitude', 'Gratitude', 'What small moment made you smile today, even for a second?'],
    ['gratitude', 'Gratitude', 'Who are you thankful for, and why?'],
    ['gratitude', 'Gratitude', 'What everyday comfort do you often overlook that you appreciate today?'],
    ['gratitude', 'Gratitude', 'What hard time did you get through that made you stronger?'],
    ['reflection', 'Reflection', 'Which feelings have kept coming back this week, and what might they be telling you?'],
    ['reflection', 'Reflection', 'How have your daily habits helped or hurt your peace of mind lately?'],
    ['reflection', 'Reflection', 'Where in your life are you being too hard on yourself?'],
    ['reflection', 'Reflection', 'What boundary do you need to set to protect your energy?'],
    ['growth', 'Growth', 'What is one small step you can take tomorrow to feel more at peace?'],
    ['growth', 'Growth', 'Which belief about yourself would you like to gently let go of?'],
    ['growth', 'Growth', 'What does a balanced life look like for you right now?'],
    ['evening', 'Evening', 'What can you let go of before sleep so tomorrow starts fresh?'],
    ['evening', 'Evening', 'Celebrate one win from today, however small.'],
    ['evening', 'Evening', 'What did your body and mind need today? Did you make room for it?']
  ];
  var cat = 'all';
  var lastIdx = -1;
  var tagEl = document.getElementById('promptTag');
  var textEl = document.getElementById('promptText');
  var catChips = $$('[data-cat]');

  function showPrompt() {
    if (!tagEl || !textEl) return;
    var pool = prompts.filter(function (p) { return cat === 'all' || p[0] === cat; });
    if (!pool.length) return;
    var i;
    do { i = Math.floor(Math.random() * pool.length); } while (pool.length > 1 && pool[i] === prompts[lastIdx]);
    lastIdx = prompts.indexOf(pool[i]);
    textEl.style.opacity = '0';
    setTimeout(function () {
      tagEl.textContent = pool[i][1];
      textEl.textContent = '“' + pool[i][2] + '”';
      textEl.style.opacity = '1';
    }, reduceMotion ? 0 : 120);
  }
  catChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      catChips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      cat = chip.dataset.cat;
      showPrompt();
    });
  });
  var shuffle = document.getElementById('shuffle');
  if (shuffle) shuffle.addEventListener('click', showPrompt);

  var copyBtn = document.getElementById('copyPrompt');
  if (copyBtn && textEl) {
    copyBtn.addEventListener('click', function () {
      var text = textEl.textContent.replace(/^“|”$/g, '');
      var done = function (msg) {
        copyBtn.textContent = msg;
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Could not copy'); });
      } else { done('Could not copy'); }
    });
  }

  /* ---------- Phone scan dialog ---------- */
  var modal = document.getElementById('qrModal');
  if (modal) {
    var lastFocus = null;
    var closeBtn = document.getElementById('qrClose');
    var tabs = $$('[data-qr-tab]', modal);
    var panes = { ios: document.getElementById('qrIos'), android: document.getElementById('qrAndroid') };

    var pick = function (type) {
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t.dataset.qrTab === type)); });
      panes.ios.hidden = type !== 'ios';
      panes.android.hidden = type !== 'android';
    };
    var open = function (type) {
      lastFocus = document.activeElement;
      // Load the code images only when the dialog is first opened
      $$('img[data-src]', modal).forEach(function (im) { im.src = im.dataset.src; delete im.dataset.src; });
      pick(type || 'ios');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };
    var close = function () {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    $$('.open-qr').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); open(b.dataset.qr); });
    });
    tabs.forEach(function (t) { t.addEventListener('click', function () { pick(t.dataset.qrTab); }); });
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {                         // keep keyboard focus inside the dialog
        var f = $$('button, a[href]', modal).filter(function (n) { return !n.closest('[hidden]'); });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
})();
