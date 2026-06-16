/**
 * Generates mcp-server/catalog.ts from src/components/ui/ source files.
 *
 * Reads each component folder, extracts:
 * - Component name and export name
 * - Props interface (name, type, required, default, description)
 * - Variant keys from `variantClasses` object
 * - Size keys from `sizeClasses` object
 * - Storybook path derived from component name
 *
 * Run: node --experimental-strip-types scripts/generate-catalog.ts
 */

import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const UI_DIR = join(import.meta.dirname, "../src/components/ui");
const OUTPUT = join(import.meta.dirname, "../mcp-server/catalog.ts");

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

interface ComponentInfo {
  name: string;
  description: string;
  importName: string;
  props: PropInfo[];
  variants?: string[];
  sizes?: string[];
  example: string;
  storybookPath: string;
}

function extractProps(source: string): PropInfo[] {
  const props: PropInfo[] = [];

  // Match interface block — handle multiline "extends" declarations
  const interfaceMatch = source.match(/export interface \w+Props[\s\S]*?\{([\s\S]*?)\n\}/);
  if (!interfaceMatch) return props;

  const body = interfaceMatch[1];
  const lines = body.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("{") || trimmed.startsWith("}")) continue;

    // Match: propName?: Type; or propName: Type;
    const match = trimmed.match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);
    if (!match) continue;

    const [, name, optional, type] = match;
    props.push({
      name,
      type: type.replace(/;$/, "").trim(),
      required: !optional,
      description: "",
    });
  }

  // Add implicit 'children' if component uses it in destructuring but not in interface
  const usesChildren = source.includes("children") && !props.some((p) => p.name === "children");
  if (usesChildren) {
    props.push({
      name: "children",
      type: "ReactNode",
      required: false,
      description: "Content rendered inside the component",
    });
  }

  return props;
}

