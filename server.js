import { extname } from "@std/path";

import { getDb, getDbPath } from "./src/db.js";
import { handleApi } from "./src/routes.js";

const PORT = 8000;

const ROOT = new URL(".", import.meta.url);

getDb();

console.log("DB ready at:", getDbPath());

console.log(`Listening on http://localhost:${PORT}/`);

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/api/")) {
    return handleApi(req, pathname);
  }

  return serveStatic(pathname);
});

async function serveStatic(pathname) {
  let resolvedPath = pathname;

  if (resolvedPath === "/") {
    // 302 Found: temporary redirect — browser follows this automatically and loads the dashboard
    return Response.redirect("http://localhost:8000/app/index.html", 302);
  }

  if (resolvedPath.includes("..")) {
    return new Response("Bad request", { status: 400 });
  }

  const fileUrl = new URL("." + resolvedPath, ROOT);

  try {
    const data = await Deno.readFile(fileUrl);
    return new Response(data, {
      headers: { "content-type": getContentType(resolvedPath) },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

function getContentType(pathname) {
  const extension = extname(pathname).toLowerCase();

  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
  };

  return types[extension] || "application/octet-stream";
}
