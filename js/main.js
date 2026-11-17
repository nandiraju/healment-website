/**
 * HEALMENT - ULTRA MODERN WEB APPLICATION SCRIPT
 * Lightweight, zero dependencies, high performance vanilla JavaScript
 */

(function () {
  'use strict';

  // --- 1. THEME SWITCHER (Dark / Light Mode) ---
  const THEME_STORAGE_KEY = 'healment_theme';
  const themeToggles = document.querySelectorAll('.theme-toggle-btn');
  const docElement = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    docElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Update theme icons on all toggles
    themeToggles.forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      const labelText = btn.querySelector('.theme-label-text');
      
      if (sunIcon && moonIcon) {
        if (theme === 'light') {
          sunIcon.style.display = 'none';
          moonIcon.style.display = 'block';
        } else {
          sunIcon.style.display = 'block';
          moonIcon.style.display = 'none';
        }
      }
      if (labelText) {
        labelText.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
      }
    });

    // Also sync the mini preview inside the Bento Card if present
    const themeIndicator = document.getElementById('current-theme-name');
    if (themeIndicator) {
      themeIndicator.textContent = theme === 'light' ? 'Light Theme Active' : 'Dark Theme Active';
    }
  }

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = docElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });

  // Listen for system theme changes if user has no stored preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  // --- 2. STICKY NAVBAR & ACTIVE LINK TRACKING ---
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow on scroll
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // --- 3. MOBILE MENU TOGGLE ---
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-links');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('.hamburger-icon');
      if (icon) {
        icon.textContent = isOpen ? '✕' : '☰';
      }
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('.hamburger-icon');
        if (icon) icon.textContent = '☰';
      });
    });
  }


  // --- 4. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('in-view'));
  }


  // --- 5. INTERACTIVE 200+ GUIDED PROMPT EXPLORER ---
  const promptsDatabase = [
    // Anxiety & Relief
    { category: 'anxiety', categoryName: 'Calming Anxiety', text: 'What is one worry currently on your mind, and what evidence is there that everything will be okay?' },
    { category: 'anxiety', categoryName: 'Calming Anxiety', text: 'Name 3 things within your control right now, and let go of 1 thing outside your control.' },
    { category: 'anxiety', categoryName: 'Calming Anxiety', text: 'If your best friend were feeling this exact stress, what compassionate words would you say to them?' },
    { category: 'anxiety', categoryName: 'Calming Anxiety', text: 'Breathe deeply. Describe the physical sensation in your body right now without judging it.' },

    // Gratitude & Positivity
    { category: 'gratitude', categoryName: 'Gratitude & Positivity', text: 'What small moment or gesture made you smile today, even for a brief second?' },
    { category: 'gratitude', categoryName: 'Gratitude & Positivity', text: 'Who is one person in your life that you are deeply grateful for, and why?' },
    { category: 'gratitude', categoryName: 'Gratitude & Positivity', text: 'What is an everyday comfort or convenience you often overlook that you appreciate today?' },
    { category: 'gratitude', categoryName: 'Gratitude & Positivity', text: 'What is a past challenge that you overcame which made you stronger today?' },

    // Self-Reflection
    { category: 'reflection', categoryName: 'Self-Reflection', text: 'What emotions have been the most persistent this week, and what might they be trying to tell you?' },
    { category: 'reflection', categoryName: 'Self-Reflection', text: 'How have your daily habits supported or hindered your mental peace over the last few days?' },
    { category: 'reflection', categoryName: 'Self-Reflection', text: 'In what areas of your life are you currently being too hard on yourself?' },
    { category: 'reflection', categoryName: 'Self-Reflection', text: 'What is one boundary you need to set or maintain to protect your energy?' },

    // Growth & Goals
    { category: 'growth', categoryName: 'Growth & Goals', text: 'What is one small step you can take tomorrow that brings you closer to personal peace?' },
    { category: 'growth', categoryName: 'Growth & Goals', text: 'What belief about yourself would you like to gently rewrite or let go of?' },
    { category: 'growth', categoryName: 'Growth & Goals', text: 'What does living a truly balanced life look like to you in this current chapter?' },

    // Evening Wind-down
    { category: 'evening', categoryName: 'Evening Wind-down', text: 'What can you release from today before going to sleep so tomorrow can start fresh?' },
    { category: 'evening', categoryName: 'Evening Wind-down', text: 'Celebrate one win from today, no matter how small it might seem.' },
    { category: 'evening', categoryName: 'Evening Wind-down', text: 'What did your body and mind need today, and did you give it space?' }
  ];

  let currentCategory = 'all';
  const promptCategoryTag = document.getElementById('promptCategoryTag');
  const promptTextQuote = document.getElementById('promptTextQuote');
  const shufflePromptBtn = document.getElementById('shufflePromptBtn');
  const copyPromptBtn = document.getElementById('copyPromptBtn');
  const promptCategoryTabs = document.querySelectorAll('.prompt-tab-btn');

  function getFilteredPrompts() {
    if (currentCategory === 'all') return promptsDatabase;
    return promptsDatabase.filter(p => p.category === currentCategory);
  }

  function displayRandomPrompt() {
    const list = getFilteredPrompts();
    if (list.length === 0) return;
    const randomItem = list[Math.floor(Math.random() * list.length)];

    if (promptTextQuote && promptCategoryTag) {
      promptTextQuote.style.opacity = '0';
      promptCategoryTag.style.opacity = '0';
      
      setTimeout(() => {
        promptTextQuote.textContent = `“${randomItem.text}”`;
        promptCategoryTag.textContent = randomItem.categoryName;
        promptTextQuote.style.opacity = '1';
        promptCategoryTag.style.opacity = '1';
      }, 150);
    }
  }

  if (shufflePromptBtn) {
    shufflePromptBtn.addEventListener('click', displayRandomPrompt);
  }

  if (copyPromptBtn && promptTextQuote) {
    copyPromptBtn.addEventListener('click', () => {
      const textToCopy = promptTextQuote.textContent.replace(/^“|”$/g, '');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyPromptBtn.innerHTML;
        copyPromptBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
          copyPromptBtn.innerHTML = originalText;
        }, 1800);
      }).catch(() => {
        copyPromptBtn.innerHTML = 'Prompt ready!';
      });
    });
  }

  promptCategoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      promptCategoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category || 'all';
      displayRandomPrompt();
    });
  });

  // Initialize initial prompt
  displayRandomPrompt();


  // --- 6. MINDFUL SANDBOX / THOUGHT PROCESSOR ---
  const moodChips = document.querySelectorAll('.mood-chip');
  const sandboxInput = document.getElementById('sandboxInput');
  const sandboxResult = document.getElementById('sandboxResult');

  const moodReflections = {
    calm: 'Peace is a practice. Taking this quiet moment reinforces your inner stability.',
    anxious: 'It is okay to feel anxious. Acknowledge this feeling with tenderness—it is just passing through.',
    grateful: 'Gratitude rewires the mind toward abundance. Holding onto this warmth strengthens your resilience.',
    overwhelmed: 'You do not have to carry everything at once. Pick just the next gentle breath.',
    reflective: 'Looking inward is the greatest catalyst for self-awareness and positive change.'
  };

  moodChips.forEach(chip => {
    chip.addEventListener('click', () => {
      moodChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const mood = chip.dataset.mood;
      if (sandboxResult && moodReflections[mood]) {
        sandboxResult.style.display = 'block';
        sandboxResult.innerHTML = `<strong>Gentle Reflection:</strong> ${moodReflections[mood]}`;
      }
    });
  });

  if (sandboxInput && sandboxResult) {
    sandboxInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = sandboxInput.value.trim();
        if (text.length > 0) {
          sandboxResult.style.display = 'block';
          sandboxResult.innerHTML = `<strong>Thought Honored:</strong> "<em>${text}</em>" — Journaling externalizes what we carry inside. Freeing your thoughts brings immediate clarity.`;
        }
      }
    });
  }


  // --- 7. APP SCREENS TOUR / TABS ---
  const screenTabButtons = document.querySelectorAll('.screen-tab-button');
  const showcasePanels = document.querySelectorAll('.showcase-screen-panel');

  screenTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetScreen = btn.dataset.screen;
      
      screenTabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      showcasePanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `screen-${targetScreen}`) {
          panel.classList.add('active');
        }
      });
    });
  });


  // --- 8. QR CODE MODAL LOGIC ---
  const qrModal = document.getElementById('qrModal');
  const qrOpenBtns = document.querySelectorAll('.open-qr-modal-btn');
  const qrCloseBtn = document.getElementById('closeQrModal');
  const qrTabButtons = document.querySelectorAll('.qr-tab');
  const qrIosContent = document.getElementById('qrContentIos');
  const qrAndroidContent = document.getElementById('qrContentAndroid');

  function openQrModal(defaultTab = 'ios') {
    if (!qrModal) return;
    qrModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchQrTab(defaultTab);
  }

  function closeQrModal() {
    if (!qrModal) return;
    qrModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function switchQrTab(type) {
    qrTabButtons.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.qr-tab[data-tab="${type}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    if (type === 'ios') {
      if (qrIosContent) qrIosContent.style.display = 'flex';
      if (qrAndroidContent) qrAndroidContent.style.display = 'none';
    } else {
      if (qrIosContent) qrIosContent.style.display = 'none';
      if (qrAndroidContent) qrAndroidContent.style.display = 'flex';
    }
  }

  qrOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.dataset.qrType || 'ios';
      openQrModal(tab);
    });
  });

  if (qrCloseBtn) qrCloseBtn.addEventListener('click', closeQrModal);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  qrTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchQrTab(btn.dataset.tab);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal && qrModal.classList.contains('open')) {
      closeQrModal();
    }
  });

})();
