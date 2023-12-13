import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host : true,
    port : 5173,
    proxy: {
      "/api": {
        target: "https://582e-103-174-162-76.ngrok.io",
        changeOrigin: true,
        secure: false,
      }
    },
  },
});
