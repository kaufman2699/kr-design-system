---
name: figma-to-tailwind
description: This skill should be used when the user asks to "convert a Figma design to React", "generate components from Figma", "extract Figma to Tailwind", "create React component from design", "implement this Figma page", shares a Figma URL and asks for code, or mentions converting design to Tailwind CSS components. Provides the complete workflow for Figma MCP tools to produce production-ready React + Tailwind components.
---

# Figma to Tailwind React Components

Convert Figma designs into production-ready React components with Tailwind CSS utility classes using MCP tools.

## Prerequisites

- Figma MCP authenticated (OAuth via `mcp__figma__authenticate`)
- Target project has Tailwind CSS configured
- Target project has a `cn()` or equivalent class-merge utility

## Conversion Workflow

### Phase 1: Discovery

Before generating code, inspect the design and the target project.

**1.1 Capture the design:**
```
get_screenshot(nodeId, fileKey)         → visual reference
get_metadata(nodeId, fileKey)           → structural hierarchy
get_variable_defs(nodeId, fileKey)      → design tokens
```

**1.2 Discover project conventions:**
- Read `tailwind.config.js` (or `tailwind.config.ts`) for custom theme tokens
- Read the global CSS file for CSS custom properties
- Identify the class-merge utility (`cn()`, `clsx`, `cva`, etc.)
- Find existing UI components to reuse

**1.3 Check Code Connect mappings:**
```
get_code_connect_map(nodeId, fileKey)   → existing component mappings
```

Reuse any mapped components instead of recreating them.

### Phase 2: Token Mapping

Extract Figma variables and map them to the project's Tailwind tokens.

**Token resolution order:**
1. Figma variable name → existing Tailwind token (e.g., `Brand/Navy` → `firm-navy`)
2. Figma variable name → existing CSS custom property (e.g., `--background`)
3. Raw hex value → closest Tailwind default (e.g., `#6B7280` → `gray-500`)
4. If no match exists → add new token to both CSS and Tailwind config

See `references/token-mapping.md` for the complete mapping strategy.

### Phase 3: Code Generation

**3.1 Get generated code from Figma MCP:**
```
get_design_context(nodeId, fileKey, clientFrameworks: "react", clientLanguages: "typescript")
```

**3.2 Transform to project conventions:**

Apply these transformations to every component (see `references/component-patterns.md`):

1. **TypeScript interface** — extend appropriate HTML attributes
2. **forwardRef** — for components that wrap a single DOM element
3. **cn() utility** — wrap all className strings, always accept `className` prop
4. **Design tokens** — replace hex colors with token classes
5. **Variant pattern** — use `variantClasses` object for visual states
6. **Icon component** — use project's icon system, not raw SVG
7. **File size** — keep under 500 lines, split into sub-components if needed

**3.3 Layout translation:**

| Figma Auto Layout | Tailwind |
|---|---|
| Horizontal | `flex` |
| Vertical | `flex flex-col` |
| Gap: 4/8/12/16/24 | `gap-1`/`gap-2`/`gap-3`/`gap-4`/`gap-6` |
| Padding: 8/12/16/24/32 | `p-2`/`p-3`/`p-4`/`p-6`/`p-8` |
| Fill Container | `w-full` or `flex-1` |
| Hug Contents | (no width class) |
| Space Between | `justify-between` |
| Center alignment | `items-center` |

See `references/layout-mapping.md` for the complete mapping table.

### Phase 4: File Placement

Determine where to place each new component:

| Type | Location |
|---|---|
| Generic primitive (no business logic) | `src/components/ui/` |
| Shared component (mild logic) | `src/components/` |
| Feature-specific | `src/features/<name>/` |
| Full page | `src/features/<name>/<name>-page.tsx` |

### Phase 5: Verification

1. Run `npm run build` (or equivalent) to confirm no TypeScript errors
2. Compare rendered output against Figma screenshot
3. Check responsive behavior at mobile/tablet/desktop breakpoints
4. Verify interaction states: hover, focus-visible, disabled, active

## Component Template

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent";
}

const variantClasses = {
  default: "bg-white border-border",
  accent: "bg-accent/10 border-accent",
} as const;

const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-xl border p-4", variantClasses[variant], className)}
      {...props}
    />
  ),
);
ComponentName.displayName = "ComponentName";

export { ComponentName };
```

## Additional Resources

### Reference Files

- **`references/token-mapping.md`** — Complete token resolution strategy with Firm brand defaults
- **`references/component-patterns.md`** — Detailed component authoring conventions
- **`references/layout-mapping.md`** — Full Figma-to-Tailwind layout property mapping

### Scripts

- **`scripts/audit-tokens.sh`** — Compare Figma token export against project's tailwind.config
