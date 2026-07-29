import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const COPYRIGHT_BANNER = "/*! (c) Copyright 2026 Georg Stach */";

function copyrightBanner() {
  return {
    name: "copyright-banner",
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === "chunk") {
          file.code = `${COPYRIGHT_BANNER}\n${file.code}`;
        } else if (file.type === "asset" && file.fileName.endsWith(".css")) {
          file.source = `${COPYRIGHT_BANNER}\n${file.source}`;
        }
      }
    },
  };
}

export default defineConfig({
  base: "/bundeshaushalt/",
  plugins: [react(), copyrightBanner()],
});
