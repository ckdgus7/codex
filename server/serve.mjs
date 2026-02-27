import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

const app = express();
app.use(express.json({ limit: '4mb' }));

// 간단한 CORS (PoC 용도)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* -----------------------------
 * Security: safe path join
 * ----------------------------- */
function safeJoin(baseDirAbs, fileName) {
  const base = path.resolve(baseDirAbs);
  const target = path.resolve(baseDirAbs, fileName);
  if (!target.startsWith(base + path.sep) && target !== base) {
    console.error('Invalid output path (path traversal).');
  }
  return target;
}
/* -----------------------------
 * Parse Figma URL: fileKey, nodeId
 * Require selection link that contains node-id
 * ----------------------------- */
function parseFigmaUrl(input) {
  const url = new URL(input);

  // ex) /board/FILEKEY/slug , /file/FILEKEY/slug ...
  const pathParts = url.pathname.split('/').filter(Boolean);
  const type = pathParts[0] ?? 'unknown';
  const fileKey = pathParts[1] ?? '';

  if (!fileKey) {
    console.error('Invalid Figma URL: missing fileKey in path.');
  }

  // node-id can be in query (?node-id=1-7) or sometimes hash (#node-id=...)
  const qsNodeId = url.searchParams.get('node-id');
  const hashParams = new URLSearchParams((url.hash || '').replace(/^#/, ''));
  const hashNodeId = hashParams.get('node-id');

  const nodeId = qsNodeId ?? hashNodeId ?? null;

  // Optional conversion: "1-7" -> "1:7"
  const nodeIdColon = nodeId ? nodeId.replace(/-/g, ':') : null;

  return { fileKey, nodeId, nodeIdColon, type, url: url.toString() };
}

/* -----------------------------
 * Figma REST API
 * - Nodes endpoint: /v1/files/:key/nodes?ids=...&depth=...&geometry=paths
 * - PAT via X-Figma-Token header
 * ----------------------------- */
async function figmaFetchJson(url) {
  console.log(`figmaFetchJson. url=${url}`);
  const r = await fetch(url, {
    method: 'GET',
  });
  // await sleep(retryAfterSec * 1000);
  // console.log('r', r);
  if (!r.ok) {
    const t = await r.text();
    console.error(`Figma API ${r.status}: ${t}`);
  }
  return await r.json();
}

function makeNodesUrl({ fileKey, ids, depth = 10, geometryPaths = true }) {
  const base = 'https://api.figma.com/v1';
  const url = new URL(`${base}/files/${encodeURIComponent(fileKey)}/nodes`);
  url.searchParams.set('ids', ids.join(','));
  url.searchParams.set('depth', String(depth));
  if (geometryPaths) url.searchParams.set('geometry', 'paths');
  return url.toString();
}

function makeImagesUrl({ fileKey, ids, format = 'png', scale = 1 }) {
  const base = 'https://api.figma.com/v1';
  const url = new URL(`${base}/images/${encodeURIComponent(fileKey)}`);
  url.searchParams.set('ids', ids.join(','));
  url.searchParams.set('format', format);
  url.searchParams.set('scale', String(scale));
  return url.toString();
}

async function fetchFigmaNodes({ fileKey, ids, depth, geometryPaths }) {
  const url = makeNodesUrl({ fileKey, ids, depth, geometryPaths });
  console.log(`Fetching Figma nodes. url=${url}`);
  const json = await figmaFetchJson(url);
  // console.log(`json=${JSON.stringify(json)}`);

  // validate
  // console.log('json?.nodes', json?.nodes);
  for (const id of ids) {
    const entry = json?.nodes?.[id];
    if (!entry || !entry.document) {
      console.log(`Node missing or null: ${id}. Check permissions/node-id.`);
    }
  }
  return json;
}

/* -----------------------------
 * Spec normalization helpers
 * (keep minimal but signal-rich)
 * ----------------------------- */
function normalizeBounds(node) {
  const b = node.absoluteBoundingBox || node.absoluteRenderBounds;
  if (!b) return undefined;
  return { x: b.x, y: b.y, w: b.width, h: b.height };
}

function normalizeColor(c) {
  if (!c) return undefined;
  // Figma colors are 0..1 floats
  return { r: c.r, g: c.g, b: c.b, a: c.a ?? 1 };
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
    if (p.type === 'GRADIENT_LINEAR' || p.type === 'GRADIENT_RADIAL') {
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
      // imageRef not always present in nodes endpoint; we will map nodeId via Images API
    }
    return prune(out);
  });
}

