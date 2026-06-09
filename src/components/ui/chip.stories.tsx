import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "./chip";

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM5.37 2.126a6.5 6.5 0 0 0-3.744 5.349h2.877c.058-1.862.348-3.563.867-4.896.128-.33.28-.647.453-.947l-.453-.506Zm5.26 0 .453.506c.173.3.325.617.453.947.52 1.333.81 3.034.867 4.896h2.877a6.5 6.5 0 0 0-3.744-5.349h-.906ZM8 1.5c-.577 0-1.175.57-1.637 1.63-.44 1.013-.724 2.48-.78 4.095h4.834c-.056-1.614-.34-3.082-.78-4.094C9.175 2.07 8.577 1.5 8 1.5Z" />
  </svg>
);

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: {
    children: "Enable Web Search",
  },
  argTypes: {
    selected: {
      control: "boolean",
      description: "Whether the chip is in the active/selected state",
      table: {
        category: "State",
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables the chip and prevents interaction",
      table: {
        category: "State",
        defaultValue: { summary: "false" },
      },
    },
    children: {
      control: "text",
      description: "Label text displayed inside the chip",
      table: { category: "Content" },
    },
    icon: {
      control: false,
      description: "Optional icon rendered before the label (pass a ReactNode)",
      table: { category: "Content" },
    },
    onClick: {
      action: "clicked",
      description: "Click handler",
      table: { category: "Events" },
    },
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/bpLxT4jRKKxQBO6qwO7lB2/WES?node-id=1029-1786",
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <SearchIcon />,
    children: "Enable Web Search",
  },
};

export const Selected: Story = {
  args: {
    icon: <SearchIcon />,
    children: "Web Search Enabled",
    selected: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    children: "Tag Label",
  },
};

export const Disabled: Story = {
  args: {
    icon: <GlobeIcon />,
    children: "Unavailable",
    disabled: true,
  },
};

export const ChipGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Chip icon={<SearchIcon />}>Enable Web Search</Chip>
      <Chip icon={<GlobeIcon />} selected>Browse Internet</Chip>
      <Chip>Code Mode</Chip>
      <Chip disabled>Premium Feature</Chip>
    </div>
  ),
};
