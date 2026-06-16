# @kaufman2699/kr-design-system

A shared React component library with Tailwind CSS, published as a public npm package. Components are generated from Figma designs using Claude Code + Figma MCP and documented in Storybook.

## Quick Start

```bash
# Prerequisites: Node.js 24+, pnpm
corepack enable pnpm

# Clone and install
git clone https://github.com/kaufman2699/kr-design-system.git
cd kr-design-system
pnpm install

# Launch Storybook (browse components)
pnpm dev            # → http://localhost:6006

# Build the package
pnpm build          # → dist/ (ESM + CJS + types + CSS)
```

## Generating Components from Figma

1. Open Claude Code in this project: `claude`
2. Paste a Figma URL and ask: *"Convert this to a React component"*
3. Claude generates the component + Storybook story + registers the export
4. Run `pnpm dev` to preview in Storybook

> **Full visual guide:** Open [`figma-to-code-guide.html`](./figma-to-code-guide.html) in your browser for step-by-step instructions with screenshots — covers setup, generating components, previewing in Storybook, publishing the package, and consuming it in other apps.

## Using This Package in Your App

### Install

```bash
pnpm add @kaufman2699/kr-design-system
```

No registry configuration needed — it's a public npm package.

### Import

```tsx
// Import pre-built styles (once, in app entry)
import "@kaufman2699/kr-design-system/styles.css";

// Import components
import { Button, ConfirmDialog, Chip, Toggle } from "@kaufman2699/kr-design-system";
```

### Alternative: Extend Tailwind (tree-shakeable)

```ts
// tailwind.config.ts
import krPreset from "@kaufman2699/kr-design-system/tailwind-config";

export default {
  presets: [krPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@kaufman2699/kr-design-system/dist/**/*.js",
  ],
};
```

## Using with Claude.ai (No CLI Required)

If you don't use Claude Code CLI, you can connect the design system to **Claude.ai web chat** via the MCP server. This gives Claude knowledge of all available components, props, and design tokens when you build apps in the chat.

### Setup

1. Deploy the MCP server: `cd mcp-server && pnpm start:http`
2. In Claude.ai → Settings → Integrations → Add MCP Server
3. Enter the deployed URL (e.g., `https://your-server.com/mcp`)

### What You Get

Once connected, Claude in web chat can:
- List all available components (`list_components`)
- Show code examples for any component (`get_component_code`)
- Provide Storybook links for previewing (`get_storybook_url`)
- Return all design tokens as Tailwind classes (`get_design_tokens`)

Just ask: *"Build me a settings page using the KR design system"* — Claude will use the correct components and tokens automatically.

## Project Structure

```
kr-design-system/
├── src/
│   ├── index.ts                     ← Package entry (barrel export)
│   ├── lib/utils.ts                 ← cn() utility (clsx + tailwind-merge)
│   ├── styles/globals.css           ← Design tokens + Tailwind directives
│   └── components/ui/               ← Generated components + stories
├── .storybook/                      ← Storybook configuration
├── .mcp.json                        ← Figma MCP connection (OAuth)
├── tailwind.config.ts               ← Shared Tailwind config with brand tokens
├── tsup.config.ts                   ← Library build (ESM + CJS + DTS)
├── postcss.config.cjs               ← PostCSS (Tailwind + Autoprefixer)
├── package.json                     ← @kaufman2699/kr-design-system
└── .claude/plugins/figma-tailwind/  ← Claude Code skill for Figma conversion
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Launch Storybook at localhost:6006 |
| `pnpm build` | Build package (ESM + CJS + types + CSS) |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm build:storybook` | Build static Storybook for deployment |
| `pnpm test` | Run unit tests (49 tests, Vitest) |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm publish` | Publish to npm (runs typecheck + tests + build first) |

## Design Tokens

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Navy | `#1E4C7E` | `firm-navy` | Primary buttons, headings |
| Lime | `#AED136` | `firm-lime` | Accent buttons, focus rings |
| Destructive | `#FF6158` | `firm-destructive` | Delete/danger actions |
| Foreground | `#4B5563` | `firm-foreground` | Body text |
| Muted | `#F2F2F2` | `firm-muted` | Secondary backgrounds |
| Border | `#E5E7EB` | `firm-border` | Card borders, dividers |

**Typography:** Roboto (headings) + Inter (UI/body)
**Radius:** 8px for containers (`rounded-firm`), 4px for buttons (`rounded-firm-sm`)

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.x | Component framework |
| TypeScript | 6.x | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| Storybook | 10.x | Component documentation |
| tsup | 8.x | Library bundling (ESM + CJS + DTS) |
| pnpm | 11.x | Package manager |
| Node.js | 24+ | Runtime |

## License

MIT
