import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const alias = {
  "@app": path.resolve(__dirname, "src/app"),
  "@entities": path.resolve(__dirname, "src/entities"),
  "@features": path.resolve(__dirname, "src/features"),
  "@widgets": path.resolve(__dirname, "src/widgets"),
  "@shared": path.resolve(__dirname, "src/shared"),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: { alias },
  test: {
    globals: true,
    environment: "node",
  },
});
