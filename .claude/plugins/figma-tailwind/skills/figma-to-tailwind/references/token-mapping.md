# Token Mapping Strategy

## Resolution Order

When converting Figma design values to Tailwind classes, resolve tokens in this order:

1. **Exact Figma variable match** → Use the project's Tailwind token directly
2. **CSS custom property match** → Use `var(--token-name)` in arbitrary value syntax
3. **Tailwind default match** → Use standard Tailwind class (e.g., `text-gray-500`)
4. **No match** → Add as new token to both CSS and Tailwind config

## Adding New Tokens

When a Figma variable has no existing match:

1. Add CSS custom property to the global stylesheet:
   ```css
   :root {
     --new-token: #HEX_VALUE;
   }
   ```

2. Add to Tailwind config:
   ```js
   // tailwind.config.js
   theme: {
     extend: {
       colors: {
         'new-token': 'var(--new-token)',
         // OR with namespace:
         brand: {
           'new-token': '#HEX_VALUE',
         }
       }
     }
   }
   ```

3. Both files must stay in sync — every CSS variable referenced in Tailwind config must exist in CSS.

## Color Mapping

### Direct Token Classes (preferred)

When a hex value matches a token defined in `tailwind.config.js`:
```
#1D4C7E → text-firm-navy / bg-firm-navy
#AED136 → text-firm-lime / bg-firm-lime
```

### CSS Variable Syntax

When using CSS custom properties not in the Tailwind color palette:
```
var(--background)       → bg-[var(--background)]
var(--foreground)       → text-[var(--foreground)]
var(--muted-foreground) → text-[var(--muted-foreground)]
var(--border)           → border-[var(--border)]
```

### Tailwind Defaults

When no custom token exists but a standard Tailwind color is close enough:
```
#EF4444 → text-red-500 / bg-red-500
#F59E0B → text-amber-500
#10B981 → text-emerald-500
```

### Opacity Variants

Use Tailwind's opacity modifier instead of rgba:
```
rgba(174, 209, 54, 0.1) → bg-firm-lime/10
rgba(29, 76, 126, 0.2)  → bg-firm-navy/20
```

## Spacing Mapping

Figma spacing values to Tailwind spacing scale:

| Figma (px) | Tailwind | Rem |
|---|---|---|
| 1 | `0.5` (gap-px) | — |
| 2 | `0.5` | 0.125rem |
| 4 | `1` | 0.25rem |
| 6 | `1.5` | 0.375rem |
| 8 | `2` | 0.5rem |
| 10 | `2.5` | 0.625rem |
| 12 | `3` | 0.75rem |
| 14 | `3.5` | 0.875rem |
| 16 | `4` | 1rem |
| 20 | `5` | 1.25rem |
| 24 | `6` | 1.5rem |
| 28 | `7` | 1.75rem |
| 32 | `8` | 2rem |
| 36 | `9` | 2.25rem |
| 40 | `10` | 2.5rem |
| 48 | `12` | 3rem |
| 56 | `14` | 3.5rem |
| 64 | `16` | 4rem |

For non-standard values, use arbitrary: `p-[18px]` or `gap-[22px]`.

## Typography Mapping

| Figma Property | Tailwind Class |
|---|---|
| Font Size: 12px | `text-xs` |
| Font Size: 14px | `text-sm` |
| Font Size: 16px | `text-base` |
| Font Size: 18px | `text-lg` |
| Font Size: 20px | `text-xl` |
| Font Size: 24px | `text-2xl` |
| Font Weight: 400 | `font-normal` |
| Font Weight: 500 | `font-medium` |
| Font Weight: 600 | `font-semibold` |
| Font Weight: 700 | `font-bold` |
| Line Height: 1.25 | `leading-tight` |
| Line Height: 1.5 | `leading-normal` |
| Line Height: 1.75 | `leading-relaxed` |
| Letter Spacing: -0.025em | `tracking-tight` |
| Letter Spacing: 0.025em | `tracking-wide` |

## Border Radius Mapping

