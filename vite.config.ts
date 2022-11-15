import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    solidPlugin(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    transformMode: {
      web: [/\.spec\.tsx?$/],
    },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
