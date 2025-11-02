#!/usr/bin/env node

/**
 * Proxy entry point that forwards to tools/preview.js so existing
 * commands (`node preview.js`) continue to work after reorganising
 * tooling into dedicated directories.
 */

try {
  require("./tools/preview.js");
} catch (error) {
  console.error("Failed to start preview server from tools/preview.js");
  console.error(error);
  process.exit(1);
}
