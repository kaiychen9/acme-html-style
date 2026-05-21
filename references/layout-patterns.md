# Layout Patterns — Acme HTML Style

## Page Shell

Every document wraps content in a `.page` container with generous body padding:

```css
body {
  margin: 0;
  padding: 56px 24px 120px;
  background: var(--ivory);
  color: var(--slate);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.page {
  max-width: 860px;  /* wider: 980px for design systems, 1120px for index */
  margin: 0 auto;
}
```

**Width guidelines:**
- Reports, articles, explainers: `max-width: 860px`
- Design system references: `max-width: 980px`
- Gallery/index pages: `max-width: 1120px`
- Slide decks: `100vw` / `100vh` per slide

## Standard Header

Every document has this three-element header structure:

```html
<header>
  <div class="eyebrow">CATEGORY LABEL</div>
  <h1>Document Title</h1>
  <p class="sub">Brief description with optional <code>inline code</code>.</p>
</header>
```

With optional metadata line below:
```html
<div class="header-top">
  <h1>Title</h1>
  <span class="chip">auto-generated</span>
</div>
<div class="date-range">Mar 10 – Mar 16, 2025 · <span class="repo">repo@branch</span></div>
```

## Section Block

Standard section pattern — h2 heading followed by a thin rule, then content:

```html
<section>
  <h2>Section heading</h2>
  <hr class="rule">
  <!-- content -->
</section>
```

Sections are separated by `margin-bottom: 52px` or `64px`.

## Grid Layouts

### Card Grid (auto-fill, responsive)
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
  gap: 20px;
}
```
Use for: index pages, exploration comparisons, component variant sheets.

### Two-Column: Content + Sidebar
```css
.grid-2col-sidebar {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}
```
Use for: flowcharts with detail panel, explainers with glossary.

### Two-Column: Sidebar + Content
```css
.grid-2col-reverse {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
}
```
Use for: interaction prototypes with annotation panel.

### Two-Column: Equal Split
```css
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
```
Use for: side-by-side comparisons, before/after.

### Stat Grid (4 columns)
```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
@media (max-width: 720px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
```

### Hero Grid (content + figure)
```css
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 48px;
  align-items: end;
}
@media (max-width: 880px) {
  .hero-grid { grid-template-columns: 1fr; }
}
```

## Flex Layouts

### Header with action
```css
.header-flex {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
```

### Row of components
```css
.component-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}
```

## TOC Navigation (Pill Style)

Used in index.html for category navigation:

```css
nav.toc {
  display: flex; flex-wrap: wrap; gap: 8px; padding: 26px 0 0;
}
nav.toc a {
  font-size: 12.5px; padding: 7px 14px;
  border: var(--border); border-radius: var(--radius-pill);
  text-decoration: none; color: var(--gray-700);
  background: var(--white);
  transition: border-color 120ms, color 120ms;
}
nav.toc a:hover { border-color: var(--slate); color: var(--slate); }
```

## Slide Deck Layout

Each slide is a full-viewport section with snap-scroll:

```css
body {
  scroll-snap-type: y mandatory;
  overflow-x: hidden;
}
.slide {
  width: 100vw; height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex; align-items: center; justify-content: center;
  padding: 8vh 6vw;
}
.slide-inner { width: 100%; max-width: 780px; }
.slide.invert { background: var(--slate); color: var(--ivory); }
```

Slide counter uses IntersectionObserver to track current slide.

## Kanban / Column Layout

For editor interfaces (triage boards):

```css
.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.column {
  background: var(--gray-100);
  border-radius: var(--radius-panel);
  padding: 14px;
  min-height: 400px;
}
.column-header {
  font-family: var(--mono);
  font-size: 11px; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--gray-500);
  margin-bottom: 12px;
}
```

## Timeline Pattern

Used in incident reports and implementation plans:

```css
.timeline { position: relative; padding-left: 32px; }
.timeline::before {
  content: ""; position: absolute;
  left: 14px; top: 4px; bottom: 4px;
  width: 2px; background: var(--gray-300);
}
.timeline-entry {
  position: relative; margin-bottom: 24px;
}
.timeline-entry::before {
  content: ""; position: absolute;
  left: -24px; top: 6px;
  width: 10px; height: 10px;
  border-radius: 50%; background: var(--clay);
  border: 2px solid var(--ivory);
}
.timeline-time {
  font-family: var(--mono); font-size: 12px;
  color: var(--gray-500); margin-bottom: 4px;
}
```

## Footer Pattern

Every document ends with a mono-font metadata footer:

```css
footer {
  margin-top: 64px; padding-top: 20px;
  border-top: 1px solid var(--gray-300);
  font-family: var(--mono); font-size: 12px;
  color: var(--gray-500);
}
```

```html
<footer>
  Sources: git log &middot; CI dashboard &middot; deploy log
  &nbsp;&mdash;&nbsp; generated Mar 16 2025 18:02
</footer>
```

## Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| 880px | Hero grid collapses to single column |
| 720px | Stat grid goes from 4→2 columns |
| 640px | Card grid margin-left removed; single column |

Always use `@media (max-width: ...)` — mobile-first is not the pattern here.
