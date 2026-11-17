# HealMent Web Application

> **Journal your way to better mental health.**  
> Ultra-modern, responsive, high-performance website engineered for instantaneous loading on GitHub Pages.

---

## 🌟 Overview & Redesign Report

This repository contains the first version of the modern **HealMent** web application, redesigned from the ground up to replace the legacy builder site while preserving 100% of the authentic mental wellness content, brand messaging, and official app store links.

### 🚀 Key Improvements & Technical Specifications

1. **Ultra-Fast Performance on GitHub Pages:**
   - **Zero Bulky Dependencies:** 100% vanilla HTML5, CSS3, and modern vanilla JavaScript. No heavy bootstrap CSS, jQuery, or bloated icon font files.
   - **Lightweight Image Architecture:** All mobile screenshots optimized with modern `.webp` formats and legacy `.png` fallbacks using `<picture>` tags.
   - **Resource Prioritization:** `fetchpriority="high"` for the critical above-the-fold hero mockup; `loading="lazy"` and `decoding="async"` for all below-the-fold assets.
   - **Jekyll Bypass:** [`.nojekyll`](.nojekyll) included so GitHub Pages serves static files directly with zero processing overhead.

2. **Ultra-Modern UI/UX Design System:**
   - **Mindful & Restorative Color Palette:** Deep calm indigo and cyan accents (`#6366f1` / `#06b6d4`), atmospheric ambient light glows, and subtle glassmorphism cards (`backdrop-filter: blur(16px)`).
   - **Fluid Typography:** Headings scale gracefully across devices via CSS `clamp()` functions.
   - **Configurable Dark / Light Mode:** Fully synced with system preferences and persisted via `localStorage`, featuring a header toggle and an in-card interactive preview.

3. **Interactive Features:**
   - **200+ Guided Prompt Explorer:** Categorized by *Calming Anxiety, Gratitude & Positivity, Self-Reflection, Growth & Goals, and Evening Wind-down*, with instant shuffle and one-click copy.
   - **Interactive Mindful Sandbox:** Allows users to select their current emotional state (*Calm, Anxious, Grateful, Overwhelmed, Reflective*) and receive reassuring mindfulness reflections.
   - **5-Screen App Tour:** An interactive tabbed showcase letting visitors explore each key screen of the Healment mobile application.
   - **Desktop QR Code Scanner:** Instant modal with QR codes for both Apple App Store and Google Play Store so visitors can scan and install directly with their phone camera.

---

## 📁 Repository Structure

```text
├── .gitignore               # Ignored files (.DS_Store, etc.)
├── .nojekyll                # Disables Jekyll on GitHub Pages
├── README.md                # Project report and documentation
├── SCREENSHOTS_GUIDE.md     # Instructions for swapping mobile app screenshots
├── index.html               # Semantic HTML5 single-page application
├── css/
│   └── style.css            # Modular, zero-dependency design system
├── js/
│   └── main.js              # Lightweight, deferred vanilla JS interactions
└── assets/
    └── images/              # Optimized SVG icons, QR codes, and app screens
        ├── logo-healment.svg
        ├── qr-ios.svg
        ├── qr-android.svg
        ├── screen-hero.webp / .png
        ├── screen-journal.webp / .png
        ├── screen-prompts.webp / .png
        ├── screen-insights.webp / .png
        └── screen-summary.webp / .png
```

---

## 📱 Updating Mobile App Screenshots

When new high-resolution screenshots are ready, replace the placeholder files in `assets/images/`:

| File Name | Placement | Description |
| :--- | :--- | :--- |
| `screen-hero.png` | Hero Section | Main dashboard inside phone frame |
| `screen-journal.png` | Journaling Section | Free-form journaling entry screen |
| `screen-prompts.png` | Guided Prompts Section | 200+ guided prompts library |
| `screen-insights.png` | Insights & Patterns | Mood tracking and trend visualization |
| `screen-summary.png` | Final CTA / App Tour | Personalization and bookmarks |

See [`SCREENSHOTS_GUIDE.md`](SCREENSHOTS_GUIDE.md) for full instructions and automated `.webp` conversion commands.

---

## 🔗 Official Links

- **iOS App Store:** [Healment on Apple App Store](https://apps.apple.com/us/app/healment/id1658941963?platform=iphone)
- **Google Play Store:** [Healment on Google Play](https://play.google.com/store/apps/details?id=srikanth.mobileapps.healment)
- **GitHub Repository:** [https://github.com/nandiraju/healment-website](https://github.com/nandiraju/healment-website)

---

## 📄 License & Copyright

© Copyright 2026 HealMent - All Rights Reserved. (Originally founded 2023).
