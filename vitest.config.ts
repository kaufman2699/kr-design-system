import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: [path.join(dirname, ".storybook/vitest.setup.ts")],
    coverage: {
      provider: "v8",
      include: ["src/components/**/*.tsx"],
      exclude: ["**/*.stories.tsx", "**/*.test.tsx"],
      reporter: ["text", "json", "html"],
    },
  },
});
