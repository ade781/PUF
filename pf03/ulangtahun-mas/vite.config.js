// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // opsional: matikan overlay error kalau kamu bosan diteriaki layar merah
  // server: { hmr: { overlay: false } }
});
