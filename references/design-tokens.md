# Acme Design Tokens — Complete Reference

> These tokens define the "Acme" warm editorial style. Every generated HTML file
> MUST start with this `:root` block verbatim. Never substitute hex values or
> change font stacks. The consistency across all 21 source files depends on
> exact token values.

## Color Palette

### Primary
| Token | Hex | Role |
|---|---|---|
| `--ivory` | `#FAF9F5` | Page background — warm off-white, never pure white |
| `--slate` | `#141413` | Primary text — near-black with warmth |
| `--clay` | `#D97757` | Primary accent — warm terracotta, used for CTAs, links, highlights |
| `--clay-d` | `#B85C3E` | Darkened clay for hover/active states |
| `--oat` | `#E3DACC` | Secondary accent — warm beige, used for secondary panels, chart bars |
| `--olive` | `#788C5D` | Success/positive — muted green, not bright |
| `--rust` | `#B04A3F` | High severity / deletion |
| `--white` | `#FFFFFF` | Card backgrounds, always on ivory page |

### Gray Scale
| Token | Hex | Role |
|---|---|---|
| `--gray-100` | `#F0EEE6` | Lightest fill — code backgrounds, secondary button hover, table header |
| `--gray-200` | `#E6E3DA` | Slightly darker fill — card thumbnail backgrounds |
| `--gray-300` | `#D1CFC5` | Borders, dividers, disabled states |
| `--gray-500` | `#87867F` | Secondary text, captions, metadata, placeholders |
| `--gray-700` | `#3D3D3A` | Body text — slightly lighter than slate for prose |

### Semantic Colors
| Token | Hex | Role |
|---|---|---|
| `--success` | `#788C5D` | Same as olive — success badges, trend up |
| `--warning` | `#C78E3F` | Amber/gold — warning badges, medium risk |
| `--danger` | `#B04A4A` | Red — danger badges, high risk, delete buttons |
| `--info` | `#5C7CA3` | Blue — informational badges |

### Badge Background Tints
Badges use rgba() tints of their semantic color at ~14-16% opacity:
- Accent badge bg: `rgba(217, 119, 87, 0.14)` (clay tint)
- Success badge bg: `rgba(120, 140, 93, 0.16)` (olive tint)
- Warning badge bg: `rgba(199, 142, 63, 0.16)` (warning tint)
- Danger badge bg: `rgba(176, 74, 74, 0.12)` (danger tint)
- Info badge bg: `rgba(92, 124, 163, 0.14)` (info tint)

## Typography

### Font Stacks
```css
--serif: ui-serif, Georgia, "Times New Roman", Times, serif;
--sans:  system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--mono:  ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace;
```

### Usage Rules (NEVER violate these)

| Element | Font | Weight | Notes |
|---|---|---|---|
| h1, h2, h3 | `var(--serif)` | 500 | letter-spacing: -0.01em to -0.02em |
| Body text, paragraphs | `var(--sans)` | 430 | line-height: 1.55-1.6 |
| Code, file paths, commands | `var(--mono)` | — | Inline code gets `background: var(--gray-100)` |
| Labels, metadata, captions | `var(--mono)` | — | Uppercase, letter-spaced |
| Stat numbers | `var(--serif)` | 500 | Large sizes (44px+), tight line-height |
| Buttons | `var(--sans)` | 500 | 14px default |
| Table headers | `var(--sans)` | 600 | Uppercase, letter-spaced |

### Type Scale
| Name | Font | Size | Line-height | Weight | Letter-spacing |
|---|---|---|---|---|---|
| Display | serif | 48px | 1.1 | 500 | -0.02em |
| Heading 1 | serif | 32–40px | 1.2 | 500 | -0.01em |
| Heading 2 | serif | 24–27px | 1.3 | 500 | -0.01em |
| Heading 3 | serif | 18px | 1.3 | 500 | 0 |
| Body | sans | 15–16px | 1.55 | 430 | 0 |
| Small | sans | 14px | 1.5 | 430 | 0 |
| Caption | sans | 12px | 1.4 | 500 | — |

## Spacing Scale
| Token | Value | Typical Use |
|---|---|---|
| `--sp-1` | 4px | Tight gaps, icon padding |
| `--sp-2` | 8px | Row gaps, tag padding |
| `--sp-3` | 12px | Component gaps |
| `--sp-4` | 16px | Card gaps, button padding |
| `--sp-5` | 24px | Section padding |
| `--sp-6` | 32px | Container padding |
| `--sp-7` | 48px | Large section gaps, hero spacing |
| `--sp-8` | 64px | Page-level spacing |

Page-level padding: `56px 24px 96px` or `56px 24px 120px` on body.

## Border Radius
| Token | Value | Use |
|---|---|---|
| `--radius-xs` | 4px | Code blocks, small tags, inline elements |
| `--radius-sm` / `--radius-row` | 8px | Table rows, buttons, inputs, detail blocks |
| `--radius-md` / `--radius-panel` | 12px | Cards, panels, sections |
| `--radius-lg` | 20px | Large containers |
| `--radius-pill` | 999px | Pill buttons, badges, chips |

## Borders
- **Standard border**: `1.5px solid var(--gray-300)` — used for cards, inputs, panels
- **Light border**: `1px solid var(--gray-100)` — used for internal dividers (table rows, list items)
- **Section divider**: `1px solid var(--gray-300)` — hr.rule under h2
- **Never** use 1px solid for primary borders — always 1.5px. This is a key part of the visual language.

## Shadows
| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(20,20,19,0.06)` | Subtle elevation |
| `--shadow-md` | `0 4px 10px rgba(20,20,19,0.08)` | Card hover |
| `--shadow-lg` | `0 12px 28px rgba(20,20,19,0.12)` | Card hover (alternative), elevated panels |

## Transitions
- **Default**: `0.12s ease` for backgrounds, borders, colors
- **Card hover**: `0.15s ease` for transform, box-shadow, border-color
- **Use `ease` timing function** — never `linear` or `ease-in-out`
- **Keep transitions short** — 120-150ms. Nothing should feel sluggish.

## Anti-Patterns

- Never use pure white (`#FFF`) as page background — always `var(--ivory)`
- Never use pure black (`#000`) as text — always `var(--slate)`
- Never use 1px borders for cards/panels — always 1.5px
- Never use sans-serif for headings — always serif
- Never use serif for body text — always sans
- Never use saturated colors (bright green, bright red, bright blue)
- Never add external font dependencies (Google Fonts, etc.)
- Never add external CSS frameworks
- Never use box-shadow without the warm slate tint `rgba(20,20,19,...)`
