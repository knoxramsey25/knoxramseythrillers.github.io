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

## Core Architecture

### 1. Site Structure
```
/                           # Root - landing pages
├── index.html             # Main homepage with book intro
├── about.html             # About page
├── recipe.html            # Interactive HMI demo (legacy)
├── teaser.html            # Book prologue/teaser
├── /fieldguide/          # Technical companion content
│   ├── index.html        # Field Guide landing with centered logo
│   ├── index.json        # Search index for all FG content
│   ├── _sidebar.html     # Shared sidebar navigation template
│   ├── /biology/         # Plant biology section
│   ├── /intelligence/    # Intelligence context section
│   ├── /systems/         # System architecture & diagrams
│   │   ├── index.html    # Architecture overview with Mermaid
│   │   └── dashboard.html # Live HMI dashboard
│   ├── /threats/         # Threat vectors section
│   └── /glossary/        # Terminology definitions
├── /darkrecipe/          # Book-specific content
├── /assets/              # Shared resources
│   ├── /css/
│   │   └── site.css      # Brand logo styles only
│   └── /js/
│       └── fieldguide.js # Sidebar injection, search, scroll-spy
└── .github/
    └── copilot-instructions.md # This file
```

### 2. Key Components

#### Field Guide System
**Entry Point:** `fieldguide/index.html`
- Centered logo landing page with atmospheric pulse animation
- Uses CSS keyframe animation for logo glow effect
- Links to all Field Guide sections via sidebar

**Dynamic Sidebar Injection:** `assets/js/fieldguide.js` (248 lines)
- Automatically injects shared sidebar from `fieldguide/_sidebar.html`
- Only activates when `location.pathname.startsWith('/fieldguide')`
- Fetches and injects sidebar if no `.sidebar` element exists
- Preserves existing sidebar on pages that have custom ones

**Search System:**
- Index: `fieldguide/index.json` - array of {title, url, excerpt} objects
- Loads Fuse.js from CDN for fuzzy search (fallback to substring matching)
- Search input: `#fg-search-input`, results: `#fg-search-results`
- Displays up to 8 results with title and excerpt

**Scroll-Spy Navigation:**
- Tracks sections with IDs using IntersectionObserver
- Multiple thresholds [0, 0.2, 0.4, 0.6, 0.8, 1.0] for granular tracking
- Adds `.active` class to sidebar links for visible sections
- Root margin: `-15% 0px -35% 0px` for optimal visibility detection

**Keyboard Navigation:**
- `j` / `k` - Navigate to next/previous section (smooth scroll)
- `Home` / `End` - Jump to first/last section
- `1-9` - Jump to sections 1-9 directly
- Disabled when input/textarea is focused
- Visual feedback via `.fg-highlight` class (1s flash animation)

#### Interactive HMI (Human-Machine Interface)
**Main Dashboard:** `fieldguide/systems/dashboard.html`
- Simulates compromised agricultural control system
- Real-time event generation with severity levels
- Status chips with pulse animation for alerts
- Responsive grid layout for sensor/actuator displays

**Legacy Dashboard:** `recipe.html`
- Original HMI implementation (kept for backwards compatibility)
- Google Analytics tracking
- Story notice banner with gradient background
- Mobile-responsive with multiple breakpoints

**Event Simulation Pattern:**
```javascript
function generateEvent() {
  const severities = ['info', 'warn', 'error', 'critical'];
  const timestamp = new Date().toISOString();
  // Return event object with severity, timestamp, message
}
```

#### Mermaid Diagram System
**Configuration:** Inline in `fieldguide/systems/index.html`
```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  securityLevel: "loose",
  themeVariables: {
    background: "#0d171c",
    primaryColor: "#12313d",
    primaryBorderColor: "#52ffa8",
    textColor: "#e8eef5",
    // ... more theme vars
  }
});
```

