# Scenario Guide — Acme HTML Style

Map user requests to the right patterns and components. When a user's request matches one of these 9 categories, follow the corresponding recipe.

## 1. Exploration & Planning

**Trigger phrases**: "compare approaches", "design directions", "implementation plan", "explore options", "plan a feature", "milestones", "trade-offs"

**Key patterns**:
- Side-by-side cards in a `card-grid` (2-3 columns)
- Comparison tables with pro/con indicators
- Timeline SVG for milestones (see Layout Patterns)
- Risk table using `panel-table`
- Code blocks with syntax highlighting via inline styled spans
- Bundle-impact chips

**Reference files**: `04-code-understanding.html`, `01-exploration-code-approaches.html`, `16-implementation-plan.html`

**Composition**:
```
Header (eyebrow + h1 + sub)
├── Section: Approaches grid (card-grid with 2-3 columns)
│   └── Each card: code block + pro/con list
├── Section: Recommendation
│   └── Highlight list + risk table
└── Footer
```

## 2. Code Review & Understanding

**Trigger phrases**: "PR review", "code review", "annotated diff", "PR writeup", "module map", "understand this code", "explain this codebase"

**Key patterns**:
- Diff blocks with line numbers and severity tags
- Comment bubbles (speech-bubble CSS with ::after triangles)
- `<details>` collapsible file sections
- Risk-map chip list
- Interactive checklist in footer
- Module boxes-and-arrows diagram (SVG or CSS)

**Reference files**: `03-code-review-pr.html`, `17-pr-writeup.html`, `04-code-understanding.html`

**Composition**:
```
Header (eyebrow + h1 + sub)
├── Section: Summary / Motivation
│   └── Before/after cards side by side
├── Section: File-by-file tour
│   └── <details> per file with annotated code
├── Section: Review focus areas
│   └── Highlight list with severity badges
└── Footer with checklist
```

## 3. Design

**Trigger phrases**: "design system", "component variants", "style guide", "UI kit", "token reference", "color palette", "type scale"

**Key patterns**:
- Color swatch grid (`.swatch` with `.chip` and labels)
- Type scale table (`.type-scale` with `.type-row`)
- Spacing ruler (horizontal bars with labels)
- Radius cards (`.radius-card`)
- Shadow cards (`.shadow-card`)
- Component stage (`.component-stage`) for live examples

**Reference files**: `05-design-system.html`, `06-component-variants.html`

**Composition**:
```
Header (eyebrow + h1 + sub)
├── Section: Color
│   └── Swatch group (primary) + Swatch group (neutral) + Swatch group (semantic)
├── Section: Typography
│   └── Type scale table
├── Section: Spacing
│   └── Spacing ruler
├── Section: Radius & Elevation
│   └── Radius cards + Shadow cards
├── Section: Components
│   └── Component stage per component (buttons, inputs, badges, etc.)
└── Footer
```

## 4. Prototyping

**Trigger phrases**: "prototype", "animation", "interaction", "drag and drop", "click through", "micro-interaction", "sandbox"

**Key patterns**:
- Animation sandbox with CSS custom property controls
- Easing curve panel
- Keyframe timeline visualization
- Native HTML5 drag-and-drop (vanilla JS, ~40 lines)
- Drag grip dots (6-dot grid pattern)
- Drop indicator styling
- Open-questions panel

**Reference files**: `07-prototype-animation.html`, `08-prototype-interaction.html`

**Composition**:
```
Header (eyebrow + h1 + sub)
├── Section: Demo area (main visual)
│   └── The prototype itself
├── Section: Controls / Parameters
│   └── Sliders, toggles, easing selector
├── Section: Code / CSS output
│   └── Copy-paste code block
└── Footer
```

**JS allowed**: Native HTML5 Drag and Drop API, CSS custom property manipulation, requestAnimationFrame for animation loops. No frameworks.

## 5. Diagrams & Illustrations

**Trigger phrases**: "flowchart", "diagram", "SVG", "illustration", "figure", "pipeline", "architecture diagram"

**Key patterns**:
- Inline SVG with semantic class-based styling (`.st`, `.fl`, `.cl`, `.ol`, `.oa`, `.ln`, `.lc`)
- Clickable nodes that update a sticky sidebar
- Legend panel
- Node status colors (clay=active, olive=success, oat=neutral, gray=inactive)

**Reference files**: `10-svg-illustrations.html`, `13-flowchart-diagram.html`

**SVG class conventions** (from index.html thumbnails):
```css
.st { stroke: var(--gray-500); fill: none; stroke-width: 2.5; }
.fl { fill: var(--gray-300); }
.cl { fill: var(--clay); }
.ol { fill: var(--olive); }
.oa { fill: var(--oat); stroke: var(--gray-500); stroke-width: 2.5; }
.sl { fill: var(--slate); }
.wh { fill: var(--white); stroke: var(--gray-500); stroke-width: 2.5; }
.ln { stroke: var(--gray-500); stroke-width: 2.5; fill: none; stroke-linecap: round; }
.lc { stroke: var(--clay); stroke-width: 2.5; fill: none; stroke-linecap: round; }
.da { stroke-dasharray: 4 4; }
```

