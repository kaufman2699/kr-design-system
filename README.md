# kr-design-system

Kaufman Rossin design system plugin for Claude Code. Provides automated Figma-to-React component conversion using Tailwind CSS, design token mapping, and component patterns for the Firm brand.

## What's Inside

```
kr-design-system/
├── README.md
├── figma-to-code-guide.html                ← Visual guide for designers
└── .claude/plugins/figma-tailwind/         ← Claude Code plugin
    ├── .claude-plugin/
    │   ├── plugin.json                     ← Plugin manifest
    │   └── marketplace.json                ← Marketplace manifest
    └── skills/figma-to-tailwind/
        ├── SKILL.md                        ← Core conversion workflow
        ├── references/
        │   ├── token-mapping.md            ← Figma variables → Tailwind classes
        │   ├── component-patterns.md       ← React component conventions
        │   └── layout-mapping.md           ← Auto Layout → Tailwind flex/grid
        └── scripts/
            └── audit-tokens.sh             ← Token gap analysis
```

## Installation

Add to any project's `.claude/settings.local.json` (or `.claude/settings.json` if you want it checked into the repo):

```json
{
  "extraKnownMarketplaces": {
    "kr-design-system": {
      "source": "github",
      "repo": "kaufman2699/kr-design-system"
    }
  },
  "enabledPlugins": {
    "figma-tailwind@kr-design-system": true
  }
}
```

> **Replace** `kaufman2699/kr-design-system` with the actual GitHub `owner/repo` where this repository is hosted.

Start a new Claude Code session — the plugin is fetched, cached, and the `figma-to-tailwind` skill becomes available automatically.

### How the naming connects

| Setting | Value | Matches |
|---|---|---|
| `extraKnownMarketplaces` key | `kr-design-system` | `marketplace.json` → `"name": "kr-design-system"` |
| `enabledPlugins` key | `figma-tailwind@kr-design-system` | `plugin.json` → `"name": "figma-tailwind"` @ marketplace name |

## What It Does

When you share a Figma URL and ask for React code, the `figma-to-tailwind` skill:

1. Extracts design tokens via Figma MCP tools
2. Maps Figma variables to your project's Tailwind config
3. Generates React + Tailwind components
4. Applies project conventions: TypeScript, `cn()`, `forwardRef`, variant objects

## Trigger Phrases

The skill activates when you say:

- "Convert this Figma design to React"
- "Generate components from Figma"
- "Extract Figma to Tailwind"
- "Create React component from design"
- "Implement this Figma page"
- Or paste a Figma URL and ask for code

## Prerequisites

- [Claude Code](https://claude.ai/code) CLI
- Figma MCP plugin authenticated (OAuth)
- Target project with Tailwind CSS configured

## Token Audit

Run the included script to check for gaps between CSS custom properties and Tailwind config:

```bash
bash .claude/plugins/figma-tailwind/skills/figma-to-tailwind/scripts/audit-tokens.sh /path/to/project
```

## Designer Guide

Open `figma-to-code-guide.html` in a browser for a visual walkthrough covering setup, workflow, design tokens, layout mapping, and troubleshooting.

## Design Tokens (Firm Brand Defaults)

| Token | Hex | Tailwind Class |
|---|---|---|
| Navy | `#1D4C7E` | `firm-navy` |
| Navy Light | `#2A6299` | `firm-navy-light` |
| Navy Dark | `#153A61` | `firm-navy-dark` |
| Lime | `#AED136` | `firm-lime` |
| Lime Light | `#B5DD5A` | `firm-lime-light` |
| Lime Dark | `#7FB01E` | `firm-lime-dark` |

These are defaults — the skill reads each project's `tailwind.config.js` at runtime and adapts to whatever tokens are defined there.

## License

Internal — Kaufman Rossin / DevTech
