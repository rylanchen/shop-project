import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 这里没搞花里胡哨的配置，够用就好。遇到实际问题再说。
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
});
