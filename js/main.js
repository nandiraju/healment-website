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
  ['themeToggle'].forEach(function (id) {
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
