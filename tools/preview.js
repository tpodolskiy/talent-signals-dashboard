#!/usr/bin/env node

const http = require("http");
const { extname, join, normalize, sep } = require("path");
const { createReadStream, existsSync, readFileSync, statSync } = require("fs");

const ROOT = process.cwd();
loadEnvFile();

const PORT = parseInt(process.env.PORT, 10) || 8000;
const BASE_PATH = process.env.BASE_PATH ?? "/talent-signals-dashboard";

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

  if (urlPath === "/api/chat") {
    if (req.method === "OPTIONS") {
      res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      });
      res.end();
      return;
    }
    if (req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }
    handleChatProxy(req, res);
    return;
  }

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

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString("utf8"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

async function handleChatProxy(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "OPENAI_API_KEY missing" }));
      return;
    }

    const rawBody = await readRequestBody(req);
    let prompt = "";
    try {
      const parsed = rawBody ? JSON.parse(rawBody) : {};
      prompt = typeof parsed.prompt === "string" ? parsed.prompt.trim() : "";
    } catch {
      prompt = "";
    }

    if (!prompt) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Prompt required" }));
      return;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 600,
        messages: [
          {
            role: "system",
            content:
              "You are Trend Copilot for the TalentSignals dashboard. Use concise, data-grounded answers and provide bullet takeaways when useful."
          },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Upstream error", details: errorText }));
      return;
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I wasn't able to generate a response just now. Try again in a moment.";

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    res.end(JSON.stringify({ reply }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Chat proxy failure", details: error.message }));
  }
}

function loadEnvFile() {
  try {
    const envPath = join(ROOT, ".env");
    if (!existsSync(envPath)) return;
    const contents = readFileSync(envPath, "utf8");
    contents.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...rest] = trimmed.split("=");
      if (!key) return;
      const value = rest.join("=");
      if (value && !process.env[key]) {
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.warn("Failed to load .env file", error);
  }
}
