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

### Phase 4B: Story Generation

After placing the component file, generate a co-located Storybook story (`.stories.tsx`).

**4B.1 Detect story shape from the generated component:**
- Has `variantClasses` → generate one named story per variant key + an `AllVariants` render story
- Has `sizeClasses` → generate one story per size key
- Has complex props (callbacks, data objects) → generate state-based stories (loading, error, success)
- Is a compound component (Card + CardHeader + CardContent) → generate composed usage stories

**4B.2 Extract metadata:**
- Component name and export type (named or default)
- All variant/size keys from `as const` objects
- Props interface (required vs optional props → args vs render stories)
- Figma node URL from Phase 1 (use as `parameters.design.url`)

**4B.3 Build argTypes with Storybook Controls:**

For every prop in the component's interface, define an `argTypes` entry with:
- `control` — the appropriate control type
- `description` — what the prop does (one sentence)
- `table.category` — group into: Content, Appearance, State, or Events
- `table.defaultValue` — show the default value (if optional prop has one)

**Control type selection rules:**

| Prop type | Control | Example |
|---|---|---|
| String union (variant/size) | `control: "select"` + `options: [...]` | `variant`, `size` |
| `boolean` | `control: "boolean"` | `disabled`, `checked`, `selected` |
| `string` (label/text) | `control: "text"` | `title`, `children`, `label` |
| `ReactNode` (icon/slot) | `control: false` | `icon`, `prefix` |
| `number` | `control: { type: "number", min, max, step }` | `count`, `maxWidth` |
| Callback `() => void` | `action: "eventName"` | `onClick`, `onConfirm` |

**Category assignment rules:**

| Category | Props that belong here |
|---|---|
| Content | `children`, `title`, `description`, `label`, `icon`, text/content props |
| Appearance | `variant`, `size`, `color`, visual style props |
| State | `disabled`, `checked`, `selected`, `loading`, `open`, state props |
| Events | `onClick`, `onChange`, `onConfirm`, `onCancel`, callback props |

**4B.4 Apply story template:**
```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./component-name";

const meta = {
  title: "<Title>",              // "UI/X", "Components/X", or "Features/Y/X"
  component: ComponentName,
  tags: ["autodocs"],
  args: {
    children: "Default label",   // sensible defaults for interactive controls
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "destructive"],
      description: "Visual style of the component",
      table: {
        category: "Appearance",
        defaultValue: { summary: "default" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and reduces opacity",
      table: {
        category: "State",
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      action: "clicked",
      description: "Click handler",
      table: { category: "Events" },
    },
    // ... add all props from the interface
  },
  parameters: {
    design: { type: "figma", url: "FIGMA_NODE_URL_FROM_PHASE_1" },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

**4B.5 Title derivation from file path:**
| Component Location | Story Title |
|---|---|
| `src/components/ui/X.tsx` | `UI/X` |
| `src/components/X.tsx` | `Components/X` |
| `src/features/Y/X.tsx` | `Features/Y/X` |

**4B.6 Required stories:**
- One story per variant (named exports: `Default`, `Accent`, `Destructive`, etc.)
- An `AllVariants` story that renders all variants side by side
- Interaction states for interactive components (disabled, focused)

See `references/story-template.md` for complete templates.

### Phase 4C: Barrel Export Registration

After placing the component and its story, register it in the package barrel exports so consumers can import it.

**4C.1 Update component barrel (`src/components/ui/index.ts`):**
```typescript
export { ComponentName, type ComponentNameProps } from "./component-name";
```

**4C.2 Verification:**
- Confirm the component is re-exported through `src/index.ts` (it uses `export * from "./components/ui"`)
- Run `pnpm typecheck` to confirm no circular or missing imports

**4C.3 Rules:**
- Always export both the component and its Props type interface
- Use named exports, never default exports
- Keep barrel file alphabetically sorted by component name
- If the component lives outside `src/components/ui/` (e.g., `src/components/` or `src/features/`), add a direct export line in `src/index.ts`

### Phase 4D: Test Generation

After registering the barrel export, generate a co-located test file (`component-name.test.tsx`).

**4D.1 Test file structure:**
```typescript
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentName } from "./component-name";

test("renders component", () => {
  render(<ComponentName>Label</ComponentName>);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

**4D.2 Required test cases for every component:**

| Category | What to test |
|----------|-------------|
| Rendering | Renders without crashing, shows correct text/content |
| Variants | Each variant applies correct CSS classes |
| Sizes | Each size applies correct height/padding classes |
| Disabled | Has `disabled` attribute, click handler doesn't fire |
| Interactions | onClick/onChange fires with correct arguments |
| Accessibility | Correct role, aria attributes (aria-checked for toggles, etc.) |
| Ref forwarding | `ref.current` is the correct DOM element type |
| className merging | Custom `className` prop appears in rendered output |

**4D.3 Testing rules:**
- Import components directly (not via composeStories) for unit tests
- Use `screen.getByRole()` for queries — never query by class name or test-id
- Use `userEvent` (not `fireEvent`) for interactions
- One assertion per test (keep tests focused and readable)
- Name tests descriptively: `"disabled button has disabled attribute"`
- Don't test internal implementation — test behavior and output

**4D.4 Run tests after writing:**
```bash
pnpm test
```

All tests must pass before moving to Phase 5.

### Phase 5: Verification

1. Run `pnpm typecheck` to confirm no TypeScript errors
2. Run `pnpm build` to confirm the component is included in dist output
3. Run `pnpm test` to confirm all tests pass
4. Verify the new component appears in Storybook (`pnpm dev`) — check it renders and controls work
5. Compare rendered output against Figma screenshot
6. Check responsive behavior at mobile/tablet/desktop breakpoints
7. Verify interaction states: hover, focus-visible, disabled, active

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
