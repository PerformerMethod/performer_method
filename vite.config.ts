import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const edge =
  "https://uovcicqaxqzziregyxxz.supabase.co/functions/v1";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/pm-api": {
        target: edge,
        changeOrigin: true,
        secure: true,
      },
      "/pm-recovery": {
        target: edge,
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
