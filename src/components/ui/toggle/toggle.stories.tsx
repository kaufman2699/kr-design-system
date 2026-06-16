import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "storybook/test";
import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled on/off state",
      table: {
        category: "State",
        defaultValue: { summary: "undefined" },
      },
    },
    defaultChecked: {
      control: "boolean",
      description: "Initial state for uncontrolled usage",
      table: {
        category: "State",
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Prevents interaction and reduces opacity",
      table: {
        category: "State",
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "changed",
      description: "Callback fired when toggle state changes. Receives the new boolean value.",
      table: { category: "Events" },
    },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/bpLxT4jRKKxQBO6qwO7lB2/WES?node-id=55-245",
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { checked: false },
};

export const On: Story = {
  args: { checked: true },
};

export const Disabled: Story = {
  args: { checked: false, disabled: true },
};

export const DisabledOn: Story = {
  args: { checked: true, disabled: true },
};

export const Interactive: Story = {
  args: { defaultChecked: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch");
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "false");
  },
};

export const WithLabel: Story = {
  render: () => (
    <label className="flex items-center gap-2 text-sm text-firm-foreground">
      <Toggle defaultChecked />
      Enable notifications
    </label>
  ),
};
