import { serve } from "@hono/node-server";
import { app } from "./index.js";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";

const PORT = 3000;

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use("*", serveStatic({ root: "./dist" }));
  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const indexPath = path.resolve(process.cwd(), "dist", "index.html");
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, "utf-8");
      return c.html(content);
    }
    return c.json({ error: "Not Found" }, 404);
  });
}

console.log(`Server is running on port ${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
  hostname: "0.0.0.0"
});
