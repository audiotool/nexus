import { defineConfig } from "vite"

// `base` is overridable so the same build can target different Pages paths.
// In CI we set it to `/<repo>/` so the site works at
// `https://audiotool.github.io/<repo>/`. Locally it defaults to `/`.
const base = process.env.SHOWROOM_BASE_PATH ?? "/"

export default defineConfig({
  base,
  server: {
    port: 5173,
    host: "127.0.0.1",
  },
})