function normalizeEffects(effects) {
  if (!Array.isArray(effects)) return undefined;
  return effects.filter(Boolean).map(e => {
    const out = {
      type: e.type,
      visible: e.visible !== false,
      radius: e.radius,
      spread: e.spread,
      offset: e.offset,
      color: e.color ? normalizeColor(e.color) : undefined,
    };
    return prune(out);
  });
}

function normalizeLayout(node) {
  // Auto layout keys live on frames/components
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

  // Sizing policy keys (often useful)
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
  const keys = [
    'fontFamily',
    'fontPostScriptName',
    'fontWeight',
    'fontSize',
    'textAlignHorizontal',
    'textAlignVertical',
    'letterSpacing',
    'lineHeightPx',
    'lineHeightPercent',
    'lineHeightPercentFontSize',
    'paragraphSpacing',
    'paragraphIndent',
    'textCase',
    'textDecoration',
  ];
  const out = {};
  for (const k of keys) if (style[k] !== undefined) out[k] = style[k];
  return Object.keys(out).length ? out : undefined;
}

function prune(obj) {
  for (const k of Object.keys(obj)) {
    if (obj[k] === undefined || obj[k] === null) delete obj[k];
  }
  return obj;
}

/* -----------------------------
 * Spec picking (user-provided pattern)
 * - Adds better children selection (visible, area, text boost)
 * ----------------------------- */
function pickNodeSpec(node, opts, depth = 0) {
  const {
    mode = 'balanced',
    maxDepth = mode === 'high' ? 12 : 10,
    maxChildrenPerNode = mode === 'high' ? 80 : 35,
  } = opts || {};
  console.log(
    `pickNodeSpec: mode=${mode}, maxDepth=${maxDepth}, maxChildrenPerNode=${maxChildrenPerNode}`,
  );
  const spec = prune({
    id: node.id,
    name: node.name,
    type: node.type,
    visible: node.visible !== false,

    bounds: normalizeBounds(node),
    rotation: node.rotation,
    constraints: node.constraints,

    layout: normalizeLayout(node),

    opacity: node.opacity,
    blendMode: node.blendMode,
    cornerRadius: node.cornerRadius ?? node.rectangleCornerRadii,
    strokeWeight: node.strokeWeight,
    strokes: normalizePaints(node.strokes),
    fills: normalizePaints(node.fills),
    effects: normalizeEffects(node.effects),

    clipsContent: node.clipsContent,
    locked: node.locked,
  });
  console.log(`spec: ${JSON.stringify(spec)}`);

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
    // Keep additional high-signal refs when present
    spec.stylesRef = node.styles ? node.styles : undefined;
    spec.componentId = node.componentId;
    spec.componentProperties = node.componentProperties;
    spec.variantProperties = node.variantProperties;
    spec.reactions = node.reactions;
  }

  if (depth < maxDepth && Array.isArray(node.children) && node.children.length) {
    // Sort children by importance: visible, area, TEXT boost
    const scored = node.children.map((c, i) => {
      const b = normalizeBounds(c);
      const area = b ? b.w * b.h : 0;
      const textBoost = c.type === 'TEXT' ? 1e12 : 0;
      const visibleBoost = c.visible === false ? -1e15 : 0;
      return { c, i, score: visibleBoost + textBoost + area };
    });

    // sort desc score, but preserve relative order for similar scores via stable tie-breaker i
    scored.sort((a, b) => b.score - a.score || a.i - b.i);

    const picked = scored.slice(0, maxChildrenPerNode).map(x => x.c);
    spec.children = picked.map(child => pickNodeSpec(child, opts, depth + 1));

    if (node.children.length > picked.length) {
      spec.childrenTruncated = node.children.length - picked.length;
    }
  }

  return prune(spec);
}

