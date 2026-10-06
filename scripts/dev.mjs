import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const types = {
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  svg: "image/svg+xml",
  jpg: "image/jpeg",
  ttf: "font/ttf",
};
createServer(async (req, res) => {
  let path = new URL(req.url, "http://localhost").pathname;
  if (path === "/") path = "/index.html";
  if (path === "/admin") path = "/admin.html";
  if (path === "/datenschutz") path = "/datenschutz.html";
  try {
    if (path.includes("..")) throw Error();
    const body = await readFile(new URL("../public" + path, import.meta.url));
    res.writeHead(200, {
      "Content-Type":
        types[path.split(".").pop()] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(4317, "127.0.0.1", () => console.log("http://127.0.0.1:4317"));