| Figma (px) | Tailwind Class |
|---|---|
| 2 | `rounded-sm` |
| 4 | `rounded` |
| 6 | `rounded-md` |
| 8 | `rounded-lg` |
| 10 | `rounded-[var(--radius)]` (project default) |
| 12 | `rounded-xl` |
| 16 | `rounded-2xl` |
| 24 | `rounded-3xl` |
| 9999 | `rounded-full` |

## Shadow Mapping

| Figma Shadow | Tailwind Class |
|---|---|
| 0 1px 2px rgba(0,0,0,0.05) | `shadow-sm` |
| 0 1px 3px rgba(0,0,0,0.1) | `shadow` |
| 0 4px 6px rgba(0,0,0,0.1) | `shadow-md` |
| 0 10px 15px rgba(0,0,0,0.1) | `shadow-lg` |
| 0 20px 25px rgba(0,0,0,0.1) | `shadow-xl` |
| 0 25px 50px rgba(0,0,0,0.25) | `shadow-2xl` |

## Firm Brand Defaults

These are the default tokens for the Kaufman Rossin / Ruflo projects:

### Font Families

| Usage | Font | Tailwind Class |
|---|---|---|
| UI elements, buttons, body text | `Inter` | `font-sans` |
| Headings, titles | `Roboto` | `font-heading` |

When Figma shows `Roboto:Bold` → use `font-heading font-bold`.
When Figma shows `Inter:Semi_Bold` → use `font-sans font-semibold`.

### Colors

| Name | Hex | Tailwind Class | CSS Variable |
|---|---|---|---|
| Navy | `#1E4C7E` | `firm-navy` | `--firm-navy` |
| Navy Light | `#2A6299` | `firm-navy-light` | `--firm-navy-light` |
| Navy Dark | `#153A61` | `firm-navy-dark` | `--firm-navy-dark` |
| Lime | `#AED136` | `firm-lime` | `--firm-lime` |
| Lime Light | `#B5DD5A` | `firm-lime-light` | `--firm-lime-light` |
| Lime Dark | `#7FB01E` | `firm-lime-dark` | `--firm-lime-dark` |
| Destructive | `#FF6158` | `firm-destructive` | `--firm-destructive` |
| Destructive Dark | `#E5554D` | `firm-destructive-dark` | `--firm-destructive-dark` |
| Background | `#F9FAFB` | `bg-firm-background` | `--background` |
| Foreground | `#4B5563` | `text-firm-foreground` | `--foreground` |
| Card | `#FFFFFF` | `bg-firm-card` | `--card` |
| Muted | `#F2F2F2` | `bg-firm-muted` | `--muted` |
| Muted Foreground | `#6B7280` | `text-firm-muted-foreground` | `--muted-foreground` |
| Border | `#E5E7EB` | `border-firm-border` | `--border` |
| Input Border | `#C4C4C4` | `border-[var(--input-border)]` | `--input-border` |
| Ring | `#AED136` | `ring-firm-lime` | `--ring` |

### Border Radius

| Usage | Value | Tailwind Class | CSS Variable |
|---|---|---|---|
| Cards, dialogs, containers | `8px` | `rounded-firm` | `--radius` |
| Buttons, inputs, small elements | `4px` | `rounded-firm-sm` | `--radius-sm` |

### Key Mappings from Figma

| Figma Value | Correct Tailwind | NOT this |
|---|---|---|
| `#FF6158` (red button) | `bg-firm-destructive` | ~~`bg-red-500`~~ |
| `#F2F2F2` (cancel bg) | `bg-firm-muted` | ~~`bg-white`~~ |
| `#C4C4C4` (cancel border) | `border-[var(--input-border)]` | ~~`border-firm-border`~~ |
| `#1E4C7E` (navy text) | `text-firm-navy` | ~~`text-[#1E4C7E]`~~ |
| Button border-radius | `rounded-firm-sm` | ~~`rounded-firm`~~ |
| Card border-radius | `rounded-firm` | ~~`rounded-lg`~~ |

For other projects, discover tokens at runtime by reading `tailwind.config.js` and the global CSS file.
