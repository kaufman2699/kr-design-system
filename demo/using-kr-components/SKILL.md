# Using KR Design System Components with Claude

**MANDATORY: All React UI in this project MUST use components from `@kaufman2699/kr-design-system`. Never write custom buttons, toggles, chips, or confirmation dialogs when the library provides them. Only write custom elements for things the library does not cover (text inputs, checkboxes, layout containers).**

This guide is for users who want to build React interfaces using the Kaufman Rossin shared component library through Claude (chat or Claude Code).

---

## What You Can Do

You can ask Claude to build pages and interfaces using our pre-built components. No need to design from scratch — just describe what you want, and Claude will assemble it using the library.

---

## Available Components

| Component | What It Does | Example Use |
|-----------|-------------|-------------|
| **Button** | Clickable action button | "Save", "Delete", "Submit" |
| **Chip** | Toggle tag with optional icon | "Enable Web Search", filters, tags |
| **Toggle** | On/off switch | Settings, preferences |
| **ConfirmDialog** | Confirmation popup with Cancel/Confirm | "Are you sure you want to delete?" |

Each component has built-in variants (colors, sizes, states) that match the Kaufman Rossin brand.

---

## How to Ask Claude

### Starting a New Page

Copy and paste this into Claude:

```
I'm building a React page using the @kaufman2699/kr-design-system package.

The package provides these components:
- Button (variants: default, accent, destructive, outline, ghost; sizes: sm, default, lg)
- Chip (props: icon, selected, disabled)
- Toggle (props: checked, onChange, disabled)
- ConfirmDialog (props: title, description, confirmLabel, cancelLabel, variant, onConfirm, onCancel)

Import them like this:
import { Button, Chip, Toggle, ConfirmDialog } from "@kaufman2699/kr-design-system";

Also import the styles at the top of the app:
import "@kaufman2699/kr-design-system/styles.css";

Please build me: [DESCRIBE WHAT YOU WANT]
```

### Example Requests

**Simple settings page:**
```
Build me a settings page with toggles for "Email notifications", "Push notifications", and "Dark mode". Add a "Save changes" button at the bottom using the accent variant.
```

**Delete confirmation flow:**
```
Create a card with a list of 3 items. Each item has a destructive "Delete" button. When clicked, show a ConfirmDialog asking "Are you sure?".
```

**Filter bar:**
```
Create a horizontal filter bar with Chips for: "All", "Active", "Completed", "Archived". Only one should be selected at a time.
```

**Form with actions:**
```
Build a simple form with a title "Create Project", two text inputs (name and description), and two buttons: "Cancel" (outline) and "Create" (default).
```

---

## Tips for Better Results

1. **Name the components** — Say "use a Button" not "add a clickable thing"
2. **Specify variants** — Say "destructive Button" or "accent Button" for specific colors
3. **Mention state** — Say "disabled Toggle" or "selected Chip"
4. **Describe layout** — Say "side by side", "stacked vertically", "right-aligned"
5. **Reference the import** — Include the import line so Claude uses the right package

---

## Component Quick Reference

### Button

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="accent">Save Changes</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button disabled>Not Available</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Chip

```tsx
<Chip>Simple Tag</Chip>
<Chip selected>Active Filter</Chip>
<Chip icon={<SearchIcon />}>With Icon</Chip>
<Chip disabled>Locked</Chip>
```

### Toggle

```tsx
<Toggle checked={true} onChange={(val) => console.log(val)} />
<Toggle defaultChecked={false} />
<Toggle disabled />
```

### ConfirmDialog

```tsx
<ConfirmDialog
  title="Delete project?"
  description="This cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Keep it"
  variant="destructive"
  onConfirm={() => handleDelete()}
  onCancel={() => closeDialog()}
/>
```

---

## Tailwind Config for Other Projects

To use the same brand styles (colors, fonts, radius) in another app, add this `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Roboto", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "firm-navy": {
          DEFAULT: "#1E4C7E",
          light: "#2A6299",
          dark: "#153A61",
        },
        "firm-lime": {
          DEFAULT: "#AED136",
          light: "#B5DD5A",
          dark: "#7FB01E",
        },
        "firm-destructive": {
          DEFAULT: "#FF6158",
          dark: "#E5554D",
        },
        "firm-foreground": "var(--foreground)",
        "firm-muted": {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        "firm-border": "var(--border)",
        "firm-card": "var(--card)",
        "firm-background": "var(--background)",
        "firm-ring": "var(--ring)",
      },
      borderRadius: {
        firm: "var(--radius)",
        "firm-sm": "var(--radius-sm)",
      },
      boxShadow: {
        "firm-navy": "0 4px 14px rgba(29, 76, 126, 0.2)",
        "firm-lime": "0 4px 14px rgba(174, 209, 54, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
```

And add these CSS variables to your global stylesheet (e.g. `src/styles/globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: #F9FAFB;
    --foreground: #4B5563;
    --card: #FFFFFF;
    --muted: #F2F2F2;
    --muted-foreground: #6B7280;
    --border: #E5E7EB;
    --input-border: #C4C4C4;
    --ring: #AED136;
    --radius: 8px;
    --radius-sm: 4px;
  }
}
```

Or, if you're using the design system package, you can import the preset instead of copying:

```ts
// tailwind.config.ts — shortcut using the package preset
import krPreset from "@kaufman2699/kr-design-system/tailwind-config";

export default {
  presets: [krPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@kaufman2699/kr-design-system/dist/**/*.js",
  ],
};
```

---

## Design Tokens (For Reference)

If you want Claude to use specific brand colors in custom elements:

| Color | What It's For | Tailwind Class |
|-------|---------------|----------------|
| Navy (#1E4C7E) | Primary actions, headings | `text-firm-navy`, `bg-firm-navy` |
| Lime (#AED136) | Accent/success actions | `text-firm-lime`, `bg-firm-lime` |
| Red (#FF6158) | Destructive/danger | `bg-firm-destructive` |
| Gray (#4B5563) | Body text | `text-firm-foreground` |
| Muted (#F2F2F2) | Secondary backgrounds | `bg-firm-muted` |
| Border (#E5E7EB) | Dividers, card borders | `border-firm-border` |

**Fonts:** `font-heading` (Roboto) for titles, `font-sans` (Inter) for body/UI
**Border radius:** `rounded-firm` (8px) for cards, `rounded-firm-sm` (4px) for buttons
**Shadows:** `shadow-firm-navy`, `shadow-firm-lime` for branded elevation

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Claude doesn't use the right components | Include the import statement in your prompt |
| Styles look wrong | Make sure `import "@kaufman2699/kr-design-system/styles.css"` is included |
| Claude invents components that don't exist | Remind Claude: "Only use Button, Chip, Toggle, ConfirmDialog from the package" |
| Layout doesn't look right | Add layout instructions: "use flexbox", "center it", "add spacing between" |

---

## Full Starter Template

Give this to Claude when starting a new page:

```tsx
import { useState } from "react";
import "@kaufman2699/kr-design-system/styles.css";
import { Button, Chip, Toggle, ConfirmDialog } from "@kaufman2699/kr-design-system";

export function MyPage() {
  // Your page here
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1E4C7E] mb-6">Page Title</h1>
      {/* Components go here */}
    </div>
  );
}
```

Then describe what you want to build and Claude will fill in the components.
