import express from 'express';
import fs from 'fs/promises';
import fssync from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import crypto from 'crypto';

const app = express();
app.use(express.json({ limit: '8mb' }));

// 간단한 CORS (PoC 용도)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// const FIGMA_PAT = 'figd_kuHe8CYDNouxxjzijblstXsYxLNwU-0nGl7PXOoL';
// if (!FIGMA_PAT) {
//   console.error('Missing FIGMA_PAT env var');
//   process.exit(1);
// }

/* -----------------------------
 * Helpers: safe output
 * ----------------------------- */
function safeJoin(baseDirAbs, fileName) {
  const base = path.resolve(baseDirAbs);
  const target = path.resolve(baseDirAbs, fileName);
  if (!target.startsWith(base + path.sep) && target !== base)
    throw new Error('Invalid output path');
  return target;
}

function assertVueFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') throw new Error('fileName required');
  if (!fileName.endsWith('.vue')) throw new Error('fileName must end with .vue');
}

/* -----------------------------
 * Parse Figma URL
 * ----------------------------- */
function parseFigmaUrl(figmaUrl) {
  const u = new URL(figmaUrl);
  if (!['www.figma.com', 'figma.com'].includes(u.hostname))
    throw new Error('Only figma.com URLs allowed');
  const parts = u.pathname.split('/').filter(Boolean);
  const idx = parts.findIndex(p => ['file', 'design'].includes(p));
  if (idx === -1 || !parts[idx + 1]) throw new Error('Cannot parse fileKey');
  const fileKey = parts[idx + 1];
  const nodeId = u.searchParams.get('node-id');
  if (!nodeId) throw new Error('Missing node-id. Use Copy link to selection URL.');
  // Optional conversion: "1-7" -> "1:7"
  const nodeIdColon = nodeId ? nodeId.replace(/-/g, ':') : null;
  console.log('parseFigmaUrl', { fileKey, nodeId, nodeIdColon, url: u.toString() });
  return { fileKey, nodeId, nodeIdColon, url: u.toString() };
}

/* -----------------------------
 * Figma REST helpers
 * ----------------------------- */
async function figmaFetchJson(url) {
  const r = await fetch(url, { headers: { 'X-Figma-Token': FIGMA_PAT } });
  if (!r.ok) throw new Error(`Figma API ${r.status}: ${await r.text()}`);
  return r.json();
}
function nodesUrl({ fileKey, ids, depth = 10, geometryPaths = true }) {
  const url = new URL(`https://api.figma.com/v1/files/${encodeURIComponent(fileKey)}/nodes`);
  url.searchParams.set('ids', ids.join(','));
  url.searchParams.set('depth', String(depth));
  if (geometryPaths) url.searchParams.set('geometry', 'paths');
  return url.toString();
}
function imagesUrl({ fileKey, ids, format = 'png', scale = 1 }) {
  const url = new URL(`https://api.figma.com/v1/images/${encodeURIComponent(fileKey)}`);
  url.searchParams.set('ids', ids.join(','));
  url.searchParams.set('format', format);
  url.searchParams.set('scale', String(scale));
  return url.toString();
}

async function fetchNodes({ fileKey, ids, depth, geometryPaths }) {
  const json = await figmaFetchJson(nodesUrl({ fileKey, ids, depth, geometryPaths }));
  // console.log('json', json);
  for (const id of ids) {
    const entry = json?.nodes?.[id];
    if (!entry || !entry.document) {
      console.log(`Node missing or null: ${id}. Check permissions/node-id.`);
    }
  }

  console.log(fileKey, ids, depth, geometryPaths);
  return json;
}
async function fetchImagesMap({ fileKey, ids }) {
  if (!ids.length) return {};
  const json = await figmaFetchJson(imagesUrl({ fileKey, ids, format: 'png', scale: 1 }));
  return json?.images ?? {};
}
async function downloadToFile(url, outPath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download failed ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, buf);
}

/* -----------------------------
 * Spec normalization (high signal)
 * ----------------------------- */
function boundsOf(node) {
  const b = node.absoluteBoundingBox || node.absoluteRenderBounds;
  if (!b) return undefined;
  return { x: b.x, y: b.y, w: b.width, h: b.height };
}

