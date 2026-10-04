#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IMAGE_DIR = path.join(ROOT, 'images');
const OUTPUT = path.join(ROOT, 'data', 'images.json');
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.bmp']);
const NUMERIC = /^[0-9]+$/;

function main() {
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
  const entries = fs.readdirSync(IMAGE_DIR, { withFileTypes: true }).filter(e => e.isFile());
  const valid = [];
  const warnings = [];
  const duplicates = new Map();

  for (const entry of entries) {
    const ext = path.extname(entry.name).toLowerCase();
    if (!ALLOWED.has(ext)) continue;
    const stem = path.basename(entry.name, ext);
    if (!NUMERIC.test(stem)) {
      warnings.push(`忽略非法文件名：${entry.name}（文件名必须为纯阿拉伯数字）`);
      continue;
    }
    const page = Number(stem);
    if (!Number.isSafeInteger(page) || page < 0) {
      warnings.push(`忽略超出安全整数范围的页码：${entry.name}`);
      continue;
    }
    valid.push({ page, name: entry.name, src: `./images/${encodeURIComponent(entry.name)}` });
    const arr = duplicates.get(page) || [];
    arr.push(entry.name);
    duplicates.set(page, arr);
  }

  for (const [page, names] of duplicates.entries()) {
    if (names.length > 1) {
      names.sort((a,b) => a.localeCompare(b, 'en'));
      warnings.push(`发现重复页码 ${page}：${names.join(', ')}。manifest 仅保留 ${names[0]}。`);
    }
  }

  const unique = [...new Map(valid.sort((a,b) => a.page-b.page || a.name.localeCompare(b.name, 'en')).map(x => [x.page, x])).values()];
  const payload = { version: 1, generatedAt: new Date().toISOString().slice(0,10), images: unique.map(({page,src}) => ({ page, src })) };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2) + '\n', 'utf8');

  console.log(`已生成 ${path.relative(ROOT, OUTPUT)}`);
  console.log(`有效图片：${unique.length}`);
  if (warnings.length) {
    console.warn('\n警告：');
    warnings.forEach(w => console.warn(`- ${w}`));
  }
}
main();
