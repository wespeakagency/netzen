import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Build del dashboard interno.
// `npm run build:dashboard`            → dist-dashboard/
// `npm run build:dashboard:standalone` → standalone-dashboard/dashboard.html
// `npm run entregable:dashboard`       → entregable/NETZEN-dashboard.html
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), ...(mode === "standalone" ? [viteSingleFile()] : [])],
  build:
    mode === "standalone"
      ? {
          outDir: "standalone-dashboard",
          assetsInlineLimit: 100000000,
          chunkSizeWarningLimit: 100000000,
          cssCodeSplit: false,
          rollupOptions: {
            input: "dashboard.html",
            output: { inlineDynamicImports: true }
          }
        }
      : {
          outDir: "dist-dashboard",
          chunkSizeWarningLimit: 1600,
          rollupOptions: { input: "dashboard.html" }
        }
}));