function relBounds(childAbs, parentAbs) {
  if (!childAbs || !parentAbs) return undefined;
  return {
    x: childAbs.x - parentAbs.x,
    y: childAbs.y - parentAbs.y,
    w: childAbs.w,
    h: childAbs.h,
  };
}

function normalizeColor(c) {
  if (!c) return undefined;
  return { r: c.r, g: c.g, b: c.b, a: c.a ?? 1 };
}

function normalizeCornerRadius(node) {
  // Figma: cornerRadius or rectangleCornerRadii (per-corner)
  if (typeof node.cornerRadius === 'number') {
    return {
      tl: node.cornerRadius,
      tr: node.cornerRadius,
      br: node.cornerRadius,
      bl: node.cornerRadius,
    };
  }
  const rr = node.rectangleCornerRadii;
  if (Array.isArray(rr) && rr.length === 4) {
    return { tl: rr[0], tr: rr[1], br: rr[2], bl: rr[3] };
  }
  return undefined;
}

function normalizePaints(paints) {
  if (!Array.isArray(paints)) return undefined;
  return paints.filter(Boolean).map(p => {
    const out = {
      type: p.type,
      visible: p.visible !== false,
      opacity: p.opacity,
      blendMode: p.blendMode,
    };
    if (p.type === 'SOLID') out.color = normalizeColor(p.color);
    if (p.type?.startsWith('GRADIENT')) {
      out.gradientStops = p.gradientStops?.map(s => ({
        position: s.position,
        color: normalizeColor(s.color),
      }));
      out.gradientTransform = p.gradientTransform;
    }
    if (p.type === 'IMAGE') {
      out.scaleMode = p.scaleMode;
      out.imageTransform = p.imageTransform;
      out.scalingFactor = p.scalingFactor;
    }
    return prune(out);
  });
}

function normalizeEffects(effects) {
  if (!Array.isArray(effects)) return undefined;
  return effects.filter(Boolean).map(e =>
    prune({
      type: e.type,
      visible: e.visible !== false,
      radius: e.radius,
      spread: e.spread,
      offset: e.offset,
      color: e.color ? normalizeColor(e.color) : undefined,
      blendMode: e.blendMode,
    }),
  );
}

function normalizeLayout(node) {
  const keys = [
    'layoutMode',
    'primaryAxisAlignItems',
    'counterAxisAlignItems',
    'primaryAxisSizingMode',
    'counterAxisSizingMode',
    'itemSpacing',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'layoutWrap',
    'counterAxisSpacing',
  ];
  const out = {};
  for (const k of keys) if (node[k] !== undefined) out[k] = node[k];

  const sizeKeys = [
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'layoutSizingHorizontal',
    'layoutSizingVertical',
  ];
  for (const k of sizeKeys) if (node[k] !== undefined) out[k] = node[k];

  return Object.keys(out).length ? out : undefined;
}

function normalizeTextStyle(style) {
  if (!style) return undefined;
  // Normalize to CSS-friendly fields
  const out = {
    fontFamily: style.fontFamily,
    fontPostScriptName: style.fontPostScriptName,
    fontWeight: style.fontWeight,
    fontSizePx: style.fontSize,
    // Figma might provide px/percent variants
    lineHeightPx: style.lineHeightPx,
    lineHeightPercent: style.lineHeightPercent,
    letterSpacing: style.letterSpacing, // keep raw; Codex can map to px/%
    textAlignHorizontal: style.textAlignHorizontal,
    textAlignVertical: style.textAlignVertical,
    textCase: style.textCase,
    textDecoration: style.textDecoration,
  };
  return prune(out);
}

function prune(obj) {
  for (const k of Object.keys(obj)) if (obj[k] === undefined || obj[k] === null) delete obj[k];
  return obj;
}

/* -----------------------------
 * Improved children picking:
 * - preserve zIndex (original order) but cap after scoring
 * ----------------------------- */
function scoreChild(node) {
  const b = boundsOf(node);
  const area = b ? b.w * b.h : 0;
  const textBoost = node.type === 'TEXT' ? 1e12 : 0;
  const visibleBoost = node.visible === false ? -1e15 : 0;
  const effectBoost = Array.isArray(node.effects) && node.effects.length ? 1e9 : 0;
  const strokeBoost = node.strokes?.length ? 1e8 : 0;
  return visibleBoost + textBoost + effectBoost + strokeBoost + area;
}

