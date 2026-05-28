# Figma to Tailwind Layout Mapping

## Auto Layout → Flexbox

| Figma Property | Tailwind Class | Notes |
|---|---|---|
| Direction: Horizontal | `flex` | Row is default |
| Direction: Vertical | `flex flex-col` | Column direction |
| Wrap | `flex-wrap` | Allow wrapping |

## Gap (Item Spacing)

| Figma (px) | Tailwind | Rem |
|---|---|---|
| 0 | `gap-0` | 0 |
| 2 | `gap-0.5` | 0.125rem |
| 4 | `gap-1` | 0.25rem |
| 6 | `gap-1.5` | 0.375rem |
| 8 | `gap-2` | 0.5rem |
| 10 | `gap-2.5` | 0.625rem |
| 12 | `gap-3` | 0.75rem |
| 16 | `gap-4` | 1rem |
| 20 | `gap-5` | 1.25rem |
| 24 | `gap-6` | 1.5rem |
| 32 | `gap-8` | 2rem |
| 40 | `gap-10` | 2.5rem |
| 48 | `gap-12` | 3rem |

## Padding

| Figma (px) | Tailwind | Axis-specific |
|---|---|---|
| 4 | `p-1` | `px-1` / `py-1` |
| 8 | `p-2` | `px-2` / `py-2` |
| 12 | `p-3` | `px-3` / `py-3` |
| 16 | `p-4` | `px-4` / `py-4` |
| 20 | `p-5` | `px-5` / `py-5` |
| 24 | `p-6` | `px-6` / `py-6` |
| 32 | `p-8` | `px-8` / `py-8` |
| 40 | `p-10` | `px-10` / `py-10` |
| 48 | `p-12` | `px-12` / `py-12` |

**Asymmetric padding:** When Figma has different top/bottom/left/right values:
```
Top: 24, Right: 32, Bottom: 24, Left: 32 → px-8 py-6
Top: 16, Right: 24, Bottom: 32, Left: 24 → px-6 pt-4 pb-8
```

## Alignment

### Primary Axis (justify)

| Figma | Tailwind |
|---|---|
| Packed (start) | `justify-start` (default) |
| Packed (center) | `justify-center` |
| Packed (end) | `justify-end` |
| Space Between | `justify-between` |

### Counter Axis (items)

| Figma | Tailwind |
|---|---|
| Top / Start | `items-start` |
| Center | `items-center` |
| Bottom / End | `items-end` |
| Stretch (fill) | `items-stretch` (default) |
| Baseline | `items-baseline` |

## Sizing (Resizing Behavior)

### Parent Frame

| Figma Behavior | Tailwind |
|---|---|
| Fixed width | `w-[Npx]` or Tailwind size class |
| Hug contents (horizontal) | `w-fit` or omit width |
| Hug contents (vertical) | `h-fit` or omit height |
| Fill container (when child) | `w-full` or `flex-1` |

### Child Elements

| Figma Behavior | Tailwind | When to use |
|---|---|---|
| Fill container | `flex-1` | Flexible growth in flex parent |
| Fill container | `w-full` | Fill entire parent width |
| Hug contents | (no class) | Default shrink-to-fit |
| Fixed | `w-[Npx]` | Exact pixel width |
| Fixed | `min-w-[Npx]` | Minimum with growth allowed |

**Key rule:** `flex-1` makes an element grow to fill available space. `w-full` makes it take 100% of parent width. Use `flex-1` in flex contexts where siblings share space.

## Constraints (Absolute Positioning)

When Figma uses constraints instead of Auto Layout:

| Figma Constraint | Tailwind |
|---|---|
| Left + Top | `absolute left-[N] top-[N]` |
| Right + Bottom | `absolute right-[N] bottom-[N]` |
| Center horizontally | `absolute left-1/2 -translate-x-1/2` |
| Center vertically | `absolute top-1/2 -translate-y-1/2` |
| Left + Right (stretch) | `absolute inset-x-[N]` |
| Top + Bottom (stretch) | `absolute inset-y-[N]` |

**Parent must have:** `relative` class when children use `absolute`.

## Grid Layouts

When Figma uses a grid-like arrangement:

| Pattern | Tailwind |
|---|---|
| Equal columns | `grid grid-cols-N gap-N` |
| Responsive columns | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` |
| Auto-fit | `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4` |
| Sidebar + content | `grid grid-cols-[250px_1fr] gap-4` |

## Overflow

| Figma | Tailwind |
|---|---|
| Clip content | `overflow-hidden` |
| Scroll vertically | `overflow-y-auto` |
| Scroll horizontally | `overflow-x-auto` |
| Visible (default) | `overflow-visible` |

## Common Page Layout Patterns

### Full-height app shell
```typescript
<div className="flex h-full flex-col">
  <header className="h-[var(--header-h)] border-b">...</header>
  <main className="flex-1 overflow-y-auto">...</main>
</div>
```

### Sidebar + content
```typescript
<div className="flex h-full">
  <aside className="w-[var(--sidebar-width)] border-r">...</aside>
  <main className="flex-1 overflow-y-auto">...</main>
</div>
```

### Centered content column
```typescript
<div className="mx-auto max-w-4xl px-6 py-8">
  {/* Content */}
</div>
```

### Card grid (responsive)
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card />
  <Card />
  <Card />
</div>
```

### Stack with dividers
```typescript
<div className="flex flex-col divide-y divide-[var(--border)]">
  <div className="py-4">Item 1</div>
  <div className="py-4">Item 2</div>
</div>
```

## Responsive Breakpoints

| Tailwind Prefix | Min Width | Typical Use |
|---|---|---|
| (none) | 0px | Mobile-first default |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Small desktops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

**Mobile-first rule:** Write the mobile layout as the default, then add breakpoint overrides:
```
className="flex flex-col md:flex-row"        → stacks on mobile, row on tablet+
className="grid grid-cols-1 lg:grid-cols-3"  → 1 col mobile, 3 cols desktop
className="hidden lg:block"                  → hidden until desktop
className="p-4 md:p-6 lg:p-8"               → increasing padding at breakpoints
```
