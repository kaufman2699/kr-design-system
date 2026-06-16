/**
 * Generates mcp-server/tokens.ts from tailwind.config.ts and src/styles/globals.css.
 *
 * Extracts:
 * - Colors from tailwind.config.ts theme.extend.colors
 * - Font families from theme.extend.fontFamily
 * - Border radius from theme.extend.borderRadius
 * - Box shadows from theme.extend.boxShadow
 * - CSS variables from src/styles/globals.css :root
 *
 * Run: node --experimental-strip-types scripts/generate-tokens.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TAILWIND_CONFIG = join(ROOT, "tailwind.config.ts");
const GLOBALS_CSS = join(ROOT, "src/styles/globals.css");
const OUTPUT = join(ROOT, "mcp-server/tokens.ts");

// Read tailwind config as text and extract theme.extend
const configSource = readFileSync(TAILWIND_CONFIG, "utf-8");
const cssSource = readFileSync(GLOBALS_CSS, "utf-8");

// --- Extract colors ---
interface ColorToken {
  name: string;
  hex: string;
  tailwind: string;
  usage: string;
}

function extractColors(): ColorToken[] {
  const colors: ColorToken[] = [];

  // Match color entries like: "firm-navy": { DEFAULT: "#1E4C7E", light: "#2A6299", dark: "#153A61" }
  const colorBlockRegex = /"(firm-[\w-]+)":\s*\{([^}]+)\}/g;
  let match;

  while ((match = colorBlockRegex.exec(configSource)) !== null) {
    const [, name, body] = match;
    const entries = [...body.matchAll(/([\w]+):\s*"(#[A-Fa-f0-9]+)"/g)];

    for (const entry of entries) {
      const [, variant, hex] = entry;
      const isDefault = variant === "DEFAULT";
      const tokenName = isDefault ? name : `${name}-${variant}`;
      const displayName = tokenName
        .replace("firm-", "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      colors.push({
        name: displayName,
        hex,
        tailwind: tokenName,
        usage: guessUsage(tokenName),
      });
    }
  }

  // Match simple color entries like: "firm-foreground": "var(--foreground)"
  const simpleColorRegex = /"(firm-[\w-]+)":\s*"(var\(--[\w-]+\))"/g;
  while ((match = simpleColorRegex.exec(configSource)) !== null) {
    const [, name, cssVar] = match;
    const varName = cssVar.replace("var(--", "").replace(")", "");
    const hex = extractCssVarValue(varName);

    if (hex) {
      const displayName = name
        .replace("firm-", "")
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      colors.push({
        name: displayName,
        hex,
        tailwind: name,
        usage: guessUsage(name),
      });
    }
  }

  return colors;
}

function extractCssVarValue(varName: string): string | null {
  const match = cssSource.match(new RegExp(`--${varName}:\\s*(#[A-Fa-f0-9]+)`));
  return match ? match[1] : null;
}

function guessUsage(tokenName: string): string {
  const usageMap: Record<string, string> = {
    "firm-navy": "Primary buttons, headings",
    "firm-navy-light": "Hover state for primary",
    "firm-navy-dark": "Active state, dark backgrounds",
    "firm-lime": "Accent buttons, focus rings, success",
    "firm-lime-light": "Hover state for accent",
    "firm-lime-dark": "Active state for accent",
    "firm-destructive": "Delete/danger actions",
    "firm-destructive-dark": "Hover state for destructive",
    "firm-foreground": "Body text",
    "firm-muted": "Secondary backgrounds, outline buttons",
    "firm-border": "Card borders, dividers",
    "firm-card": "Card backgrounds",
    "firm-background": "Page background",
    "firm-ring": "Focus ring color",
  };
  return usageMap[tokenName] || "";
}

// --- Extract typography ---
interface TypographyToken {
  key: string;
  font: string;
  tailwind: string;
  usage: string;
}

function extractTypography(): TypographyToken[] {
  const tokens: TypographyToken[] = [];

  const fontFamilyMatch = configSource.match(/fontFamily:\s*\{([\s\S]*?)\}/);
  if (!fontFamilyMatch) return tokens;

  const body = fontFamilyMatch[1];
  const entries = [...body.matchAll(/(\w+):\s*\["([^"]+)"/g)];

  const usageMap: Record<string, string> = {
    sans: "Body text, buttons, labels (default)",
    heading: "Headings, titles, dialog headers",
  };

  for (const [, key, font] of entries) {
    tokens.push({
      key,
      font,
      tailwind: `font-${key}`,
      usage: usageMap[key] || "",
    });
  }

  return tokens;
}

// --- Extract border radius ---
interface RadiusToken {
  name: string;
  value: string;
  tailwind: string;
  usage: string;
}

function extractRadius(): RadiusToken[] {
  const tokens: RadiusToken[] = [];

  // Extract from CSS vars
  const radiusVars = [...cssSource.matchAll(/--radius(-\w+)?:\s*(\d+px)/g)];

  const nameMap: Record<string, string> = {
    "--radius": "Container",
    "--radius-sm": "Element",
  };

  const usageMap: Record<string, string> = {
    "rounded-firm": "Cards, dialogs, containers",
    "rounded-firm-sm": "Buttons, inputs, small elements",
  };

  for (const [, suffix, value] of radiusVars) {
    const varName = suffix ? `--radius${suffix}` : "--radius";
    const tailwind = suffix ? `rounded-firm${suffix}` : "rounded-firm";
    tokens.push({
      name: nameMap[varName] || varName,
      value,
      tailwind,
      usage: usageMap[tailwind] || "",
    });
  }

  return tokens;
}

// --- Extract shadows ---
interface ShadowToken {
  name: string;
  tailwind: string;
  usage: string;
}

function extractShadows(): ShadowToken[] {
  const tokens: ShadowToken[] = [];

  const shadowMatch = configSource.match(/boxShadow:\s*\{([\s\S]*?)\}/);
  if (!shadowMatch) return tokens;

  const entries = [...shadowMatch[1].matchAll(/"([\w-]+)":/g)];

  for (const [, key] of entries) {
    const displayName = key
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    tokens.push({
      name: `${displayName} Shadow`,
      tailwind: `shadow-${key}`,
      usage: `Elevation for ${key.replace("firm-", "")} elements`,
    });
  }

  return tokens;
}

// --- Generate output ---
const colors = extractColors();
const typography = extractTypography();
const radius = extractRadius();
const shadows = extractShadows();

const output = `// AUTO-GENERATED by scripts/generate-tokens.ts
// Do not edit manually. Run: node --experimental-strip-types scripts/generate-tokens.ts

export const designTokens = {
  colors: ${JSON.stringify(colors, null, 4)},
  typography: {
${typography.map((t) => `    ${t.key}: { font: "${t.font}", tailwind: "${t.tailwind}", usage: "${t.usage}" }`).join(",\n")}
  },
  radius: ${JSON.stringify(radius, null, 4)},
  shadows: ${JSON.stringify(shadows, null, 4)},
};
`;

writeFileSync(OUTPUT, output);
console.log(`Generated tokens → mcp-server/tokens.ts`);
console.log(`  • ${colors.length} colors`);
console.log(`  • ${typography.length} typography entries`);
console.log(`  • ${radius.length} radius values`);
console.log(`  • ${shadows.length} shadows`);