function pickNodeSpec(node, opts, depth = 0, parentAbsBounds = null) {
  const {
    mode = 'balanced',
    maxDepth = mode === 'high' ? 12 : 10,
    maxChildrenPerNode = mode === 'high' ? 90 : 40,
  } = opts || {};

  const abs = boundsOf(node);
  const rel = parentAbsBounds ? relBounds(abs, parentAbsBounds) : abs; // root: absolute, child: relative

  const spec = prune({
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== false,

    // Absolute for root, relative for children (layout reconstruction ↑)
    bounds: rel,
    absBounds: mode === 'high' ? abs : undefined,

    rotation: node.rotation,
    constraints: node.constraints,
    layout: normalizeLayout(node),

    opacity: node.opacity,
    blendMode: node.blendMode,

    cornerRadius: normalizeCornerRadius(node),

    strokeWeight: node.strokeWeight,
    strokeAlign: node.strokeAlign, // 고급 테두리 정확도
    strokeDashes: node.strokeDashes, // dashed
    strokes: normalizePaints(node.strokes),
    fills: normalizePaints(node.fills),
    effects: normalizeEffects(node.effects),

    clipsContent: node.clipsContent,
  });

  if (node.type === 'TEXT') {
    spec.text = prune({
      characters: node.characters,
      style: normalizeTextStyle(node.style),
      fills: normalizePaints(node.fills),
      textAutoResize: node.textAutoResize,
      styleOverrideTable: mode === 'high' ? node.styleOverrideTable : undefined,
      characterStyleOverrides: mode === 'high' ? node.characterStyleOverrides : undefined,
    });
  }

  if (mode === 'high') {
    spec.stylesRef = node.styles;
    spec.componentId = node.componentId;
    spec.componentProperties = node.componentProperties;
    spec.variantProperties = node.variantProperties;
    spec.reactions = node.reactions;
  }

  if (depth < maxDepth && Array.isArray(node.children) && node.children.length) {
    // score then pick top N, but keep original order (z-order) for rendering
    const scored = node.children.map((c, idx) => ({ c, idx, s: scoreChild(c) }));
    scored.sort((a, b) => b.s - a.s || a.idx - b.idx);
    const picked = scored.slice(0, maxChildrenPerNode).map(x => x.c);

    // restore original order for z-order preservation
    picked.sort((a, b) => node.children.indexOf(a) - node.children.indexOf(b));

    spec.children = picked.map(ch => pickNodeSpec(ch, opts, depth + 1, abs));
    if (node.children.length > picked.length)
      spec.childrenTruncated = node.children.length - picked.length;
  }

  return spec;
}

/* -----------------------------
 * Assets:
 * - export image nodes
 * - download to local folder and provide relative path
 * ----------------------------- */
function collectImageNodeIds(spec, out = new Set()) {
  if (!spec) return out;
  const hasImageFill =
    Array.isArray(spec.fills) && spec.fills.some(p => p.type === 'IMAGE' && p.visible !== false);
  if (hasImageFill) out.add(spec.id);
  if (Array.isArray(spec.children)) for (const c of spec.children) collectImageNodeIds(c, out);
  return out;
}

function toSafeAssetFileName(nodeId) {
  return nodeId.replace(/[^a-zA-Z0-9_-]/g, '_') + '.png';
}

async function buildLocalAssets({
  fileKey,
  imageNodeIds,
  outAssetsDirAbs,
  publicPrefix = './assets',
}) {
  if (!imageNodeIds.length) return { assetsMap: {}, downloaded: 0 };

  // 1) get export urls
  const urlMap = await fetchImagesMap({ fileKey, ids: imageNodeIds }); // :contentReference[oaicite:3]{index=3}

  // 2) download
  let downloaded = 0;
  const assetsMap = {};

  await fs.mkdir(outAssetsDirAbs, { recursive: true });

  for (const id of imageNodeIds) {
    const u = urlMap[id];
    if (!u) continue;

    const fileName = toSafeAssetFileName(id);
    const absPath = path.join(outAssetsDirAbs, fileName);
    await downloadToFile(u, absPath);

    assetsMap[id] = `${publicPrefix}/${fileName}`; // Vue에서 사용할 상대경로
    downloaded += 1;
  }

  return { assetsMap, downloaded };
}

/* -----------------------------
 * High-detail node auto selection (server-side)
 * - pick nodes likely to need more precision:
 *   TEXT with overrides, many effects, strokes, small vector-like groups
 * ----------------------------- */
