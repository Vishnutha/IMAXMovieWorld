import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import axios from 'axios'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host : true,
    port : 5173,
    proxy: {
      "/api": {
        target: "https://d277-103-174-162-76.ngrok.io",
        changeOrigin: true,
        secure: false,
      }
    },
  },
});
