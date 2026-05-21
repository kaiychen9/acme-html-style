# Quality Checklist — Acme HTML Style

Run through this checklist after generating any HTML file. Fix every item before delivering.

## Pre-Flight Checklist

### Tokens & Colors
- [ ] `:root` block is present and uses exact hex values from design-tokens.md
- [ ] No hardcoded color hex values outside `:root` — always use `var(--token)`
- [ ] Page background is `var(--ivory)`, NOT `#FFF` or `white`
- [ ] Text color is `var(--slate)`, NOT `#000` or `black`
- [ ] Card backgrounds are `var(--white)`, NOT transparent
- [ ] All semantic colors use the exact tokens (olive for success, NOT `#00FF00`)

### Typography
- [ ] All headings (h1, h2, h3) use `font-family: var(--serif)`
- [ ] All body text uses `font-family: var(--sans)`
- [ ] All code, file paths, labels, captions, metadata use `font-family: var(--mono)`
- [ ] Heading weight is 500, NOT 700 (bold)
- [ ] h1 has `letter-spacing: -0.01em` or `-0.02em`
- [ ] Body line-height is 1.55-1.6
- [ ] No external font loading (no Google Fonts, no @font-face)

### Borders & Radius
- [ ] Primary borders are `1.5px solid`, NOT `1px solid`
- [ ] Card radius is 12px (`var(--radius-panel)`)
- [ ] Row/item radius is 8px (`var(--radius-row)`)
- [ ] Pill elements use `border-radius: 999px`
- [ ] No sharp corners (0px radius) on cards, buttons, or panels

### Layout
- [ ] Content wrapped in `.page` or equivalent container
- [ ] Body has generous padding (56px top, 24px sides, 96-120px bottom)
- [ ] Standard header pattern: eyebrow + h1 + sub
- [ ] Sections use h2 + hr.rule pattern
- [ ] Footer present with mono font, gray-500 color, sources/date
- [ ] Responsive at common breakpoints (880px, 720px, 640px)

### Components
- [ ] Buttons have correct height (36px), font (sans, 14px, 500), and radius (8px)
- [ ] Badges are pill-shaped, correct tint backgrounds
- [ ] Tags use mono font, uppercase, letter-spaced
- [ ] Tables wrapped in white rounded containers with panel-table class
- [ ] Checkboxes use custom styling (appearance: none), NOT browser defaults

### Transitions & Polish
- [ ] Transitions are 120-150ms `ease`, not linear
- [ ] Card hover lifts 3px with shadow
- [ ] No aggressive animations or effects
- [ ] `-webkit-font-smoothing: antialiased` on body

### Dependencies & Self-Containment
- [ ] Zero external dependencies — no CDN links, no npm packages
- [ ] No CSS frameworks (no Bootstrap, Tailwind, etc.)
- [ ] No JavaScript frameworks (no React, Vue, jQuery, etc.)
- [ ] All CSS in a single `<style>` block
- [ ] All JS (if any) in a single `<script>` block at end of `<body>`
- [ ] JS is vanilla — `addEventListener`, not jQuery or framework patterns
- [ ] `<meta charset="utf-8">` and viewport meta present

### Content & Structure
- [ ] Document has a clear `<title>` in `<head>`
- [ ] Semantic HTML structure (header, section, footer)
- [ ] No empty placeholder text ("lorem ipsum", "TODO", "TBD")
- [ ] All sample data is realistic and internally consistent

## Common Mistakes (Anti-Patterns)

| Mistake | Fix |
|---|---|
| Using `#FFFFFF` as page bg | Use `var(--ivory)` |
| Using `#000000` as text | Use `var(--slate)` |
| 1px borders | Use `1.5px solid` |
| Sans-serif headings | Use `var(--serif)` for headings |
| Serif body text | Use `var(--sans)` for body |
| Bold (700) headings | Use weight 500 |
| Bright saturated colors | Use muted Acme palette |
| External font loading | Use system font stacks |
| CSS framework | Vanilla CSS only |
| React/Vue components | Vanilla HTML only |
| Missing `:root` block | Always include full token block |
| Hardcoded hex in components | Always use `var(--token)` |
| Cards without white bg | Cards must be `var(--white)` on `var(--ivory)` page |
| No hover states | Cards should lift, buttons should darken |
| Large box shadows | Use the defined shadow tokens |
| Rounded cards too large | 12px standard, never >20px for cards |

## Visual Cohesion Test

After generating, mentally verify:
1. Does this look like it belongs in the html-effectiveness gallery?
2. Is the overall feel warm, editorial, and minimal?
3. Does the ivory background soften the page?
4. Does clay (terracotta) appear as the primary accent, not the dominant color?
5. Are there only 1-2 clay elements visible at a time? (Clay should accent, not overwhelm)
6. Does the serif/sans/mono hierarchy clearly separate headings, body, and data?
