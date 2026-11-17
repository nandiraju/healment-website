# How to Update Mobile App Screenshots

This website is configured so you can easily replace the placeholder screenshots with your brand-new high-resolution mobile screenshots whenever you are ready.

---

## 📁 Where the Screenshots Live

All screenshots are stored in `assets/images/`.

| File Name | Placement on Website | Current Dimensions | Description |
| :--- | :--- | :--- | :--- |
| `screen-hero.png` (and `.webp`) | **Hero Section** (Top of page) | 795 × 1598 px | Home / Dashboard interface inside iPhone mockup |
| `screen-journal.png` (and `.webp`) | **Section 1: Journal your thoughts** | 500 × 991 px | Journal entry / Free writing interface |
| `screen-prompts.png` (and `.webp`) | **Section 2: Guided Prompts** | 500 × 1014 px | Guided Prompts list & custom prompts |
| `screen-insights.png` (and `.webp`) | **Section 3: Introspect into patterns** | 500 × 1027 px | Mood charts, analytics & data visualization |
| `screen-summary.png` (and `.webp`) | **Final CTA Banner & App Tour** | 736 × 1503 px | App settings, themes, & bookmarks |

---

## 🚀 How to Replace with New Screenshots

### Option A (Simplest — 1 Step):
1. Rename your new screenshots to match the names above:
   - `screen-hero.png`
   - `screen-journal.png`
   - `screen-prompts.png`
   - `screen-insights.png`
   - `screen-summary.png`
2. Drop them directly into `assets/images/`, replacing the existing files.

### Option B (If you want automatic WebP generation):
Run this single terminal command to regenerate ultra-fast `.webp` versions:
```bash
python3 -c "
from PIL import Image
import glob, os

for png in glob.glob('assets/images/screen-*.png'):
    webp_path = os.path.splitext(png)[0] + '.webp'
    im = Image.open(png)
    im.save(webp_path, 'WEBP', quality=92)
    print(f'Optimized {png} -> {webp_path}')
"
```

---

## 💡 Screenshot Tips for Best Visual Results
- **Format:** Transparent PNG or framed mockup (either raw iPhone screenshots or screenshots inside device frames work seamlessly).
- **Aspect Ratio:** Standard iPhone aspect ratio (19.5:9 or ~9:19.5).
- **Resolution:** Widths between 500px and 800px give sharp results on Retina displays without inflating page weight.
