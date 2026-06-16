import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { components } from "./catalog.ts";
import { designTokens } from "./tokens.ts";

const STORYBOOK_BASE_URL = process.env.STORYBOOK_URL || "http://localhost:6006";
const PACKAGE_NAME = "@kaufman2699/kr-design-system";

const server = new McpServer({
  name: "kr-design-system",
  version: "0.1.0",
});

// --- Resources ---

server.registerResource("components-catalog", "design-system://components", { description: "Full catalog of available UI components" }, async () => {
  const catalog = components.map((c) => ({
    name: c.name,
    description: c.description,
    variants: c.variants,
    sizes: c.sizes,
    propsCount: c.props.length,
    storybook: `${STORYBOOK_BASE_URL}${c.storybookPath}`,
  }));

  return {
    contents: [
      {
        uri: "design-system://components",
        mimeType: "application/json",
        text: JSON.stringify(catalog, null, 2),
      },
    ],
  };
});

server.registerResource("design-tokens", "design-system://tokens", { description: "Design tokens (colors, typography, radius) as Tailwind classes" }, async () => {
  return {
    contents: [
      {
        uri: "design-system://tokens",
        mimeType: "application/json",
        text: JSON.stringify(designTokens, null, 2),
      },
    ],
  };
});

server.registerResource("usage-guide", "design-system://usage", { description: "Quick-start guide for installing and using the package" }, async () => {
  const guide = `# Using ${PACKAGE_NAME}

## Install
\`\`\`bash
pnpm add ${PACKAGE_NAME}
\`\`\`

## Import Styles (once in app entry)
\`\`\`tsx
import "${PACKAGE_NAME}/styles.css";
\`\`\`

## Import Components
\`\`\`tsx
import { Button, Chip, Toggle, ConfirmDialog } from "${PACKAGE_NAME}";
\`\`\`

## Available Components
${components.map((c) => `- **${c.name}** — ${c.description}`).join("\n")}

## Design Tokens (Tailwind Classes)
### Colors
${designTokens.colors.map((t) => `- \`${t.tailwind}\` (${t.hex}) — ${t.usage}`).join("\n")}

### Typography
- \`font-heading\` (Roboto) — headings, titles
- \`font-sans\` (Inter) — body, buttons, labels

### Border Radius
- \`rounded-firm\` (8px) — cards, containers
- \`rounded-firm-sm\` (4px) — buttons, inputs
`;

  return {
    contents: [
      {
        uri: "design-system://usage",
        mimeType: "text/markdown",
        text: guide,
      },
    ],
  };
});

// --- Tools ---

server.registerTool(
  "list_components",
  { description: "List all available components in the KR Design System with descriptions" },
  async () => {
    const list = components.map(
      (c) => `• **${c.name}** — ${c.description}\n  Storybook: ${STORYBOOK_BASE_URL}${c.storybookPath}`,
    );
    return { content: [{ type: "text", text: list.join("\n\n") }] };
  },
);

server.registerTool(
  "get_component_code",
  {
    description: "Get a ready-to-use code example for a specific component",
    inputSchema: { component: z.string().describe("Component name (Button, Chip, Toggle, ConfirmDialog)") },
  },
  async ({ component }) => {
    const comp = components.find(
      (c) => c.name.toLowerCase() === component.toLowerCase(),
    );
    if (!comp) {
      return {
        content: [
          {
            type: "text",
            text: `Component "${component}" not found. Available: ${components.map((c) => c.name).join(", ")}`,
          },
        ],
      };
    }

    const propsDoc = comp.props
      .map((p) => `  ${p.name}${p.required ? "" : "?"}: ${p.type}${p.default ? ` (default: ${p.default})` : ""} — ${p.description}`)
      .join("\n");

    const code = `// Import
import { ${comp.importName} } from "${PACKAGE_NAME}";

// Props
interface ${comp.importName}Props {
${propsDoc}
}

// Example usage
${comp.example}

// Storybook: ${STORYBOOK_BASE_URL}${comp.storybookPath}`;

    return { content: [{ type: "text", text: code }] };
  },
);

server.registerTool(
  "get_storybook_url",
  {
    description: "Get the Storybook documentation URL for a component",
    inputSchema: { component: z.string().describe("Component name") },
  },
  async ({ component }) => {
    const comp = components.find(
      (c) => c.name.toLowerCase() === component.toLowerCase(),
    );
    if (!comp) {
      return {
        content: [
          {
            type: "text",
            text: `Component "${component}" not found. Available: ${components.map((c) => c.name).join(", ")}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `${comp.name} Storybook: ${STORYBOOK_BASE_URL}${comp.storybookPath}`,
        },
      ],
    };
  },
);

server.registerTool(
  "get_design_tokens",
  { description: "Get all design tokens (colors, typography, radius) as Tailwind classes" },
  async () => {
    const colors = designTokens.colors
      .map((t: any) => `• \`${t.tailwind}\` — ${t.hex} — ${t.usage}`)
      .join("\n");
    const typography = Object.values(designTokens.typography)
      .map((t: any) => `• \`${t.tailwind}\` (${t.font}) — ${t.usage}`)
      .join("\n");
    const radius = designTokens.radius
      .map((r: any) => `• \`${r.tailwind}\` (${r.value}) — ${r.usage}`)
      .join("\n");
    const shadows = designTokens.shadows
      .map((s: any) => `• \`${s.tailwind}\` — ${s.usage}`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `## Colors\n${colors}\n\n## Typography\n${typography}\n\n## Border Radius\n${radius}\n\n## Shadows\n${shadows}`,
        },
      ],
    };
  },
);

// --- Start ---

const transport = new StdioServerTransport();
await server.connect(transport);
