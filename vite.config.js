import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build`            → dist/ (para hosting)
// `npm run build:standalone` → standalone/netzen-web-standalone.html (un solo archivo, doble clic)
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [react(), ...(mode === "standalone" ? [viteSingleFile()] : [])],
  build:
    mode === "standalone"
      ? {
          outDir: "standalone",
          assetsInlineLimit: 100000000,
          chunkSizeWarningLimit: 100000000,
          cssCodeSplit: false,
          rollupOptions: { output: { inlineDynamicImports: true } }
        }
      : { outDir: "dist", chunkSizeWarningLimit: 1600 }
}));
