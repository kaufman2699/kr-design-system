import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "./confirm-dialog";

const meta = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Dialog heading text",
      table: { category: "Content" },
    },
    description: {
      control: "text",
      description: "Explanatory text below the title. Accepts ReactNode for bold/styled text.",
      table: { category: "Content" },
    },
    confirmLabel: {
      control: "text",
      description: "Label for the confirm button",
      table: {
        category: "Content",
        defaultValue: { summary: "Confirm" },
      },
    },
    cancelLabel: {
      control: "text",
      description: "Label for the cancel button",
      table: {
        category: "Content",
        defaultValue: { summary: "Cancel" },
      },
    },
    variant: {
      control: "select",
      options: ["destructive", "default", "accent"],
      description: "Visual style of the confirm button",
      table: {
        category: "Appearance",
        defaultValue: { summary: "destructive" },
      },
    },
    onConfirm: {
      action: "confirmed",
      description: "Called when the confirm button is clicked",
      table: { category: "Events" },
    },
    onCancel: {
      action: "cancelled",
      description: "Called when the cancel button is clicked",
      table: { category: "Events" },
    },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/bpLxT4jRKKxQBO6qwO7lB2/WES?node-id=253-1150&m=dev",
    },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Destructive: Story = {
  args: {
    title: "Delete chat?",
    description: (
      <>
        This will delete <strong>API Integration Discussion</strong> chat.
      </>
    ),
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    variant: "destructive",
  },
};

export const Default: Story = {
  args: {
    title: "Confirm action",
    description: "Are you sure you want to proceed? This action cannot be undone.",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    variant: "default",
  },
};

export const Accent: Story = {
  args: {
    title: "Save changes?",
    description: "Your unsaved changes will be applied to the document.",
    confirmLabel: "Save",
    cancelLabel: "Discard",
    variant: "accent",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <ConfirmDialog
        title="Delete chat?"
        description={<>This will delete <strong>API Integration Discussion</strong> chat.</>}
        confirmLabel="Delete"
        variant="destructive"
      />
      <ConfirmDialog
        title="Confirm action"
        description="Are you sure you want to proceed?"
        confirmLabel="Confirm"
        variant="default"
      />
      <ConfirmDialog
        title="Save changes?"
        description="Your unsaved changes will be applied."
        confirmLabel="Save"
        variant="accent"
      />
    </div>
  ),
};
