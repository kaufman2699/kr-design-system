# Storybook Story Templates

Generate a `.stories.tsx` file alongside every component created by the Figma-to-Tailwind workflow.

## Imports

Always import types from `@storybook/react`:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
```

## Template: Variant-Based Component

For components with `variantClasses` and/or `sizeClasses`:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./component-name";

const meta = {
  title: "UI/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  args: {
    children: "Label",           // sensible defaults for interactive controls
  },
  argTypes: {
    // --- Content ---
    children: {
      control: "text",
      description: "Button label text",
      table: { category: "Content" },
    },
    icon: {
      control: false,            // ReactNode — no control, show in docs only
      description: "Optional leading icon (ReactNode)",
      table: { category: "Content" },
    },
    // --- Appearance ---
    variant: {
      control: "select",
      options: ["default", "accent", /* ...all variant keys */],
      description: "Visual style of the component",
      table: {
        category: "Appearance",
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", /* ...all size keys */],
      description: "Size of the component",
      table: {
        category: "Appearance",
        defaultValue: { summary: "default" },
      },
    },
    // --- State ---
    disabled: {
      control: "boolean",
      description: "Disables interaction and reduces opacity",
      table: {
        category: "State",
        defaultValue: { summary: "false" },
      },
    },
    // --- Events ---
    onClick: {
      action: "clicked",
      description: "Click handler",
      table: { category: "Events" },
    },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/FILE_KEY/...?node-id=X-Y",
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// One story per variant
export const Default: Story = {
  args: { children: "Label", variant: "default" },
};

export const Accent: Story = {
  args: { children: "Label", variant: "accent" },
};

// All variants together
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(["default", "accent", /* ...keys */] as const).map((v) => (
        <ComponentName key={v} variant={v}>
          {v}
        </ComponentName>
      ))}
    </div>
  ),
};
```

## Template: Compound Component

For multi-part components (Card, CardHeader, CardTitle, CardContent):

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[380px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description text.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--muted-foreground)]">Content area.</p>
      </CardContent>
    </Card>
  ),
};
```

## Template: Feature Component (with mocked state)

For components that depend on Zustand stores or API data:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { FeatureComponent } from "./feature-component";

const meta = {
  title: "Features/FeatureName/FeatureComponent",
  component: FeatureComponent,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-lg p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    design: { type: "figma", url: "..." },
  },
} satisfies Meta<typeof FeatureComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { status: "loading" } };
export const Success: Story = { args: { status: "success", data: mockData } };
export const Error: Story = { args: { status: "error", error: "Something went wrong" } };
```

## Rules

1. **Always use `satisfies Meta<typeof X>`** — provides full type safety without type assertion
2. **Always include `tags: ["autodocs"]`** — generates automatic documentation
3. **Always include `parameters.design.url`** — links to the source Figma frame
4. **Title must follow the convention** — `UI/`, `Components/`, or `Features/Group/`
5. **Use `argTypes` for controlled props** — variant enums get `select` control
6. **Render stories for complex compositions** — use `render` when `args` alone can't express the story
7. **Name stories with PascalCase** — `Default`, `Accent`, `AllVariants`, `WithIcon`
8. **Wrap in a size-constrained decorator** — prevents full-width stretching for components with responsive behavior
9. **Use the project's Icon component** — not inline SVGs, matching the same rule from component-patterns.md
10. **Include interaction states** — `Disabled`, `Focused`, or `Loading` stories for interactive components
