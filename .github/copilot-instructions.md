# AI Agent Instructions for Knox Ramsey Thrillers Website

## Project Overview
This repository contains the Knox Ramsey Thrillers website, a static HTML/CSS/JS site focusing on the debut novel "Dark Recipe" and its companion Field Guide. The site showcases interactive systems diagrams, simulated control interfaces, and technical documentation that supports the novel's narrative.

**Technology Stack:**
- Static HTML5/CSS3/JavaScript (no build tools or package.json)
- Mermaid.js v10 for system architecture diagrams
- svg-pan-zoom v3.6.1 for diagram interaction
- Fuse.js v6.6.2 for fuzzy search
- GitHub Pages deployment (note `.nojekyll` file)
- Google Analytics (G-6R38ZMH8Y8)

## Site Architecture

### Structure
```
/                           # Root (marketing pages)
├── index.html             # Homepage with intel ticker, threat cards
├── teaser.html            # Book prologue
├── about.html, recipe.html (legacy HMI)
├── /fieldguide/          # Technical companion (access-gated)
│   ├── _canon.json        # Story bible for character names
│   ├── index.json         # Search index
│   ├── /dramatis-personae/ # Character list (canon-validated)
│   ├── /biology/, /intelligence/, /systems/, /threats/, /glossary/
├── /assets/
│   ├── /css/site.css      # Logo styles only
│   └── /js/fieldguide.js  # Search, scrollspy, access gate (248 lines)
├── /tools/
│   └── check_dramatis_personae.py  # Canon validator
└── .githooks/
    └── pre-commit         # Runs canon check
```

### Key Components

#### Access Control System
`fieldguide.js` implements localStorage-based gating:
- `FIELD_GUIDE_GATED = true` — toggle to enable/disable
- `hasAccess()` checks for `localStorage.getItem('knoxramsey_fieldguide_access') === 'granted'`
- Redirects to `/fieldguide/access.html?return=<path>` if unauthorized
- Homepage and gate page itself bypass check
- Global `window.FieldGuideAccess` API for gate page integration

#### Field Guide System
**Sidebar:** Hardcoded in each page (dynamic injection disabled for reliability)
- Original plan: Inject from `_sidebar.html`, now using inline markup
- `fieldguide.js` checks for existing `.sidebar` and skips if found

**Search:** `index.json` → Fuse.js (fallback to substring). Max 8 results at `#fg-search-results`

**Scroll-Spy:** IntersectionObserver with thresholds `[0, 0.2, 0.4, 0.6, 0.8, 1.0]`, root margin `-15% 0px -35% 0px`

**Keyboard Nav:**
- `j/k` — next/prev section | `Home/End` — first/last | `1-9` — jump to section N
- Disabled in input/textarea | Adds `.fg-highlight` flash animation

#### HMI Dashboards
**Live Dashboard:** `fieldguide/systems/dashboard.html` (848 lines)
- Real-time event simulation: `generateEvent()` → severity ('info', 'warn', 'error', 'critical')
- Grid layout for sensor/actuator displays with pulse animations
- GA tracking enabled

**Legacy:** `recipe.html` — original HMI, kept for compatibility

