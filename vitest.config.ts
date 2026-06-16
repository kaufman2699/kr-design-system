import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(dirname, ".storybook"),
      storybookUrl: "http://localhost:6006",
    }),
  ],
  test: {
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
