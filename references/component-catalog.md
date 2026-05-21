# Component Catalog — Acme HTML Style

Every component uses the design tokens from `design-tokens.md`. Never hardcode hex values — always use CSS variables.

## Buttons

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  height: 36px; padding: 0 16px;
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  border-radius: var(--radius-row); border: 1.5px solid transparent;
  cursor: pointer; transition: background 0.12s ease, border-color 0.12s ease;
}

.btn-primary   { background: var(--clay); color: var(--white); }
.btn-primary:hover { background: var(--clay-d); }
.btn-secondary { background: var(--white); color: var(--slate); border-color: var(--gray-300); }
.btn-secondary:hover { background: var(--gray-100); }
.btn-ghost     { background: transparent; color: var(--gray-700); }
.btn-ghost:hover { background: var(--gray-100); }
.btn-danger    { background: var(--danger); color: var(--white); }
.btn-danger:hover { background: #9A3F3F; }
```

**Pill variant** (used in index.html, slide decks for "auto-generated" chips):
```css
.btn-pill { border-radius: var(--radius-pill); }
```

**Small variant** (used in editors, toolbars):
```css
.btn-sm { height: 28px; padding: 0 10px; font-size: 12px; font-family: var(--mono); }
```

Use `btn-primary` for the single most important action. Use `btn-secondary` for cancel/secondary. Use `btn-ghost` for tertiary actions. Never have more than one primary button visible at a time.

## Inputs

```css
.input {
  height: 38px; padding: 0 12px;
  font-family: var(--sans); font-size: 14px;
  color: var(--slate); background: var(--white);
  border: var(--border); border-radius: var(--radius-row);
  outline: none;
  transition: border-color 0.12s ease, box-shadow 0.12s ease;
}
.input::placeholder { color: var(--gray-500); }
.input:focus {
  border-color: var(--clay);
  box-shadow: 0 0 0 3px rgba(217, 119, 87, 0.15);
}
```

## Checkboxes

Custom styled — no browser default appearance. The checkmark is a rotated `::after` pseudo-element.

```css
.checkbox { display: inline-flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer; }
.checkbox input {
  appearance: none; width: 18px; height: 18px;
  border: var(--border); border-radius: 5px;
  background: var(--white); margin: 0; cursor: pointer;
}
.checkbox input:checked { background: var(--clay); border-color: var(--clay); }
.checkbox input:checked::after {
  content: ""; position: absolute;
  left: 5px; top: 1px; width: 5px; height: 10px;
  border: solid var(--white); border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

## Toggle Switch

```css
.toggle { display: inline-flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer; }
.toggle input { display: none; }
.toggle .track {
  width: 40px; height: 22px; background: var(--gray-300);
  border-radius: var(--radius-pill); position: relative;
  transition: background 0.12s ease;
}
.toggle .track::after {
  content: ""; position: absolute; top: 3px; left: 3px;
  width: 16px; height: 16px; background: var(--white);
  border-radius: 50%; transition: transform 0.12s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}
.toggle input:checked + .track { background: var(--olive); }
.toggle input:checked + .track::after { transform: translateX(18px); }
```

## Badges

Used for status indicators. Always pill-shaped (999px radius).

```css
.badge {
  display: inline-flex; align-items: center;
  height: 22px; padding: 0 9px;
  font-size: 12px; font-weight: 500;
  border-radius: var(--radius-pill);
}
.badge-neutral { background: var(--gray-100); color: var(--gray-700); }
.badge-accent  { background: rgba(217, 119, 87, 0.14); color: var(--clay); }
.badge-success { background: rgba(120, 140, 93, 0.16); color: var(--olive); }
.badge-warning { background: rgba(199, 142, 63, 0.16); color: #A06A2A; }
.badge-danger  { background: rgba(176, 74, 74, 0.12); color: var(--danger); }
.badge-info    { background: rgba(92, 124, 163, 0.14); color: var(--info); }
```

## Tags / Chips

Tags use mono font, uppercase, small border-radius. Used for categorization labels.

```css
.tag {
  font-family: var(--mono); font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.05em;
  padding: 3px 8px; border-radius: var(--radius-xs);
  background: var(--gray-100); color: var(--gray-700);
}
.tag-accent  { background: rgba(217, 119, 87, 0.12); color: var(--clay); }
.tag-success { background: rgba(120, 140, 93, 0.14); color: var(--olive); }
```

Chips are similar but have a border and are pill-shaped:
```css
.chip {
  font-family: var(--mono); font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--gray-500); background: var(--gray-100);
  border: var(--border); border-radius: var(--radius-pill);
  padding: 5px 11px;
}
```

## Tables

Tables are wrapped in a white rounded container. The `panel-table` class should be applied directly to the `<table>` element.

```css
table.panel-table {
  width: 100%; border-collapse: separate; border-spacing: 0;
  background: var(--white); border: var(--border);
  border-radius: var(--radius-panel); overflow: hidden;
}
table.panel-table thead th {
  text-align: left; font-family: var(--sans);
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--gray-500); background: var(--gray-100);
  padding: 12px 16px; border-bottom: 1px solid var(--gray-300);
}
table.panel-table tbody td {
  padding: 13px 16px; border-bottom: var(--border-light);
  font-size: 14px; vertical-align: middle;
}
table.panel-table tbody tr:last-child td { border-bottom: none; }
table.panel-table tbody tr:hover { background: var(--ivory); }
```

For PR-style tables, monospace links are common:
```css
.pr-link {
  font-family: var(--mono); font-size: 13px;
  color: var(--clay); text-decoration: none;
  border-bottom: 1px dotted transparent;
}
.pr-link:hover { border-bottom-color: var(--clay); }
```

## Cards

Standard card: white on ivory, 1.5px border, 12px radius, hover lift.

```css
.card {
  background: var(--white); border: var(--border);
  border-radius: var(--radius-panel); padding: 20px 22px;
  transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--slate);
}
```

For linked cards (navigation), add `text-decoration: none; color: inherit;` and include a thumbnail area at the top.

### Card Grid
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(316px, 1fr));
  gap: 20px;
}
```

## Risk Dots

Three severity levels, always 9px circles:

```css
.risk-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.risk-dot.low  { background: var(--olive); }  /* or var(--success) */
.risk-dot.med  { background: var(--clay); }
.risk-dot.high { background: var(--rust); }    /* or var(--danger) */
```

Usage pattern:
```html
<span class="risk">
  <span class="risk-dot med"></span>Medium