**Theme Override:** Injected by `fieldguide.js` lines 222-236
- CSS variables: `--mermaid-bg`, `--mermaid-node-bg`, `--mermaid-border`, `--mermaid-text`
- Applies to all `.mermaid` elements site-wide
- Maintains dark theme consistency

**Pan & Zoom:** `svg-pan-zoom` library
- Enabled on all `.mermaid svg` elements
- Grab cursor, min zoom 0.3x, max zoom 16x
- Fits and centers diagrams on load

**Common Diagram Components:**
- Edge Layer: Sensors (Temp, RH, CO2, PAR, PPFD, pH, EC) + Actuators (LED, Pumps, HVAC)
- Site Layer: Gateway, Immutable Log, Safety Kernel
- Cloud Layer: FarmLytics analytics platform

### 3. Layout Systems

#### Binder Layout (Two-Column)
Used in: `fieldguide/index.html`, `fieldguide/systems/index.html`, `fieldguide/systems/dashboard.html`
```css
.binder {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}
@media (max-width: 900px) {
  .binder { grid-template-columns: 1fr; }
}
```
- Sticky sidebar: `position: sticky; top: 80px;`
- Sidebar includes search + navigation
- Content area with `min-width: 0` for text wrapping

#### Page Grid (Asymmetric Two-Column)
Used in: `index.html` (homepage)
```css
.page-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}
```
- Main content + narrower sidebar
- Sidebar contains release info, ISBNs, quick links

## Development Guidelines

### 1. Style Conventions

**CSS Variables (Define in `:root` or inline `<style>`):**
```css
:root {
  --bg: #071014;           /* Main background */
  --panel: #0c151a;        /* Card/panel background */
  --ink: #e8eef5;          /* Primary text */
  --muted: #9fb2c7;        /* Secondary text */
  --accent: #52ffa8;       /* Primary accent (green) */
  --accent2: #4cc9f0;      /* Secondary accent (blue) */
  --warn: #ffd166;         /* Warning yellow */
  --danger: #ff4b3e;       /* Error red */
  --critical: #ff2244;     /* Critical alert red */
  --line: #17313d;         /* Border color */
}
```

