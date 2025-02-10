import { defineConfig } from "@solidjs/start/config";
import happyCssModules from "vite-plugin-happy-css-modules";

export default defineConfig({
  vite: {
    plugins: [
      happyCssModules({ pattern: "src/**/*.module.{css,scss,less}" }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
    },
    build: {
      target: "esnext",
    },
  },
});