/* -----------------------------
 * Find image fill nodes (for export)
 * We export by nodeId via Images API.
 * ----------------------------- */
function collectImageNodeIds(spec, out = new Set()) {
  if (!spec) return out;

  // heuristic: any fill paint type IMAGE
  const hasImageFill =
    Array.isArray(spec.fills) && spec.fills.some(p => p.type === 'IMAGE' && p.visible !== false);
  if (hasImageFill) out.add(spec.id);

  if (Array.isArray(spec.children)) {
    for (const c of spec.children) collectImageNodeIds(c, out);
  }
  return out;
}

async function buildAssetsMap({ fileKey, imageNodeIds }) {
  if (!imageNodeIds.length) return {};
  const url = makeImagesUrl({ fileKey, ids: imageNodeIds, format: 'png', scale: 1 });
  const json = await figmaFetchJson(url);

  // json.images: { [nodeId]: url }
  return json?.images ?? {};
}

/* -----------------------------
 * Codex runner
 * - passName used only for logging/headers
 * - return stdout/stderr for 2-pass parsing
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
 * Prompt builders
 * ----------------------------- */
function buildPromptOnePass({ outFileAbs, figmaUrl, spec, assetsMap }) {
  // keep input compact but complete
  const payload = { figmaUrl, spec, assetsMap };

  return `
You are generating a SINGLE Vue SFC (.vue) from a normalized Figma spec.
Goal: match the design as accurately as possible.

Hard rules:
- You are a frontend senior developer.
- Create/overwrite ONLY this file: ${outFileAbs}
- Please write only facts
- Think and write in steps.
- When writing code, think about preventing memory leaks and improving performance.

Implementation rules:
- Respect bounds/spacing/typography/colors from spec.
- If assetsMap has image URLs for node ids, use them with <img> and size/position per spec.
- Write it using Typescript and Vue 3.4 or later.
- vue, and use <script setup lang="ts"> with composition API.
- Using inline arrow functions when calling event methods from inside a template
- If you requested it as a composable function, create a use hook and write it as an import.
- Please write with vue-router4 or later version in mind.
- Please use pinia3.x version to create your statuses.
- Please also implement identifiable screen function elements in script code.

Context (JSON):
${JSON.stringify(payload)}
`.trim();
}

function buildPromptPass1({ outFileAbs, figmaUrl, spec, assetsMap }) {
  const payload = { figmaUrl, spec, assetsMap };
  return `
You will do TWO things:
(1) Print a single line to stdout in EXACT format:
HIGH_DETAIL_NODE_IDS: <comma-separated node ids or empty>
Choose node ids where higher-fidelity detail is needed (complex text overrides, shadows, icons, dense groups).

(2) Generate a SINGLE Vue SFC (.vue) from the normalized spec.

Hard rules:
- Create/overwrite ONLY this file: ${outFileAbs}
- Please write only facts
- Think and write in steps.
- When writing code, think about preventing memory leaks and improving performance.

Implementation rules:
- flex/grid for auto-layout; absolute only for overlaps.
- Prefer CSS variables for repeated colors/typography.
- Use assetsMap image URLs when present.
- Write it using Typescript and Vue 3.4 or later.
- vue, and use <script setup lang="ts"> with composition API.
- Using inline arrow functions when calling event methods from inside a template
- If you requested it as a composable function, create a use hook and write it as an import.
- Please write with vue-router4 or later version in mind.
- Please use pinia3.x version to create your statuses.
- Please also implement identifiable screen function elements in script code.

Context (JSON):
${JSON.stringify(payload)}
`.trim();
}

