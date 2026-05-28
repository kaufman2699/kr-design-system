# Component Authoring Patterns

## Core Conventions

Every React component produced from a Figma design must follow these patterns.

### 1. TypeScript Interface

Extend the appropriate HTML element attributes:

```typescript
// For div-based components
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent";
}

// For button-based components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "accent" | "destructive";
  size?: "sm" | "default" | "lg";
  asChild?: boolean;
}

// For input-based components
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}
```

### 2. forwardRef Pattern

Use `React.forwardRef` for any component wrapping a single DOM element:

```typescript
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("base-classes", variantClasses[variant], className)}
      {...props}
    />
  ),
);
Component.displayName = "Component";
```

**When to skip forwardRef:**
- Page-level components (never need ref)
- Components with complex internal structure (multiple interactive elements)
- Wrapper/provider components

### 3. Class Merge Utility (cn)

Always wrap className in the project's merge utility:

```typescript
// Project utility (typically src/lib/utils.ts)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**Usage:**
```typescript
// Always accept className prop and merge it last
className={cn("rounded-xl border p-4", variantClasses[variant], className)}
```

This allows consumers to override any Tailwind class:
```tsx
<Card className="p-8" />  // p-8 overrides p-4
```

### 4. Variant Pattern

Define visual states as a `const` object:

```typescript
const variantClasses = {
  default: "bg-white border-[var(--border)] text-[var(--foreground)]",
  accent: "bg-firm-lime/10 border-firm-lime text-firm-navy-dark",
  destructive: "bg-red-50 border-red-200 text-red-700",
} as const;

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  default: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
} as const;
```

**Benefits:**
- Type-safe variant props (inferred from object keys)
- Easy to extend without modifying component logic
- Clear visual overview of all states

### 5. Compound Components

For complex UI elements with multiple sub-parts:

```typescript
function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border bg-white", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-6 pb-0", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-firm-navy", className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
```

### 6. Icon Usage

Replace any SVG or icon reference with the project's Icon component:

```typescript
import { Icon } from "@/components/ui/icon";

// Usage
<Icon name="chart-bar" weight="regular" size={20} className="text-firm-lime-dark" />
```

**Props:**
- `name` — icon identifier from the icon font
- `weight` — `"light"` | `"regular"` | `"solid"` (defaults to `"regular"`)
- `size` — pixel size (defaults to 22)
- `className` — for color and spacing overrides

### 7. Interaction States

Every interactive element must define these Tailwind states:

```typescript
const interactiveBase = [
  // Transition
  "transition-all duration-200",
  // Focus
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-firm-lime focus-visible:ring-offset-2",
  // Disabled
  "disabled:pointer-events-none disabled:opacity-50",
  // Active
  "active:scale-[0.98]",
].join(" ");
```

**Hover examples:**
```
hover:bg-firm-navy-light        → darker background
hover:shadow-lg                 → elevation increase
hover:shadow-firm-navy/20       → colored shadow
hover:text-firm-navy-dark       → darker text
```

### 8. Responsive Patterns

Use Tailwind breakpoints for responsive layout changes:

```typescript
// Stack on mobile, row on desktop
className="flex flex-col md:flex-row gap-4"

// Single column → two columns
className="grid grid-cols-1 md:grid-cols-2 gap-4"

// Hidden on mobile
className="hidden md:block"

// Different padding per breakpoint
className="px-4 md:px-6 lg:px-8"
```

### 9. Slot Pattern (Radix)

For components that need to render as a different element:

```typescript
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} {...props} />;
  },
);
```

Usage as a link:
```tsx
<Button asChild>
  <a href="/page">Navigate</a>
</Button>
```

## File Organization

### Imports Order

```typescript
// 1. React
import * as React from "react";

// 2. Third-party libraries
import { Slot } from "@radix-ui/react-slot";

// 3. Internal utilities
import { cn } from "@/lib/utils";

// 4. Internal components
import { Icon } from "@/components/ui/icon";

// 5. Types (if separate)
import type { VariantProps } from "./types";
```

### Export Pattern

```typescript
// Named exports (preferred for components)
export { Button, buttonVariants };

// Default export only for page components
export default function DashboardPage() { ... }
```

### File Size Rule

Maximum 500 lines per file. If a component exceeds this:
1. Extract sub-components into separate files
2. Create an `index.ts` barrel if needed
3. Keep the main component file focused on composition

## Firm Brand Component Defaults

Reference implementation using Kaufman Rossin design system:

```typescript
// Base card
"rounded-xl border border-[var(--border)] bg-white p-6"

// Primary button
"bg-firm-navy text-white hover:bg-firm-navy-light hover:shadow-lg hover:shadow-firm-navy/20"

// Accent button
"bg-firm-lime text-firm-navy-dark hover:bg-firm-lime-light hover:shadow-md hover:shadow-firm-lime/25"

// Input field
"h-10 w-full rounded-lg border border-[var(--input-border)] bg-white px-3 text-sm"

// Section heading
"text-lg font-semibold text-firm-navy"

// Body text
"text-sm text-[var(--foreground)]"

// Muted/helper text
"text-sm text-[var(--muted-foreground)]"
```