function extractVariants(source: string): string[] | undefined {
  const match = source.match(/const variantClasses\s*=\s*\{([\s\S]*?)\}\s*as const/);
  if (!match) return undefined;

  const keys = [...match[1].matchAll(/^\s*["']?(\w+)["']?\s*:/gm)].map((m) => m[1]);
  return keys.length > 0 ? keys : undefined;
}

function extractSizes(source: string): string[] | undefined {
  const match = source.match(/const sizeClasses\s*=\s*\{([\s\S]*?)\}\s*as const/);
  if (!match) return undefined;

  const keys = [...match[1].matchAll(/^\s*["']?(\w+)["']?\s*:/gm)].map((m) => m[1]);
  return keys.length > 0 ? keys : undefined;
}

function extractDefaults(source: string): Record<string, string> {
  const defaults: Record<string, string> = {};

  // Match patterns like: variant = "default"
  const matches = source.matchAll(/(\w+)\s*=\s*"([^"]+)"/g);
  for (const match of matches) {
    defaults[match[1]] = `"${match[2]}"`;
  }

  return defaults;
}

function extractComponentName(source: string): string | null {
  // Match "export const X = React.forwardRef" or "const X = React.forwardRef"
  const match = source.match(/(?:export )?const (\w+)\s*=\s*React\.forwardRef/);
  if (match) return match[1];

  // Fallback: "export const X ="
  const fallback = source.match(/export const (\w+)\s*=/);
  return fallback ? fallback[1] : null;
}

function extractDescription(componentName: string, source: string, storiesSource: string): string {
  // Try JSDoc above the interface
  const jsdocMatch = source.match(/\/\*\*\s*\n\s*\*\s*(.+?)\n[\s\S]*?export interface/);
  if (jsdocMatch) return jsdocMatch[1].trim();

  // Derive from component name + pattern
  const descriptions: Record<string, string> = {
    Button: "Clickable action button with multiple visual variants and sizes.",
    Chip: "Toggle tag/pill with optional icon. Used for filters, feature toggles, tags.",
    Toggle: "On/off switch control. Supports controlled and uncontrolled modes.",
    ConfirmDialog: "Confirmation card with title, description, and Cancel/Confirm action buttons.",
  };

  return descriptions[componentName] || `${componentName} component.`;
}

function buildExample(name: string, variants?: string[], sizes?: string[], props?: PropInfo[]): string {
  const hasChildren = props?.some((p) => p.name === "children");
  const hasVariants = variants && variants.length > 1;
  const mainVariant = hasVariants ? variants[1] : undefined;

  // Components with children (Button, Chip)
  if (hasChildren) {
    const attrs: string[] = [];
    if (mainVariant) attrs.push(`variant="${mainVariant}"`);
    if (sizes && sizes.length > 1) attrs.push(`size="${sizes[2] || sizes[1]}"`);
    const attrStr = attrs.length ? " " + attrs.join(" ") : "";
    return `<${name}${attrStr}>Label</${name}>`;
  }

  // Components without children (Toggle, ConfirmDialog)
  const requiredProps = props?.filter((p) => p.required) || [];
  const attrs: string[] = [];

  for (const p of requiredProps) {
    if (p.type === "string") attrs.push(`${p.name}="Example"`);
    else if (p.type.includes("ReactNode")) attrs.push(`${p.name}={<>Content</>}`);
    else attrs.push(`${p.name}={value}`);
  }

  if (mainVariant) attrs.push(`variant="${mainVariant}"`);

  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  return requiredProps.length ? `<${name}${attrStr} />` : `<${name}${attrStr} />`;
}

function generateCatalog(): ComponentInfo[] {
  const folders = readdirSync(UI_DIR).filter((f) => {
    const path = join(UI_DIR, f);
    return statSync(path).isDirectory();
  });

  const catalog: ComponentInfo[] = [];

  for (const folder of folders.sort()) {
    const componentFile = join(UI_DIR, folder, `${folder}.tsx`);
    const storiesFile = join(UI_DIR, folder, `${folder}.stories.tsx`);

    let source: string;
    try {
      source = readFileSync(componentFile, "utf-8");
    } catch {
      continue;
    }

    let storiesSource = "";
    try {
      storiesSource = readFileSync(storiesFile, "utf-8");
    } catch {}

    const componentName = extractComponentName(source);
    if (!componentName) continue;

    const props = extractProps(source);
    const variants = extractVariants(source);
    const sizes = extractSizes(source);
    const defaults = extractDefaults(source);

    // Apply defaults to props
    for (const prop of props) {
      if (defaults[prop.name]) {
        prop.default = defaults[prop.name];
      }
    }

    // Add description from argTypes in stories if available
    for (const prop of props) {
      const descMatch = storiesSource.match(
        new RegExp(`${prop.name}[\\s\\S]*?description:\\s*"([^"]+)"`)
      );
      if (descMatch) {
        prop.description = descMatch[1];
      }
    }

    const description = extractDescription(componentName, source, storiesSource);

    const storybookSlug = folder.replace(/-/g, "");
    const storybookPath = `/docs/ui-${storybookSlug}--docs`;

    catalog.push({
      name: componentName,
      description,
      importName: componentName,
      props,
      ...(variants && { variants }),
      ...(sizes && { sizes }),
      example: buildExample(componentName, variants, sizes, props),
      storybookPath,
    });
  }

  return catalog;
}

// Generate and write
const catalog = generateCatalog();

const output = `// AUTO-GENERATED by scripts/generate-catalog.ts
// Do not edit manually. Run: node --experimental-strip-types scripts/generate-catalog.ts

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface ComponentInfo {
  name: string;
  description: string;
  importName: string;
  props: ComponentProp[];
  variants?: string[];
  sizes?: string[];
  example: string;
  storybookPath: string;
}

export const components: ComponentInfo[] = ${JSON.stringify(catalog, null, 2)};
`;

writeFileSync(OUTPUT, output);
console.log(`Generated catalog with ${catalog.length} components → mcp-server/catalog.ts`);
for (const c of catalog) {
  console.log(`  • ${c.name} (${c.props.length} props${c.variants ? `, ${c.variants.length} variants` : ""})`);
}
