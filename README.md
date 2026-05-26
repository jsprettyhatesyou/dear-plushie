# dear plushie! 🧸💌

A soft-pink claw-machine messaging prototype.
*“someone secretly left a soft little feeling for you.”*

---

## 📁 Structure

```
dear-plushie/
├─ index.html      ← the app — fully self-contained, open it in any browser
├─ assets/         ← original JSX source files (reference only, not needed at runtime)
│   ├─ app.jsx
│   ├─ screens.jsx
│   ├─ components.jsx
│   ├─ ios-frame.jsx
│   └─ tweaks-panel.jsx
└─ README.md
```

`index.html` is a **single self-contained HTML file** — all fonts, React,
Babel, CSS, and JSX are inlined. No external requests, no build step,
no server required. It will open offline.

---

## 🚀 Deploy

### Drag & drop to Netlify (fastest)
1. Go to **https://app.netlify.com/drop**
2. Drag the entire `dear-plushie/` folder onto the drop zone
3. You get a URL like `https://dear-plushie-xxxx.netlify.app` instantly
4. *(optional)* In Site settings → Change site name → `dearplushie`

### Or push to a Git host + connect Netlify
```bash
cd dear-plushie
git init
git add .
git commit -m "dear plushie · initial"
# push to GitHub / GitLab
# then: Netlify → Add new site → Import from Git → pick the repo
```
No build command required. Publish directory: `/` (root). Netlify will
serve `index.html` directly.

### Or open it locally
Just double-click `index.html`. Works offline.

---

## 📱 Responsive

- **< 768px** → renders as a native mobile web app (no fake phone frame,
  uses safe-area insets, tab bar fixed to viewport bottom)
- **≥ 768px** → renders as an iPhone preview mockup centered on the page

CSS `@media` queries gate the layout — works the same on real phones,
emulated viewports, and dev tools.

---

## ✨ Features inside

- **Shelf** — your collected plushies on cozy wooden shelves
- **Arcade** — four claw machines (daily / friends / soft strangers / midnight capsule)
- **Claw machine** — aim with ◀ ▶, drop the claw, catch a plushie
- **Send a plushie** — pick from 24 plushies/charms, write a 140-char tiny secret,
  send to a friend or anonymously as "a soft stranger"
- **Cozy circles** — share a 6-character code (`MOON42`) to let friends join your
  shelf, or join theirs (`SOFT42` · `CLOUD9` · `MOCHI4`)
- **Tweaks panel** — cycle palettes, swap heading fonts, change voice tone

---

## 🎨 Design system

| Token | Value |
|---|---|
| Soft Pink | `#F8DDE3` |
| Cream | `#FFF9F5` |
| Plush Brown | `#C69C84` |
| Milk Tea | `#E8D9CF` |
| Lavender | `#C8B6E2` |
| Peach | `#FFD6C2` |
| Ink (text) | `#4A3B36` |

Type: **Fredoka** (headings, rounded warm) · **Inter** (body) · **Caveat** (signatures)

---

## 🛠 Editing

To make changes:
1. Edit the JSX files in `assets/`
2. Re-bundle them into a single HTML (the original build flow inlines
   React + Babel + JSX into `index.html`)

If you only need to swap copy or colors, you can also edit `index.html`
directly — just search for the string you want to change.

---

♡ Built with care · ship something gentle