function collectHighDetailCandidates(rawNode, out = new Set()) {
  if (!rawNode) return out;

  const isText = rawNode.type === 'TEXT';
  const hasOverrides = !!(rawNode.characterStyleOverrides?.length || rawNode.styleOverrideTable);
  const hasEffects =
    Array.isArray(rawNode.effects) && rawNode.effects.some(e => e.visible !== false);
  const hasStrokes = Array.isArray(rawNode.strokes) && rawNode.strokes.length;
  const manyChildren = Array.isArray(rawNode.children) && rawNode.children.length >= 25;

  if (
    (isText && (hasOverrides || rawNode.textAutoResize)) ||
    hasEffects ||
    hasStrokes ||
    manyChildren
  ) {
    out.add(rawNode.id);
  }

  if (Array.isArray(rawNode.children)) {
    for (const c of rawNode.children) collectHighDetailCandidates(c, out);
  }
  return out;
}

/* -----------------------------
 * Codex runner
 * ----------------------------- */
function runCodexExec({ cwd, prompt }) {
  return new Promise((resolve, reject) => {
    const isWin = process.platform === 'win32';
    const CODEX_BIN = process.env.CODEX_BIN || 'codex';
    const args = [
      'exec',
      '--sandbox',
      'danger-full-access',
      '--skip-git-repo-check',
      '-', // stdin에서 프롬프트 읽기
    ];
    const TARGET_DIR = process.env.CODEX_TARGET_DIR || '../preview';

    const child = spawn(CODEX_BIN, args, {
      cwd: TARGET_DIR,
      shell: isWin, // Windows에서 codex.cmd 대응
      env: process.env,
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', d => (stdout += d.toString()));
    child.stderr.on('data', d => (stderr += d.toString()));

    // stdin으로 프롬프트 전달
    child.stdin.write(prompt, 'utf8');
    child.stdin.end();

    child.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`codex failed (code=${code})\n${stderr || stdout}`));
    });
  });
}

/* -----------------------------
 * (D) 옵션 B: 임시 Vite로 .vue 렌더 → 스크린샷(PNG)
 * ----------------------------- */
function randPort() {
  // 30000~39999
  return 30000 + (crypto.randomInt ? crypto.randomInt(10000) : Math.floor(Math.random() * 10000));
}

async function writeTempViteProject({ dir, vueSfcContent }) {
  await fs.mkdir(path.join(dir, 'src'), { recursive: true });

  // package.json은 이미 서버 프로젝트에 설치된 vite/vue/plugin-vue를 사용하므로,
  // 여기서는 "local node_modules"를 공유하는 방식(= 실행 시 vite bin을 서버 프로젝트에서 호출)으로 구현합니다.
  await fs.writeFile(
    path.join(dir, 'index.html'),
    `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/></head><body><div id="app"></div><script type="module" src="/src/main.js"></script></body></html>`,
    'utf-8',
  );

  await fs.writeFile(
    path.join(dir, 'vite.config.js'),
    `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
  server: { host: "127.0.0.1" }
});`,
    'utf-8',
  );

  await fs.writeFile(
    path.join(dir, 'src', 'main.js'),
    `import { createApp } from "vue";
import App from "./App.vue";
createApp(App).mount("#app");`,
    'utf-8',
  );

  await fs.writeFile(path.join(dir, 'src', 'App.vue'), vueSfcContent, 'utf-8');
}

async function startViteDevServer({ projectDir, port }) {
  // 서버 프로젝트의 node_modules/vite를 사용
  const viteBin = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
  if (!fssync.existsSync(viteBin))
    throw new Error('vite not found in server project. Run npm i vite');

  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [viteBin, 'dev', '--port', String(port), '--strictPort'],
      {
        cwd: projectDir,
        env: { ...process.env },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let settled = false;
    const onData = d => {
      const s = d.toString();
      // Vite ready line contains "Local:" usually
      if (!settled && (s.includes('Local:') || s.includes('127.0.0.1'))) {
        settled = true;
        resolve(child);
      }
    };

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);

    child.on('error', e => !settled && reject(e));
    child.on('close', code => !settled && reject(new Error(`vite exited early: ${code}`)));
  });
}