function buildPromptPass2({ outFileAbs, figmaUrl, baseSpec, highDetailMap, assetsMap }) {
  const payload = { figmaUrl, baseSpec, highDetailMap, assetsMap };
  return `
You are REFINING the Vue SFC using high-detail specs for selected nodes.

Hard rules:
- Create/overwrite ONLY this file: ${outFileAbs}
- Please write only facts
- Think and write in steps.
- When writing code, think about preventing memory leaks and improving performance.

How to use the inputs:
- baseSpec provides the overall tree and layout.
- highDetailMap provides more detailed specs for specific node ids.
- When a node id exists in highDetailMap, prefer its fields over baseSpec for that subtree.
- Write it using Typescript and Vue 3.4 or later.
- vue, and use <script setup lang="ts"> with composition API.
- Using inline arrow functions when calling event methods from inside a template
- If you requested it as a composable function, create a use hook and write it as an import.
- Please write with vue-router4 or later version in mind.
- Please use pinia3.x version to create your statuses.
- Please also implement identifiable screen function elements in script code.

Goal:
- Improve pixel accuracy of typography, spacing, effects, and small UI elements.

Context (JSON):
${JSON.stringify(payload)}
`.trim();
}

/* -----------------------------
 * API 1) One-pass generation
 * ----------------------------- */