</span>
```

## Stat Cards

Used in reports for summary metrics. Large serif number, mono label, optional delta.

```css
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
@media (max-width: 720px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: var(--white); border: var(--border);
  border-radius: var(--radius-panel); padding: 20px 22px 18px;
}
.stat-card.warn {
  border-left: 4px solid var(--clay);
  padding-left: 19px;
}
.stat-num {
  font-family: var(--serif); font-size: 44px;
  font-weight: 500; line-height: 1; color: var(--slate);
  margin-bottom: 8px;
}
.stat-label {
  font-family: var(--sans); font-size: 12px;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--gray-500);
}
.stat-delta { font-family: var(--mono); font-size: 11px; margin-top: 6px; }
.stat-delta.up   { color: var(--olive); }
.stat-delta.down { color: var(--clay); }
.stat-delta.flat { color: var(--gray-500); }
```

## Highlight Lists

Used for key takeaways. Clay-colored square markers with strong text emphasis.

```css
.highlights { list-style: none; margin: 0; padding: 0; }
.highlights li {
  position: relative; padding: 0 0 14px 26px;
  font-size: 15px; color: var(--gray-700);
}
.highlights li::before {
  content: ""; position: absolute;
  left: 6px; top: 8px; width: 7px; height: 7px;
  border-radius: 2px; background: var(--clay);
}
.highlights li strong { color: var(--slate); font-weight: 600; }
```

## Carryover / Oat Panels

Used for secondary information sections (carryover items, notes, asides).

```css
.panel-oat {
  background: var(--oat);
  border-radius: var(--radius-panel);
  padding: 20px 22px;
}
```

Items within carryover panels:
```css
.carry-item {
  display: flex; align-items: baseline; gap: 14px; padding: 8px 0;
}
.carry-item + .carry-item { border-top: 1px solid rgba(20, 20, 19, 0.08); }
.carry-tag {
  font-family: var(--mono); font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.05em;
  color: var(--gray-700); background: var(--ivory);
  border-radius: 4px; padding: 3px 7px; flex-shrink: 0;
}
```

## Chart Panels

SVG bar charts rendered inline. White card wrapper with caption.

```css
.chart-panel {
  background: var(--white); border: var(--border);
  border-radius: var(--radius-panel); padding: 24px 28px 18px;
}
.chart-panel svg { display: block; width: 100%; height: auto; }
.chart-caption {
  font-size: 12px; color: var(--gray-500); margin-top: 12px;
}
```

SVG elements use: gridlines = `#F0EEE6`/`#D1CFC5`, bars = `var(--oat)`, peak bar = `var(--clay)`, text = `var(--gray-500)`/`var(--gray-700)`.

## Copy-to-Clipboard Button Pattern

```js
// Button text changes to "Copied ✓" with olive background, auto-resets after 1200ms
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(content).then(() => {
    copyBtn.textContent = 'Copied \u2713';
    copyBtn.style.background = 'var(--olive)';
    copyBtn.style.color = 'var(--white)';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
      copyBtn.style.background = '';
      copyBtn.style.color = '';
    }, 1200);
  });
});
```

## Collapsible Sections (`<details>`)

```css
details {
  border: var(--border); border-radius: var(--radius-row);
  background: var(--white); overflow: hidden;
}
details + details { margin-top: 12px; }
summary {
  padding: 14px 18px; cursor: pointer; font-weight: 500;
  font-size: 14px; color: var(--gray-700); list-style: none;
  display: flex; align-items: center; gap: 10px;
}
summary::-webkit-details-marker { display: none; }
summary::marker { content: none; }
summary:hover { background: var(--ivory); }
summary::before {
  content: "+"; font-family: var(--mono); font-size: 16px;
  color: var(--gray-500); width: 16px; text-align: center; flex-shrink: 0;
}
details[open] summary::before { content: "\2212"; color: var(--clay); }
details .details-content { padding: 0 18px 18px 44px; font-size: 14px; color: var(--gray-700); }
```

## Tabs (for code/config snippets)

Simple CSS tabs — no JS needed if each tab links to a section:
```css
.tabs { display: flex; gap: 0; border-bottom: var(--border); margin-bottom: 16px; }
.tab {
  padding: 10px 18px; font-size: 13px; font-weight: 500;
  color: var(--gray-500); cursor: pointer;
  border-bottom: 2px solid transparent; transition: color 0.12s, border-color 0.12s;
}
.tab.active { color: var(--slate); border-bottom-color: var(--clay); }
.tab:hover { color: var(--gray-700); }
```

## Pro/Con Indicators

```css
.pro::before, .con::before {
  content: ""; display: inline-block;
  width: 8px; height: 8px; border-radius: 50%;
  margin-right: 8px; flex-shrink: 0;
}
.pro::before { background: var(--olive); }
.con::before { background: var(--clay); }
```