async function renderVueToPng({ vueFileAbs, outPngAbs, viewport }) {
  const vueSfc = await fs.readFile(vueFileAbs, 'utf-8');
  const projectDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vite-render-'));
  await writeTempViteProject({ dir: projectDir, vueSfcContent: vueSfc });

  const port = randPort();
  const viteProc = await startViteDevServer({ projectDir, port });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    // 폰트/레이아웃 안정화 대기(필요 시 증가)
    await page.waitForTimeout(300);
    await page.screenshot({ path: outPngAbs, fullPage: true });
  } finally {
    await browser.close();
    viteProc.kill('SIGTERM');
  }
}

/* -----------------------------
 * (E) 옵션 B: Figma 프레임 PNG 다운로드(레퍼런스)
 * ----------------------------- */
async function downloadFigmaFramePng({ fileKey, nodeId, outPngAbs }) {
  const map = await fetchImagesMap({ fileKey, ids: [nodeId] });
  const url = map[nodeId];
  if (!url) throw new Error('Figma image export URL missing for nodeId');
  await downloadToFile(url, outPngAbs);
}

/* -----------------------------
 * (F) 옵션 B: pixel diff + bbox 추출
 * ----------------------------- */
function readPng(filePath) {
  return new Promise((resolve, reject) => {
    fssync
      .createReadStream(filePath)
      .pipe(new PNG())
      .on('parsed', function () {
        resolve(this);
      })
      .on('error', reject);
  });
}

function computeDiffBBox(diffPng, thresholdAlpha = 1) {
  // diffPng.data: RGBA, diff pixels are non-zero; use alpha or any channel
  const { width, height, data } = diffPng;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const a = data[i + 3];
      if (a >= thresholdAlpha) {
        count++;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (count === 0) return { hasDiff: false, bbox: null, diffPixels: 0 };
  return {
    hasDiff: true,
    bbox: { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 },
    diffPixels: count,
  };
}

async function pixelDiff({ actualPngAbs, expectedPngAbs, outDiffPngAbs }) {
  const img1 = await readPng(expectedPngAbs);
  const img2 = await readPng(actualPngAbs);

  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);

  // crop to common size for stable diff
  const a = new PNG({ width, height });
  const b = new PNG({ width, height });
  PNG.bitblt(img1, a, 0, 0, width, height, 0, 0);
  PNG.bitblt(img2, b, 0, 0, width, height, 0, 0);

  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, {
    threshold: 0.12, // 민감도 (낮을수록 엄격)
    includeAA: true,
  });

  await fs.mkdir(path.dirname(outDiffPngAbs), { recursive: true });
  await new Promise((resolve, reject) => {
    diff
      .pack()
      .pipe(fssync.createWriteStream(outDiffPngAbs))
      .on('finish', resolve)
      .on('error', reject);
  });

  const ratio = mismatched / (width * height);
  const bboxInfo = computeDiffBBox(diff, 1);
  return { width, height, mismatched, ratio, bboxInfo };
}

/* -----------------------------
 * (G) 3-pass 프롬프트( diff 피드백 주입 )
 * ----------------------------- */
function promptPass3({ outFileAbs, figmaUrl, baseSpec, highDetailMap, assetsMap, diff }) {
  const payload = { figmaUrl, baseSpec, highDetailMap, assetsMap, diff };

  return `
You are refining the Vue SFC using pixel-diff feedback.
Goal: be as pixel-close as possible., match the design as accurately as possible.

Hard rules:
- You are a frontend senior developer.
- Create/overwrite ONLY this file: ${outFileAbs}
- Please write only facts
- Think and write in steps.
- When writing code, think about preventing memory leaks and improving performance.

Implementation rules:
- Write it using Typescript and Vue 3.4 or later.
- vue, and use <script setup lang="ts"> with composition API.
- Using inline arrow functions when calling event methods from inside a template
- If you requested it as a composable function, create a use hook and write it as an import.
- Please write with vue-router4 or later version in mind.
- Please use pinia3.x version to create your statuses.
- Please also implement identifiable screen function elements in script code.
- Respect bounds/spacing/typography/colors from spec.
- If assetsMap has image URLs for node ids, use them with <img> and size/position per spec.
- Please configure the form element to fit Vuejs

Accuracy rules:
- Use bounds (relative to parent) to position children when auto-layout is absent.
- If a parent uses auto-layout (layoutMode), use flex/grid with padding/gap/alignment.
- Preserve z-order: later siblings should render above earlier siblings.
- For cornerRadius, use per-corner border-radius if provided.
- Implement shadows/effects as CSS box-shadow where possible.
- Implement strokes as border; if strokeAlign is not CENTER, approximate with outline/box-shadow/border and note it in a short comment.

Data rules:
- Use text exactly as spec.text.characters.
- If assetsMap has an entry for a node id, render <img> with that src and size/position per bounds.

Diff feedback:
- mismatchRatio: ${diff.ratio}
- bbox (x,y,w,h): ${diff.bboxInfo?.bbox ? JSON.stringify(diff.bboxInfo.bbox) : 'null'}
- Focus primarily on the bbox region, but do not break the rest.

Instructions:
- Keep overall structure; adjust CSS/layout to reduce mismatch.
- Prefer small changes: padding/gap/line-height/letter-spacing/border-radius/box-shadow/positioning.
- Preserve text content exactly.
- Preserve z-order (DOM order) as much as possible.

Context JSON:
${JSON.stringify(payload)}
`.trim();
}