**Color Usage Guidelines:**
- `--accent` (#52ffa8): Links, active states, CTAs, highlights
- `--muted` (#9fb2c7): Descriptions, labels, inactive nav
- `--danger` / `--critical`: Alert states in HMI dashboards
- `--warn` (#ffd166): Warning states, attention items

**Responsive Breakpoints:**
- 980px: Page grid switches to single column
- 900px: Binder layout stacks (sidebar on top)
- 768px: Hero grid stacks, mobile header adjustments
- 600px: Story notice banner stacks vertically
- 480px: Further mobile optimizations (font sizes, padding)

**Component Patterns:**
```css
.card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 18px;
}

.btn {
  display: inline-block;
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 10px 14px;
  font-weight: 700;
}
.btn:hover {
  background: rgba(82, 255, 168, 0.1);
}
```

### 2. JavaScript Architecture

**Module Pattern (IIFE):** `fieldguide.js` uses immediately-invoked function expression
```javascript
(function() {
  function inFieldGuide() { return location.pathname.startsWith('/fieldguide'); }
  
  if(inFieldGuide()) {
    // Only run in Field Guide sections
  }
})();
```

**Async Pattern for External Resources:**
```javascript
function loadFuse() {
  if (window.Fuse) return Promise.resolve(window.Fuse);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js';
    script.onload = () => resolve(window.Fuse);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

**DOM Manipulation Best Practices:**
- Check for existing elements before creating: `if(document.querySelector('.sidebar')) return;`
- Use semantic HTML: `<aside>`, `<nav>`, `<main>`
- Set ARIA labels: `aria-label`, `aria-live="polite"`

**Event Listener Patterns:**
```javascript
// Disable keyboard shortcuts when typing
window.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
  // ... handle keyboard shortcuts
});
```

### 3. HTML Patterns

**Standard Page Structure:**
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Page Title | Knox Ramsey</title>
  <link rel="stylesheet" href="/assets/css/site.css">
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="description" content="..."/>
  <meta property="og:title" content="..."/>
  <meta property="og:description" content="..."/>
  <style>
    /* Inline styles for this page */
  </style>
</head>
<body>
  <nav class="nav" aria-label="Primary">
    <div class="wrap bar">
      <div class="brand">
        <img class="brand-logo" src="/assets/knoxramsey_logo.jpeg" 
             alt="Knox Ramsey Thrillers logo" width="112" height="28" 
             loading="lazy" decoding="async"/>
        Knox Ramsey Thrillers
      </div>
      <div class="links">
        <a href="/">Home</a>
        <a href="/fieldguide/">Field Guide</a>
        <a href="/darkrecipe/">Dark Recipe</a>
        <a href="/about.html">About</a>
      </div>
    </div>
  </nav>
  
  <!-- Page content -->
  
  <script src="/assets/js/fieldguide.js"></script>
</body>
</html>
```

**Field Guide Page Pattern:**
- Use `.binder` layout for sidebar + content
- Include search input in sidebar: `<input type="search" placeholder="Search..." aria-label="Search Field Guide">`
- Mark active nav link with `.active` class
- Load `fieldguide.js` at end of body (handles sidebar injection for older pages)

### 4. Content Organization

**Narrative Consistency:**
- Maintain technical accuracy with novel's plot elements
- Use fictional brand names: FarmCore (edge), FarmLytics (cloud)
- Include "Educational context only" disclaimers on technical pages

**Section Structure:**
- Biology: Spectral bands, stress signaling, phototoxic cascade
- Intelligence: MSS, PLA, FAC-17 facility structure
- Systems: FarmCore/FarmLytics architecture, safety kernel, compromised feedback loop
- Threats: Supply chain compromise, certificate spoofing, closed-loop failures
- Glossary: Concise term definitions

## Integration Points

### 1. Analytics
**Google Analytics 4:** `G-6R38ZMH8Y8`
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6R38ZMH8Y8"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-6R38ZMH8Y8');
</script>
```
- Add to `<head>` of pages requiring tracking
- Currently on: `recipe.html`, `fieldguide/systems/dashboard.html`

### 2. External Dependencies (CDN)
**Mermaid.js v10:**
```html
<script type="module">
  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
  mermaid.initialize({ /* config */ });
</script>
```

**svg-pan-zoom v3.6.1:**
```html
<script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
```

**Fuse.js v6.6.2:** Loaded dynamically by `fieldguide.js`
```javascript
s.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js';
```

### 3. GitHub Pages Deployment
- **No build process** - direct file serving
- `.nojekyll` file present (disables Jekyll processing)
- Custom domain: `knoxramseythrillers.com` (via CNAME file)
- Branch: Deploy from `main` or current working branch

## Development Workflow

### 1. Local Development
**No build tools required.** Open HTML files directly in browser or use simple HTTP server:
```bash
# Python 3
python3 -m http.server 8000

# Node.js (if http-server is installed globally)
npx http-server -p 8000
```

Access at: `http://localhost:8000`

### 2. Testing Checklist
- [ ] View in browser at multiple breakpoints (480px, 768px, 900px, 1200px)
- [ ] Test keyboard navigation (j/k/Home/End/1-9) on Field Guide pages
- [ ] Verify search functionality (if editing index.json or search)
- [ ] Check Mermaid diagrams render correctly (if editing diagrams)
- [ ] Test pan/zoom on diagrams (if editing diagram pages)
- [ ] Verify sidebar active states update on scroll
- [ ] Test on mobile device or responsive mode
- [ ] Check browser console for JavaScript errors

### 3. Git Workflow
```bash
# Check status
git status

# Stage specific files (avoid .DS_Store, .vscode)
git add path/to/file.html

# Commit with descriptive message
git commit -m "Add keyboard shortcuts section to systems page"

# Push to GitHub (triggers deploy)
git push origin main
```

### 4. Search Index Updates
When adding new Field Guide pages, update `fieldguide/index.json`:
```json
{
  "title": "Section Name",
  "url": "/fieldguide/section/",
  "excerpt": "Brief description for search results"
}
```

## Debugging Tips

### Common Issues

**1. Sidebar Not Appearing:**
- Check: Is `fieldguide.js` loaded at end of `<body>`?
- Check: Does page have existing `.sidebar` element? (Script won't inject if one exists)
- Check: Is path starting with `/fieldguide`? (Script only runs in FG)
- Check browser console for fetch errors on `_sidebar.html`

**2. Mermaid Diagrams Not Rendering:**
- Check: Is Mermaid script tag present in `<head>`?
- Check: Is `<div class="mermaid">` wrapping the diagram code?
- Check syntax: Copy/paste into [Mermaid Live Editor](https://mermaid.live/) to validate
- Check browser console for Mermaid initialization errors

**3. Search Not Working:**
- Check: Is `index.json` valid JSON? Validate at [JSONLint](https://jsonlint.com/)
- Check: Is Fuse.js loading? Look for network errors in DevTools
- Check: Are IDs `#fg-search-input` and `#fg-search-results` present?

**4. Keyboard Navigation Not Working:**
- Check: Are sections using `<section id="...">` or elements with IDs?
- Check: Is user focused in an input field? (Navigation disabled in inputs)
- Check browser console for JavaScript errors

**5. Scroll-Spy Not Highlighting:**
- Check: Do sidebar links match section IDs? (href="#section-id")
- Check: IntersectionObserver browser support (works in all modern browsers)
- Check: Are sections tall enough to trigger intersection? (Margin: -15% / -35%)

### Browser DevTools Tips
- **Network Tab:** Check if external scripts (Mermaid, Fuse.js, GA) are loading
- **Console Tab:** Watch for JavaScript errors during page load and interaction
- **Elements Tab:** Inspect `.active` class on sidebar links during scroll
- **Responsive Mode:** Test at common breakpoints (375px, 768px, 1024px, 1440px)

## File Locations for Common Tasks

### Adding Content

**New Field Guide Section:**
1. Create directory: `mkdir fieldguide/newsection`
2. Create `fieldguide/newsection/index.html` (copy from existing section)
3. Add to `fieldguide/_sidebar.html`:
   ```html
   <a href="/fieldguide/newsection/">New Section</a>
   ```
4. Add to `fieldguide/index.json`:
   ```json
   {
     "title": "Field Guide — New Section",
     "url": "/fieldguide/newsection/",
     "excerpt": "Description for search"
   }
   ```

**New Mermaid Diagram:**
1. Edit relevant page in `fieldguide/systems/`
2. Add diagram block:
   ```html
   <figure class="figure">
     <header>Diagram Title</header>
     <div class="mermaid">
   flowchart TB
     A[Start] --> B[End]
     </div>
   </figure>
   ```
3. Test pan/zoom functionality after rendering

**New HMI Dashboard:**
1. Create HTML file in `fieldguide/systems/` or root
2. Include CSS variables for theme colors
3. Implement `generateEvent()` function for event simulation
4. Add status chips with pulse animations for alerts
5. Use CSS Grid for sensor/actuator layouts

### Updating Styles

**Global Styles:** `assets/css/site.css` (currently only has logo styles)
- Most styles are inline in each HTML file's `<style>` tag
- When adding site-wide styles, add to `site.css` and link from pages

**Theme Colors:** Update CSS variables in `:root` of each page
- Keep colors consistent across pages
- Test contrast ratios for accessibility (WCAG AA minimum)

**Responsive Breakpoints:** Add or modify `@media` queries in page `<style>`
- Test at standard breakpoints: 480px, 600px, 768px, 900px, 980px, 1200px

### Updating Navigation

**Main Site Nav:** Edit `<nav class="nav">` in each HTML file
- No shared template - update manually across pages
- Keep link order consistent: Home → Field Guide → Dark Recipe → About

**Field Guide Sidebar:** Edit `fieldguide/_sidebar.html`
- Changes automatically apply to all FG pages via `fieldguide.js` injection
- Update `.active` class on pages with custom sidebars

## Common Tasks

### Task: Add New Field Guide Page

1. **Create HTML file** in appropriate subdirectory
2. **Copy structure** from existing Field Guide page (e.g., `fieldguide/biology/index.html`)
3. **Update metadata**: `<title>`, `<meta name="description">`, `<meta property="og:*">`
4. **Add to sidebar**: Edit `fieldguide/_sidebar.html`
5. **Update search**: Add entry to `fieldguide/index.json`
6. **Test**: Load page, verify sidebar appears, test search, check keyboard nav

### Task: Add Mermaid Diagram

1. **Design diagram** at [Mermaid Live Editor](https://mermaid.live/)
2. **Add to page** in `<div class="mermaid">` block
3. **Verify theme**: Check colors match site theme (dark bg, green accents)
4. **Test zoom**: Ensure svg-pan-zoom initializes (grab cursor, zoom works)
5. **Mobile test**: Check diagram is readable at small sizes

### Task: Update Site Colors

1. **Update CSS variables** in `:root` of all HTML files
2. **Test contrast**: Use browser DevTools or [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
3. **Check components**: Buttons, links, active states, alerts, diagrams
4. **Mermaid theme**: Update `themeVariables` in Mermaid initialization AND CSS overrides in `fieldguide.js`

### Task: Fix Responsive Issue

1. **Identify breakpoint**: Use browser responsive mode to find exact width
2. **Add/modify `@media` query** in page `<style>` block
3. **Test at common sizes**: 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (large desktop)
4. **Check both orientations**: Portrait and landscape on mobile/tablet
5. **Test real device**: If possible, verify on actual phone/tablet

### Task: Add Analytics Tracking

1. **Add GA script** to `<head>` (see Integration Points section)
2. **Test in GA Real-Time**: Open page, verify visit appears in GA dashboard
3. **Optional**: Add event tracking for specific interactions:
   ```javascript
   gtag('event', 'event_name', {
     'event_category': 'category',
     'event_label': 'label'
   });
   ```

## Best Practices

### Code Style
- **Indentation**: 2 spaces (matches existing code)
- **Quotes**: Double quotes for HTML attributes, single quotes for JS strings (flexible)
- **Line length**: No strict limit, but keep readable (wrap long lines)
- **Comments**: Add comments for complex logic, especially in `fieldguide.js`

### Accessibility
- Use semantic HTML: `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`
- Include ARIA labels: `aria-label`, `aria-live`, `aria-labelledby`
- Ensure keyboard navigation works (test without mouse)
- Maintain color contrast ratios (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
- Test with screen reader if making significant changes

### Performance
- Lazy load images: `loading="lazy"` on non-critical images
- Async scripts: Use `async` on Google Analytics script
- Minimize inline styles: Consider moving repeated styles to `site.css`
- Optimize images: Use appropriate formats (JPEG for photos, PNG for graphics, SVG for logos)

### SEO
- Unique `<title>` on every page
- Descriptive `<meta name="description">` (150-160 characters)
- Open Graph tags: `og:title`, `og:description`, `og:image`
- Canonical URLs: `<link rel="canonical" href="...">`
- Semantic heading hierarchy: Single `<h1>`, then `<h2>`, `<h3>`, etc.

Remember to maintain narrative consistency with the novel while working on technical implementations. The site serves both as marketing material and as an immersive companion to the story.