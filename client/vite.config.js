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
        target: "http://localhost:5000/",
        changeOrigin: true,
        secure: false,
      }
    },
  },
});
