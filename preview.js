#!/usr/bin/env node

const http = require("http");
const { extname, join, normalize, sep } = require("path");
const { createReadStream, existsSync, statSync } = require("fs");

const PORT = parseInt(process.env.PORT, 10) || 8000;
const BASE_PATH = process.env.BASE_PATH ?? "/talent-signals-dashboard";
const ROOT = process.cwd();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".csv": "text/csv; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf"
};

const DEFAULT_FILES = ["index.html", "roles/index.html", "insights/index.html"];

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (BASE_PATH && urlPath.startsWith(BASE_PATH)) {
    urlPath = urlPath.slice(BASE_PATH.length) || "/";
  }
  if (!urlPath.startsWith("/")) urlPath = `/${urlPath}`;

  let filePath = normalize(join(ROOT, `.${urlPath}`));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const tryServe = (path) => {
    if (!existsSync(path) || statSync(path).isDirectory()) return false;
    const ext = extname(path) || ".html";
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    createReadStream(path).pipe(res);
    return true;
  };

  const tryFallbacks = () => {
    for (const fallback of DEFAULT_FILES) {
      const fallbackPath = join(ROOT, fallback);
      if (existsSync(fallbackPath)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        createReadStream(fallbackPath).pipe(res);
        return true;
      }
    }
    return false;
  };

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    const indexPath = join(filePath, "index.html");
    if (tryServe(indexPath)) return;
  }

  if (tryServe(filePath)) return;

  const htmlCandidate = filePath.endsWith(sep)
    ? join(filePath, "index.html")
    : `${filePath}${extname(filePath) ? "" : ".html"}`;

  if (tryServe(htmlCandidate)) return;

  if (tryFallbacks()) return;

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
});
