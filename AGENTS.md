# AGENTS.md

## Directory Architecture

```
acme-html-style/
  SKILL.md                    # Skill definition (YAML front matter)
  README.md                   # English docs
  README_zh.md                # Chinese docs (mirrors README.md)
  LICENSE                     # MIT
  assets/
    starter-template.html     # HTML boilerplate
    images/                   # Screenshots: 0X-slug.png
  references/
    scenario-guide.md         # 9 categories + composition patterns
    design-tokens.md          # Full CSS token spec
    component-catalog.md      # Reusable component CSS
    layout-patterns.md        # Grid, flex, section recipes
    quality-checklist.md      # Pre-flight verification
```

## Naming

- Files: kebab-case (except SKILL.md, README.md)
- CSS classes/vars: kebab-case, vars prefixed `--`
- Images: `0X-slug.png` (zero-padded 2-digit number)

## README Sync Rules

- `README.md` and `README_zh.md` must mirror each other — same sections, same order, same info
- Each links to the other at the top
- Adding a screenshot to `assets/images/` → update gallery table in both READMEs
- Adding a scenario category → update SKILL.md routing table, scenario-guide.md, and both READMEs

## Commit Conventions

- Imperative mood, single-line summary, multi-line body
- Atomic: one logical change per commit
- 

## Agent Workflow

1. Identify scenario → 2. Read scenario-guide → 3. Read design-tokens → 4. Read component-catalog → 5. Read layout-patterns → 6. Generate from starter-template → 7. Quality checklist

Always read: `scenario-guide.md` and `quality-checklist.md`.
