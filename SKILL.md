---
name: acme-html-style
description: >
  Generate self-contained HTML documents in the Acme warm editorial design style --
  warm ivory backgrounds, terracotta accents, serif headings, mono labels, 1.5px borders,
  12px radius cards, zero dependencies. Use when the user asks for: status report, weekly update,
  incident report, post-mortem, PR review, code review, annotated diff, PR writeup, design system,
  style guide, component variants, slide deck, presentation, flowchart, diagram, SVG illustration,
  feature explainer, concept explainer, how X works, implementation plan, prototype, animation demo,
  interaction demo, drag-and-drop, kanban board, triage, feature flags, prompt editor, comparison,
  trade-offs, visual design exploration, module map -- any document better read in a browser
  than as markdown.
---

# Acme HTML Style

You generate self-contained HTML files in the **Acme warm editorial style**. Every output is a single `.html` file — no build step, no dependencies, no external resources. Open it in a browser and it works.

This style comes from the [html-effectiveness](https://github.com/anthropics/html-effectiveness) project — 21 hand-crafted HTML documents that demonstrate HTML as a superior output format for agent-generated content.

## Core Identity

You are producing documents that feel **warm, editorial, and minimal** — like a well-designed internal tool or a high-quality documentation page. The visual language uses:
- Warm ivory page backgrounds (never stark white)
- Terracotta (clay) as the primary accent color
- Serif headings for gravitas, sans body for readability, mono for code/data
- Generous whitespace with deliberate 1.5px borders
- White cards on ivory for content panels

## Workflow

When a user asks for any document that matches the trigger phrases:

1. **Identify the scenario** — which of the 9 categories does the request fall into?
2. **Read the relevant reference** — open `references/scenario-guide.md` and locate the matching category for composition and key patterns
3. **Read design tokens** — open `references/design-tokens.md` if you need the exact color/type/spacing values
4. **Read component catalog** — open `references/component-catalog.md` for specific component CSS
5. **Read layout patterns** — open `references/layout-patterns.md` for grid/flex/section structures
6. **Generate the HTML** — use the starter template from `assets/starter-template.html` as the base, then fill in content
7. **Run the quality checklist** — open `references/quality-checklist.md` and verify every item before delivering

## Reference Files

| Reference | When to Read |
|---|---|
| `references/scenario-guide.md` | **Always** — identifies which patterns to use |
| `references/graph-layout.js` | When generating diagrams, flowcharts, or SVG graphs — contains layout algorithms and edge routing |
| `references/graph-layout.md` | When you need the graph layout API reference — parameters, usage, and algorithm selection guide |
| `references/design-tokens.md` | When you need exact color hex, font stack, or spacing values |
| `references/component-catalog.md` | When you need button, badge, table, card, input, or other component CSS |
| `references/layout-patterns.md` | When you need page shell, header, grid, section, or footer patterns |
| `references/quality-checklist.md` | **Always before delivering** — pre-flight check |
| `assets/starter-template.html` | As the base boilerplate for new documents |

## Design Tokens (Condensed)

Always start with this `:root` block:

```css
:root {
  --ivory: #FAF9F5; --slate: #141413; --clay: #D97757; --clay-d: #B85C3E;
  --oat: #E3DACC; --olive: #788C5D; --rust: #B04A3F; --white: #FFFFFF;
  --gray-100: #F0EEE6; --gray-300: #D1CFC5; --gray-500: #87867F; --gray-700: #3D3D3A;
  --success: #788C5D; --warning: #C78E3F; --danger: #B04A4A; --info: #5C7CA3;
  --serif: ui-serif, Georgia, "Times New Roman", Times, serif;
  --sans: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --mono: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
  --radius-panel: 12px; --radius-row: 8px; --radius-pill: 999px;
  --border: 1.5px solid var(--gray-300);
  --shadow-sm: 0 1px 2px rgba(20,20,19,0.06);
  --shadow-md: 0 4px 10px rgba(20,20,19,0.08);
  --shadow-lg: 0 12px 28px rgba(20,20,19,0.12);
}
```

See `references/design-tokens.md` for the complete specification.

## Typography Rules (Non-Negotiable)

| Element | Font | Weight | Notes |
|---|---|---|---|
| Headings (h1-h3) | `var(--serif)` | 500 | letter-spacing: -0.01em to -0.02em |
| Body text | `var(--sans)` | 430 | line-height: 1.55-1.6 |
| Code, labels, metadata, file paths, stat labels | `var(--mono)` | — | Uppercase + letter-spacing for labels |

## Component Quick Reference

See `references/component-catalog.md` for complete CSS. Key points:

- **Buttons**: 36px height, sans 14px/500, 8px radius. Primary=clay bg, Secondary=white+border, Ghost=transparent, Danger=red bg
- **Badges**: 22px height, pill-shaped, tinted backgrounds at 12-16% opacity of semantic color
- **Tags/Chips**: Mono font, 11px, uppercase, letter-spaced
- **Tables**: `panel-table` class — white bg, rounded, gray-100 header, row hover
- **Cards**: White bg, 1.5px gray-300 border, 12px radius, hover lifts 3px
- **Inputs**: 38px height, 1.5px border, clay focus ring with rgba shadow

## Page Structure (Non-Negotiable)

Every document follows this skeleton:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>[Title]</title>
  <style>/* all CSS here */</style>
</head>
<body>
  <div class="page">
    <header>
      <div class="eyebrow">[Category]</div>
      <h1>[Title]</h1>
      <p class="sub">[Description]</p>
    </header>
    <section>
      <h2>[Section]</h2>
      <hr class="rule">
      <!-- content -->
    </section>
    <footer>[Sources · date]</footer>
  </div>
</body>
</html>
```

## Scenario Routing Table

| # | Scenario | Composition Reference | Key Components |
|---|---|---|---|
| 1 | Exploration & Planning | scenario-guide.md §1 | card-grid, comparison tables, timeline SVG, pro/con indicators, code blocks |
| 2 | Code Review & PRs | scenario-guide.md §2 | diff blocks, severity tags, comment bubbles, `<details>`, checklist |
| 3 | Design System & Variants | scenario-guide.md §3 | color swatches, type scale, spacing ruler, component stages |
| 4 | Prototyping | scenario-guide.md §4 | animation sandbox, easing panel, drag-and-drop, keyframe display |
| 5 | Diagrams & Flowcharts | scenario-guide.md §5 | graph-layout.js, inline SVG, clickable nodes, legend, sticky sidebar |
| 6 | Slide Decks | scenario-guide.md §6 | scroll-snap slides, IntersectionObserver, slide counter, invert slides |
| 7 | Research & Explainers | scenario-guide.md §7 | TL;DR box, `<details>` steps, tabbed code, FAQ, glossary |
| 8 | Reports (Status/Incident) | scenario-guide.md §8 | stat cards, highlights, shipped table, SVG chart, timeline, carryover |
| 9 | Custom Editing UIs | scenario-guide.md §9 | kanban columns, toggles, contenteditable, copy-export, DnD |

## Quality Rules

Before delivering any HTML file, verify these items. See `references/quality-checklist.md` for the full checklist.

1. **Tokens**: Every color uses a `var(--token)`, never a hardcoded hex
2. **Typography**: Serif headings, sans body, mono code/labels — no exceptions
3. **Borders**: Always 1.5px solid, never 1px
4. **Cards**: White bg on ivory page, 12px radius
5. **Dependencies**: Zero — no CDN, no fonts, no frameworks, no npm
6. **Self-contained**: Single `<style>` block, single `<script>` block (if needed)
7. **Footer**: Every document ends with a mono-font metadata footer

## Anti-Patterns to Avoid

- **Never** use pure white (#FFF) as page background — always ivory
- **Never** use 1px borders for cards/panels — always 1.5px
- **Never** use sans-serif for headings — always serif
- **Never** use bold (700) weight for headings — always 500
- **Never** add external CSS frameworks or JS libraries
- **Never** use bright saturated colors (bright green, electric blue)
- **Never** leave out the `:root` token block
- **Never** skip the footer
- **Never** use browser-default form elements — always custom styled
- **Never** make cards transparent — they must be white on the ivory page
