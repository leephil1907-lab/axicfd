import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server";
export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 3000,
        strictPort: true,
    },
    plugins: [
        react(),
        devServer({
            entry: "api/index.ts", // Hono entry point
            exclude: [/^(?!\/api).*/],
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@db": path.resolve(__dirname, "./db"),
            "@contracts": path.resolve(__dirname, "./contracts"),
        },
    },
    build: {
        outDir: path.resolve(__dirname, "dist"),
        emptyOutDir: true,
    },
    envDir: ".",
});