app.post('/api/generate-vue', async (req, res) => {
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
        'https://www.figma.com/design/C8hUXLwiX1nDYbtR89U5Xk/testList?node-id=1-43351&t=y0hRMdB7UOAWGumU-0';
      outputDir = '../preview/src/views';
      fileName = 'Dashboard2Pass.vue';
    }
    if (!fileName.endsWith('.vue'))
      return res.status(400).json({ error: 'fileName must end with .vue' });

    console.log(`Parsed Figma URL. figmaUrl=${figmaUrl}`);
    const { fileKey, nodeId, nodeIdColon, url } = parseFigmaUrl(figmaUrl);
    console.log(`Parsed url. url=${url}`);
    console.log(`fileKey=${fileKey}, nodeIdColon=${nodeIdColon}`);

    // Fetch root node tree
    const nodesJson = await fetchFigmaNodes({
      fileKey,
      ids: [nodeId],
      depth: mode === 'high' ? 12 : 10,
      geometryPaths: true,
    });

    // // console.log(`nodesJson=${JSON.stringify(nodesJson)}`);
    const rootDoc = nodesJson.nodes[nodeIdColon].document;

    // console.log(`rootDoc=${JSON.stringify(rootDoc)}`);
    // Build spec
    const spec = pickNodeSpec(rootDoc, {
      mode,
      maxDepth: mode === 'high' ? 12 : 10,
      maxChildrenPerNode: mode === 'high' ? 80 : 35,
    });
    console.log(`spec=${JSON.stringify(spec)}`);

    // Assets map (image fills)
    const imageNodeIds = Array.from(collectImageNodeIds(spec));
    const assetsMap = await buildAssetsMap({ fileKey, imageNodeIds });

    // console.log(`assetsMap=${JSON.stringify(assetsMap)}`);
    // Prepare output
    const outDirAbs = path.resolve(outputDir);
    await fs.mkdir(outDirAbs, { recursive: true });
    const outFileAbs = safeJoin(outDirAbs, fileName);
    // console.log(`outFileAbs=${JSON.stringify(outFileAbs)}`);

    // Run codex in a temp workspace
    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-figma-'));
    const prompt = buildPromptOnePass({ outFileAbs, figmaUrl: url, spec, assetsMap });

    // console.log(`prompt=${JSON.stringify(prompt)}`);
    const { stdout, stderr } = await runCodexExec({ cwd: workspaceDir, prompt });
    console.log(`Codex stdout:\n${stdout}`);
    console.log(`Codex stderr:\n${stderr}`);
    const vue = await fs.readFile(outFileAbs, 'utf-8');
    return res.json({
      ok: true,
      outFile: outFileAbs,
      size: vue.length,
      codexStdoutLen: stdout.length,
      codexStderrLen: stderr.length,
      preview: vue.slice(0, 1200),
    });
    // return res.json({
    //   ok: true,
    //   message: nodesJson,
    // });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

/* -----------------------------
 * API 2) Two-pass high precision
 * - pass1: generate + stdout "HIGH_DETAIL_NODE_IDS: ..."
 * - fetch those nodes in high mode
 * - pass2: regenerate using highDetailMap
 * ----------------------------- */
app.post('/api/generate-vue-2pass', async (req, res) => {
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
        'https://www.figma.com/design/C8hUXLwiX1nDYbtR89U5Xk/testList?node-id=1-43351&t=y0hRMdB7UOAWGumU-0';
      outputDir = '../preview/src/views';
      fileName = 'Dashboard2Pass.vue';
    }
    if (!fileName.endsWith('.vue'))
      return res.status(400).json({ error: 'fileName must end with .vue' });

    console.log(`Parsed Figma URL. figmaUrl=${figmaUrl}`);
    const { fileKey, nodeId, nodeIdColon, url } = parseFigmaUrl(figmaUrl);
    console.log(`Parsed url. url=${url}`);
    console.log(`fileKey=${fileKey}, nodeId=${nodeId}`);

    // --- Fetch base tree (balanced) ---
    const baseJson = await fetchFigmaNodes({
      fileKey,
      ids: [nodeId],
      depth: 10,
      geometryPaths: true,
    });

    console.log('nodeIdColon', nodeIdColon);
    const baseRoot = baseJson.nodes[nodeIdColon].document;
    console.log('baseRoot', baseRoot);
    const baseSpec = pickNodeSpec(baseRoot, {
      mode: 'balanced',
      maxDepth: 10,
      maxChildrenPerNode: 35,
    });

    // Assets from base spec
    const baseImageNodeIds = Array.from(collectImageNodeIds(baseSpec));
    const assetsMap = await buildAssetsMap({ fileKey, imageNodeIds: baseImageNodeIds });

    // Output path
    const outDirAbs = path.resolve(outputDir);
    await fs.mkdir(outDirAbs, { recursive: true });
    const outFileAbs = safeJoin(outDirAbs, fileName);

    const workspaceDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-figma-'));

    // --- PASS 1 ---
    const pass1Prompt = buildPromptPass1({ outFileAbs, figmaUrl: url, spec: baseSpec, assetsMap });
    const pass1 = await runCodexExec({ cwd: workspaceDir, prompt: pass1Prompt });

    // Parse HIGH_DETAIL_NODE_IDS from stdout
    const m = pass1.stdout.match(/HIGH_DETAIL_NODE_IDS:\s*(.*)/);
    const idListRaw = (m?.[1] ?? '').trim();
    const highIds = idListRaw
      ? idListRaw
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      : [];

    // Optional: cap to avoid runaway
    const MAX_HIGH_IDS = 40;
    const highIdsCapped = highIds.slice(0, MAX_HIGH_IDS);

    // --- Fetch high detail nodes (high mode) ---
    let highDetailMap = {};
    if (highIdsCapped.length) {
      const highJson = await fetchFigmaNodes({
        fileKey,
        ids: highIdsCapped,
        depth: 12,
        geometryPaths: true,
      });

      // Build high specs per id (each is a subtree root)
      for (const hid of highIdsCapped) {
        const doc = highJson.nodes[hid]?.document;
        if (!doc) continue;
        highDetailMap[hid] = pickNodeSpec(doc, {
          mode: 'high',
          maxDepth: 12,
          maxChildrenPerNode: 80,
        });
      }
    }

    // --- PASS 2 (refine) ---
    const pass2Prompt = buildPromptPass2({
      outFileAbs,
      figmaUrl: url,
      baseSpec,
      highDetailMap,
      assetsMap,
    });

    const pass2 = await runCodexExec({ cwd: workspaceDir, prompt: pass2Prompt });

    const vue = await fs.readFile(outFileAbs, 'utf-8');
    return res.json({
      ok: true,
      outFile: outFileAbs,
      size: vue.length,
      highDetailIds: highIdsCapped,
      codex1StdoutLen: pass1.stdout.length,
      codex1StderrLen: pass1.stderr.length,
      codex2StdoutLen: pass2.stdout.length,
      codex2StderrLen: pass2.stderr.length,
      preview: vue.slice(0, 1200),
    });
    // return res.json({
    //   ok: true,
    // });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
