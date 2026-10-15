import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: {
    // Explicit path so styles build no matter which directory the dev server is started from.
    tailwindcss: { config: join(root, "tailwind.config.ts") },
    autoprefixer: {},
  },
};

export default config;
