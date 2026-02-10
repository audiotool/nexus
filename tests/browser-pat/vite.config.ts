import { defineConfig } from "vite"
export default defineConfig({
  define: {
    "import.meta.env.AT_PAT": JSON.stringify(process.env.AT_PAT),
  },
})