**Composition**:
```
Header (eyebrow + h1 + sub)
├── grid-2col-sidebar
│   ├── Main: SVG diagram
│   └── Sidebar: Detail panel (updates on click)
├── Section: Legend
└── Footer
```

## 6. Slide Decks

**Trigger phrases**: "slide deck", "presentation", "slides", "deck", "keynote alternative", "arrow-key deck"

**Key patterns**:
- `scroll-snap-type: y mandatory` on body
- Full-viewport `.slide` sections
- IntersectionObserver for slide tracking
- Fixed position slide counter (e.g., "3 / 6")
- `.slide.invert` for dark background slides
- Max content width 780px within slides
- No build step, single file

**Reference files**: `09-slide-deck.html`

**Slide types**:
1. **Title slide**: Large h1, eyebrow, date
2. **Content slide**: h2 + body text + optional sidebar
3. **Metrics slide**: Stat cards in a row
4. **Decision slide**: Highlight list + call-to-action
5. **Invert slide**: Dark background for emphasis

**Composition**:
```
body (scroll-snap)
├── .slide (title)
├── .slide (content)
├── .slide.invert (emphasis)
├── .slide (metrics)
├── .slide (decision)
└── Fixed slide counter overlay
```

## 7. Research & Learning

**Trigger phrases**: "explain", "how does X work", "concept explainer", "feature explainer", "deep dive", "learn about", "understanding X"

**Key patterns**:
- TL;DR callout box (clay-tinted background, rounded)
- Collapsible `<details>` sections for step-by-step
- Tabbed code/config snippets
- FAQ section with collapsible Q&A
- Hover-linked glossary in sidebar
- Live interactive demo (e.g., consistent hashing ring)
- Comparison table

**Reference files**: `14-research-feature-explainer.html`, `15-research-concept-explainer.html`

**Composition**:
```
Header (eyebrow + h1 + sub)
├── Section: TL;DR
│   └── Callout box with key takeaway
├── Section: How it works
│   └── <details> per step with code/config
├── Section: Interactive demo (if applicable)
├── Section: Comparison / Trade-offs table
├── Section: FAQ
│   └── <details> per question
└── Footer
```

## 8. Reports

**Trigger phrases**: "status report", "weekly update", "incident report", "post-mortem", "engineering status", "progress report", "shipped this week"

**Key patterns**:
- Summary stat cards (4-column stat-grid)
- Highlight list with clay markers
- Shipped table (panel-table) with PR links and risk dots
- SVG bar chart in chart-panel
- Carryover items in panel-oat
- Incident timeline with minute-by-minute entries
- Log excerpts in code blocks
- Follow-up checklist with checkboxes

**Reference files**: `11-status-report.html`, `12-incident-report.html`

**Composition (Status Report)**:
```
Header (eyebrow + h1 + date-range)
├── Section: Summary band (stat-grid)
├── Section: Highlights (highlights list)
├── Section: Shipped (panel-table)
├── Section: Velocity (chart-panel with SVG bar chart)
├── Section: Carryover (panel-oat)
└── Footer (sources + generation date)
```

**Composition (Incident Report)**:
```
Header (eyebrow + h1 + severity badge)
├── Section: Summary (TL;DR + impact stats)
├── Section: Timeline (timeline entries)
├── Section: Root cause (detailed analysis)
├── Section: Resolution (steps taken)
├── Section: Follow-ups (checklist)
└── Footer
```

## 9. Custom Editing Interfaces

**Trigger phrases**: "editor", "triage board", "kanban", "feature flags", "toggle UI", "prompt editor", "template editor", "custom UI"

**Key patterns**:
- Kanban columns with drag-and-drop (HTML5 DnD API)
- Toggle groups with dependency warnings
- Contenteditable panels with live preview
- Copy-to-clipboard export buttons ("Copy as markdown", "Copy diff")
- Tag click filtering
- Badge counts on columns

**Reference files**: `18-editor-triage-board.html`, `19-editor-feature-flags.html`, `20-editor-prompt-tuner.html`

**Composition**:
```
Header (eyebrow + h1 + sub)
├── Toolbar (filter tags, export button)
├── Main editor area (kanban / toggles / contenteditable)
├── Preview panel (if applicable)
└── Footer
```

**JS patterns to include**:
- `navigator.clipboard.writeText()` with "Copied ✓" feedback
- HTML5 Drag and Drop API: `dragstart`, `dragover`, `drop` events
- `requestAnimationFrame` for debounced preview rendering
- CSS custom property manipulation: `root.style.setProperty(...)`
- Fallback to `execCommand('copy')` for older browsers

## General Rules for All Scenarios

1. **Always** start with the exact `:root` token block from `design-tokens.md`
2. **Always** use the standard header pattern (eyebrow + h1 + sub)
3. **Always** wrap content in `.page` container
4. **Always** end with a footer (mono, sources/dates)
5. **Never** add external dependencies (no CDN scripts, no web fonts, no CSS frameworks)
6. **All** CSS in a single `<style>` block in `<head>`
7. **All** JS (if needed) in a single `<script>` block at end of `<body>`
8. **Keep JS minimal** — many documents need zero JavaScript
9. Use `<meta charset="utf-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1">` in every file