/* -----------------------------
 * API: 3-pass (2-pass + render diff + pass3)
 * ----------------------------- */
app.post('/api/generate-vue-3pass', async (req, res) => {
  try {
    // const { figmaUrl, outputDir, fileName, mode = 'balanced' } = req.body ?? {};
    const resBody = req.body ?? {};
    let figmaUrl = resBody.figmaUrl;
    let outputDir = resBody.outputDir;
    let fileName = resBody.fileName;
    const mode = resBody.mode || 'balanced';
    if (!resBody.figmaUrl || !resBody.outputDir || !resBody.fileName) {
      // return res.status(400).json({ error: "figmaUrl, outputDir, fileName are required." });

      figmaUrl =
        'https://www.figma.com/design/XBZ6fYrcVYxRBxvKZMTpvC/test?node-id=1-2457&t=BujME43dpRksF0bX-0';
      outputDir = '../preview/src/views';
      fileName = 'DashboardDiff22.vue';
    }
    console.log(figmaUrl);

    const { fileKey, nodeId, nodeIdColon, url } = parseFigmaUrl(figmaUrl);

    const outDirAbs = path.resolve(outputDir);
    // await fs.mkdir(outDirAbs, { recursive: true });
    const outFileAbs = safeJoin(outDirAbs, fileName);

    // (1) base fetch/spec
    const baseJson = await fetchNodes({ fileKey, ids: [nodeId], depth: 10, geometryPaths: true });
    const baseRoot = baseJson.nodes[nodeIdColon].document;
    const baseSpec = pickNodeSpec(baseRoot, { mode: 'balanced' });

    // assetsMap (이미지 다운로드 로직이 있다면 그대로 사용)
    const imageNodeIds = Array.from(collectImageNodeIds(baseSpec));
    // 여기서는 URL 맵만 사용. (당신의 "로컬 다운로드 assets" 구현이 있다면 assetsMap을 로컬 경로로 바꾸세요.)
    const assetsMap = await fetchImagesMap({ fileKey, ids: imageNodeIds });

    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-figma-'));

    // (2) PASS1 (LLM picks)
    const pass1 = await runCodexExec({
      cwd: workspaceDir,
      prompt: `Print exactly one line: HIGH_DETAIL_NODE_IDS: <comma-separated ids or empty>\n\nThen generate a SINGLE Vue SFC at ${outFileAbs}.

You are generating a SINGLE Vue SFC (.vue) from a normalized Figma spec.
Goal: be as pixel-close as possible., match the design as accurately as possible.

Hard rules:
- You are a frontend senior developer.
- Create/overwrite ONLY this file: ${outFileAbs}
- Please write only facts
- Think and write in steps.
- When writing code, think about preventing memory leaks and improving performance.

Implementation rules:
- Write it using Typescript and Vue 3.4 or later.
- vue, and use <script setup lang="ts"> with composition API.
- Using inline arrow functions when calling event methods from inside a template
- If you requested it as a composable function, create a use hook and write it as an import.
- Please write with vue-router4 or later version in mind.
- Please use pinia3.x version to create your statuses.
- Please also implement identifiable screen function elements in script code.
- Respect bounds/spacing/typography/colors from spec.
- If assetsMap has image URLs for node ids, use them with <img> and size/position per spec.
- Please configure the form element to fit Vuejs

Accuracy rules:
- Use bounds (relative to parent) to position children when auto-layout is absent.
- If a parent uses auto-layout (layoutMode), use flex/grid with padding/gap/alignment.
- Preserve z-order: later siblings should render above earlier siblings.
- For cornerRadius, use per-corner border-radius if provided.
- Implement shadows/effects as CSS box-shadow where possible.
- Implement strokes as border; if strokeAlign is not CENTER, approximate with outline/box-shadow/border and note it in a short comment.

Data rules:
- Use text exactly as spec.text.characters.
- If assetsMap has an entry for a node id, render <img> with that src and size/position per bounds.

\nContext:\n${JSON.stringify({ figmaUrl: url, spec: baseSpec, assetsMap })}`,
      // prompt: promptOnePass({ outFileAbs, figmaUrl: url, baseSpec, assetsMap }),
    });

    const m = pass1.stdout.match(/HIGH_DETAIL_NODE_IDS:\s*(.*)/);
    const llmIds = (m?.[1] ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // (3) 서버가 고난도 후보도 추가
    const autoIds = Array.from(collectHighDetailCandidates(baseRoot));
    const highIds = Array.from(new Set([...llmIds, ...autoIds])).slice(0, 50);

    // (4) PASS2 (high map)
    const highDetailMap = {};
    if (highIds.length) {
      const hiJson = await fetchNodes({ fileKey, ids: highIds, depth: 12, geometryPaths: true });
      for (const id of highIds) {
        const doc = hiJson.nodes[id]?.document;
        if (!doc) continue;
        highDetailMap[id] = pickNodeSpec(doc, { mode: 'high' });
      }
    }

    // PASS2 generate refined
    await runCodexExec({
      cwd: workspaceDir,
      prompt: `Generate/overwrite ONLY ${outFileAbs} as Vue SFC.\nUse baseSpec + highDetailMap.\nContext:\n${JSON.stringify(
        { figmaUrl: url, baseSpec, highDetailMap, assetsMap },
      )}`,
      // prompt: promptPass2({ outFileAbs, figmaUrl: url, baseSpec, highDetailMap, assetsMap }),
    });

    // (5) Render & diff
    const refPngAbs = path.join(workspaceDir, 'figma-ref.png');
    const actPngAbs = path.join(workspaceDir, 'render-actual.png');
    const diffPngAbs = path.join(workspaceDir, 'diff.png');

    await downloadFigmaFramePng({ fileKey, nodeId, outPngAbs: refPngAbs });

    // viewport: figma ref 크기에 맞추기 위해 먼저 ref png를 읽어서 width/height 사용
    const refImg = await readPng(refPngAbs);
    const viewport = { width: Math.min(refImg.width, 1440), height: Math.min(refImg.height, 900) }; // 상한선
    await renderVueToPng({ vueFileAbs: outFileAbs, outPngAbs: actPngAbs, viewport });

    const diff = await pixelDiff({
      actualPngAbs: actPngAbs,
      expectedPngAbs: refPngAbs,
      outDiffPngAbs: diffPngAbs,
    });

    // (6) PASS3 (diff feedback 기반 보정)
    // mismatchRatio가 충분히 낮으면 PASS3 스킵 가능 (여기서는 무조건 실행 or 임계값 적용)
    const THRESHOLD = 0.03; // 3% 이상이면 보정
    let pass3Ran = false;

    if (diff.ratio >= THRESHOLD && diff.bboxInfo?.hasDiff) {
      await runCodexExec({
        cwd: workspaceDir,
        prompt: promptPass3({
          outFileAbs,
          figmaUrl: url,
          baseSpec,
          highDetailMap,
          assetsMap,
          diff,
        }),
      });
      pass3Ran = true;
    }

    const vue = await fs.readFile(outFileAbs, 'utf-8');

    res.json({
      ok: true,
      outFile: outFileAbs,
      highDetailIds: highIds,
      diff: {
        width: diff.width,
        height: diff.height,
        mismatched: diff.mismatched,
        ratio: diff.ratio,
        bbox: diff.bboxInfo?.bbox ?? null,
      },
      pass3Ran,
      debugArtifacts: {
        figmaRefPng: refPngAbs,
        renderedPng: actPngAbs,
        diffPng: diffPngAbs,
      },
      preview: vue.slice(0, 1200),
    });
    // res.json({
    //   ok: true,
    // });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
