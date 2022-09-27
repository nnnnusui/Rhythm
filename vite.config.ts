import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solidPlugin(),
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