#### Mermaid Diagrams
**Theme:** `fieldguide.js` injects CSS overrides (lines 222-236) → dark bg (#0d171c), green borders (#52ffa8)
**Pan/Zoom:** `svg-pan-zoom` on all `.mermaid svg` (0.3x–16x)
**Architecture:** Edge (sensors/actuators) → Site (Gateway, Safety Kernel) → Cloud (FarmLytics)

### Layout Patterns

**Binder (280px sidebar + content):** Field Guide pages, stacks at 900px
**Page Grid (content + 320px sidebar):** Homepage, stacks at 980px
**Sticky Sidebar:** `position: sticky; top: 80px;` with `max-height: calc(100vh - 100px)`

## Development Patterns

### CSS Variables (`:root`)
```css
--bg: #071014; --panel: #0c151a; --ink: #e8eef5; --muted: #9fb2c7;
--accent: #52ffa8 (green); --accent2: #4cc9f0 (blue); --warn: #ffd166; 
--danger: #ff4b3e; --critical: #ff2244; --line: #17313d;
```
Use `--accent` for links/CTAs, `--critical` for HMI alerts. Test contrast (WCAG AA: 4.5:1).

### Responsive Breakpoints
980px (page grid) | 900px (binder) | 768px (mobile nav) | 600px (banner) | 480px (optimizations)

### JavaScript Patterns

**IIFE Module:** `fieldguide.js` wraps logic in `(function(){ ... })()`, gates on `inFieldGuide()`
**Async CDN Load:** Promise-wrap script tags for Fuse.js, check `window.Fuse` first
**Event Guards:** Disable keyboard nav when `activeElement` is `INPUT|TEXTAREA`

### HTML Structure
- Inline `<style>` in `<head>` (site.css only has logo styles)
- Nav: sticky `.nav` with `.brand` (logo) + `.links` (Home, Field Guide, Dark Recipe, About)
- Load `fieldguide.js` before `</body>`
- ARIA: `aria-label` on nav/sidebar, semantic tags (`<aside>`, `<main>`)

### Content Guidelines
**Canon Validation:** Characters in `dramatis-personae/index.html` must match `_canon.json`
**Brand Names:** FarmCore (edge), FarmLytics (cloud)
**Disclaimers:** "Educational context only" on technical pages

## External Dependencies

**CDN:** Mermaid.js v10 (ESM), svg-pan-zoom v3.6.1, Fuse.js v6.6.2 (dynamic)
**Analytics:** GA4 `G-6R38ZMH8Y8` on `recipe.html`, `dashboard.html`
**Deployment:** GitHub Pages, `.nojekyll`, custom domain via `CNAME`, no build process

## Workflow

### Local Dev
No build tools. Serve with `python3 -m http.server 8000` or open HTML directly.

### Pre-Commit Hook (Canon Validation)
**Setup once per clone:**
```bash
git config core.hooksPath .githooks
```
**What it does:** `.githooks/pre-commit` runs `tools/check_dramatis_personae.py` to ensure every character in `_canon.json` appears in `dramatis-personae/index.html` (checks name + aliases). Prevents commits that break canon sync.

**When to run manually:**
```bash
python3 tools/check_dramatis_personae.py
```
Use after editing dramatis page or `_canon.json`.

### Adding Field Guide Pages
1. Create HTML in appropriate subdirectory
2. Add entry to `fieldguide/index.json`: `{title, url, excerpt}`
3. Update sidebar nav in page (hardcoded, not injected)
4. Test search and keyboard nav

## Troubleshooting

**Access Gate Issues:** Check `localStorage.getItem('knoxramsey_fieldguide_access')`, bypass on homepage/gate page
**Mermaid Not Rendering:** Validate syntax at [mermaid.live](https://mermaid.live/), check console for errors
**Search Broken:** Validate `index.json` at [jsonlint.com](https://jsonlint.com/), verify `#fg-search-input` exists
**Keyboard Nav Fails:** Ensure sections have IDs, check if input is focused (nav disabled in inputs)
**Canon Check Fails:** Run `python3 tools/check_dramatis_personae.py` — missing characters must be added to dramatis page

## Key Files

**Core JS:** `assets/js/fieldguide.js` — access control, search, scrollspy, keyboard nav
**Canon Source:** `fieldguide/_canon.json` — single source of truth for character names
**Validation:** `tools/check_dramatis_personae.py` — enforces canon sync, runs in pre-commit
**Search Index:** `fieldguide/index.json` — powers Field Guide search
**HMI Examples:** `fieldguide/systems/dashboard.html`, `recipe.html` — event simulation patterns