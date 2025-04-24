import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { setupServer } from "msw/node";
import { handlers } from "./test/mocks/handlers";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js",
  },
});
