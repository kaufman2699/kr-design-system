# KR Design System MCP Server

An MCP (Model Context Protocol) server that exposes the KR Design System component catalog to Claude. Enables Claude.ai web chat users to build React apps using the correct components, props, and design tokens — without needing Claude Code CLI.

## How It Works

```
Claude.ai web → MCP Server → Component catalog, code examples, Storybook links
```

When connected, Claude automatically knows:
- What components are available (Button, Chip, Toggle, ConfirmDialog)
- Each component's props, variants, and sizes
- How to import and use them correctly
- Design tokens (colors, fonts, radius) as Tailwind classes
- Links to live Storybook for previewing

## Available Tools

| Tool | Description |
|------|-------------|
| `list_components` | Lists all components with descriptions and Storybook links |
| `get_component_code` | Returns import, props interface, and usage example for a component |
| `get_storybook_url` | Returns the Storybook documentation URL for a component |
| `get_design_tokens` | Returns all brand colors, typography, and radius as Tailwind classes |

## Available Resources

| Resource | Description |
|----------|-------------|
| `design-system://components` | Full component catalog as JSON |
| `design-system://tokens` | Design tokens as JSON |
| `design-system://usage` | Quick-start installation and usage guide |

## Running Locally

```bash
cd mcp-server
pnpm install

# Stdio transport (for Claude Code CLI)
pnpm start

# HTTP transport (for Claude.ai web / remote clients)
pnpm start:http    # → http://localhost:3100/mcp

# Development (HTTP with file watching)
pnpm dev
```

## Connecting to Claude Code CLI

Already configured in the repo's `.mcp.json`:

```json
{
  "mcpServers": {
    "kr-design-system": {
      "command": "node",
      "args": ["--experimental-strip-types", "mcp-server/index.ts"]
    }
  }
}
```

## Connecting to Claude.ai Web

1. Deploy the HTTP server (see Deployment below)
2. In Claude.ai → Settings → Integrations → Add MCP Server
3. Enter your deployed URL: `https://your-server.com/mcp`

## Deployment

### Docker

```bash
cd mcp-server
docker build -t kr-design-system-mcp .
docker run -p 3100:3100 -e STORYBOOK_URL=https://your-storybook.com kr-design-system-mcp
```

### Railway / Render

1. Connect your GitHub repo
2. Set root directory to `mcp-server`
3. Set build command: `npm install`
4. Set start command: `node --experimental-strip-types http.ts`
5. Set environment variable: `STORYBOOK_URL=https://your-storybook.com`

### Vercel (Serverless)

Not directly supported — the StreamableHTTP transport requires a long-running server. Use Railway, Render, or Fly.io instead.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3100` | HTTP server port |
| `STORYBOOK_URL` | `http://localhost:6006` | Base URL for Storybook links in responses |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/mcp` | MCP protocol endpoint (JSON-RPC over SSE) |
| GET | `/health` | Health check (returns `{"status":"ok"}`) |

## Files

```
mcp-server/
├── index.ts        ← Stdio transport (Claude Code CLI)
├── http.ts         ← HTTP transport (Claude.ai web, deployable)
├── catalog.ts      ← Component metadata (names, props, variants, examples)
├── tokens.ts       ← Design tokens (colors, typography, radius)
├── package.json    ← Dependencies and scripts
├── Dockerfile      ← Container deployment
└── README.md       ← This file
```

## Adding New Components

When a new component is added to the design system, update `catalog.ts`:

```ts
// catalog.ts
export const components: ComponentInfo[] = [
  // ... existing components
  {
    name: "NewComponent",
    description: "What it does",
    importName: "NewComponent",
    props: [
      { name: "variant", type: '"default" | "accent"', required: false, default: '"default"', description: "Visual style" },
    ],
    variants: ["default", "accent"],
    example: `<NewComponent variant="accent">Label</NewComponent>`,
    storybookPath: "/docs/ui-newcomponent--docs",
  },
];
```

## Testing

```bash
# Test stdio transport
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | pnpm start

# Test HTTP transport
pnpm start:http &
curl http://localhost:3100/health
```
