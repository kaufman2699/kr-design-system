import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "destructive", "outline", "ghost"],
      description: "Visual style of the button",
      table: {
        category: "Appearance",
        defaultValue: { summary: "default" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Size of the button (height and padding)",
      table: {
        category: "Appearance",
        defaultValue: { summary: "default" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables the button and reduces opacity",
      table: { category: "State" },
    },
    children: {
      control: "text",
      description: "Button label text or content",
      table: { category: "Content" },
    },
    onClick: {
      action: "clicked",
      description: "Click handler",
      table: { category: "Events" },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Button", variant: "default" },
};

export const Accent: Story = {
  args: { children: "Button", variant: "accent" },
};

export const Destructive: Story = {
  args: { children: "Delete", variant: "destructive" },
};

export const Outline: Story = {
  args: { children: "Button", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Button", variant: "ghost" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      {(["default", "accent", "destructive", "outline", "ghost"] as const).map(
        (v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ),
      )}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["sm", "default", "lg"] as const).map((s) => (
        <Button key={s} size={s}>
          Size {s}
        </Button>
      ))}
    </div>
  ),
};
