import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vike(), react(), tailwindcss()],
  // Hatanın çözümü tam olarak burası:
  preview: {
    allowedHosts: ["timerightproduction.org", "www.timerightproduction.org"],
    host: true,
    port: 3000,
  },
  // Bazen SSR tarafında da gerekebilir:
  server: {
    allowedHosts: ["timerightproduction.org"],
  },
});
