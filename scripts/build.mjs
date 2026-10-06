import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
};
const assets = {};
for (const name of await readdir(new URL("../public/", import.meta.url))) {
  const ext = name.slice(name.lastIndexOf("."));
  if (!types[ext]) continue;
  const buffer = await readFile(new URL("../public/" + name, import.meta.url));
  const binary = [".jpg", ".ttf"].includes(ext);
  assets["/" + name] = {
    type: types[ext],
    binary,
    body: buffer.toString(binary ? "base64" : "utf8"),
  };
}
await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../dist/worker.mjs", import.meta.url),
  `const ASSETS=${JSON.stringify(assets)};\n${await readFile(new URL("../src/worker.js", import.meta.url), "utf8")}`,
);
console.log(`Built ${Object.keys(assets).length} self-hosted assets.`);
