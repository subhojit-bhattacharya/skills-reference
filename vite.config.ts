import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the repository name when publishing to GitHub Pages
// at https://<username>.github.io/<repository>/
export default defineConfig({
  plugins: [react()],
  base: "./",
});
