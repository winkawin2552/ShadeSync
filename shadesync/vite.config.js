// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: "0.0.0.0",
//     allowedHosts: true, // <--- ADD THIS LINE
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      // 1. Look for requests starting with /api
      "/api": {
        target: "http://127.0.0.1:8000", // 2. Send them to Python Backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""), // 3. Remove "/api" before sending to Python
      },
    },
  },
});
