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

const FIGMA_PAT = 'figd_kuHe8CYDNouxxjzijblstXsYxLNwU-0nGl7PXOoL';
if (!FIGMA_PAT) {
  console.error('Missing FIGMA_PAT env var');
  process.exit(1);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const TARGET_DIR = process.env.CODEX_TARGET_DIR || '../preview_react';
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
    headers: { 'X-Figma-Token': FIGMA_PAT },
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
function runCodexExec({ prompt }) {
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
function buildPromptOnePass({ figmaUrl, spec, assetsMap }) {
  // keep input compact but complete
  const payload = { figmaUrl, spec, assetsMap };

  return `
  SSF관리 > 업무(L3)정보 관리 화면을 다른 도메인(L1)정보 관리 처럼 pages/ssf/BusinessInfoPage, features/ssf/ui/BusinessInfoListView에 구성해주세요.

아래 구성 정보 및 rule을 참고하여 정확하게 구성해주세요.

## Overview

A React frontend application built with Vite, TypeScript, React Router v7, TanStack Query, and Zustand. It follows a feature-based architecture with a NOVA AI DevOps themed layout (vertical sidebar + content area).

## Project Structure

'''
src/
  app/          - App root, providers, router setup
  features/     - Feature modules (notices, qna, ssf)
  pages/        - Page-level components
  shared/       - Shared utilities and UI components (GNB, LNB, Layout)
  main.tsx      - Application entry point
index.html      - HTML shell
vite.config.ts  - Vite configuration
'''

## Menu Structure & Routes

### 요구관리
- 요구사항 '/requirements'
- 요구사항 명세 작성 '/requirements/spec'
- 요구사항 검토자 배정 '/requirements/reviewer'
- 요구사항 검토 '/requirements/review'
- 요구상세 '/requirements/detail'
- 요구상세 승인 '/requirements/approval'
- 요구사항 반려 검토 '/requirements/reject-review'
- 업무 Flow 설계 '/requirements/flow-design'
- 애플리케이션 설계 '/requirements/app-design'

### UI 관리
- SB기획 '/ui/sb-planning'
- UI디자인 '/ui/design'
- 퍼블리싱 '/ui/publishing'

### 기능관리
- 기능설계 '/features/design'
- 상세기능 설계 '/features/detail-design'

### 게시판
- 공지사항 '/notices' (fully implemented with search/pagination)
- Q&A '/qna'

### SSF관리
- 도메인(L1)정보 관리 '/ssf/domain' (fully implemented: filter bar with ChooseButton + search, data table with sorting/pagination, 13 mock rows, detail/create/edit/delete popups; row click → detail popup → edit or delete)
- 컴포넌트(L2)정보 관리 '/ssf/component'
- 업무(L3)정보 관리 '/ssf/business'
- 기능(L4)정보 관리 '/ssf/function'
- SSF탐색기 '/ssf/explorer'

### 워크스페이스
- 사용자 관리 '/workspace/users'
- 사이트 이용약관 관리 '/workspace/terms'
- 개인정보 처리방침 관리 '/workspace/privacy'

### 업무 기준 정보 관리
- 업무Flow 관리 '/business-info/flow'
- 화면 기준 정보 관리 '/business-info/screen'
- 개발 진척 관리 '/business-info/progress'
- 과제 관리 '/business-info/project'

Pages with full UI implementation:
- 공지사항 ('/notices') — table list with search, pagination
- 요구사항 ('/requirements') — card list with filter bar (date range, status, search scope + keyword), tabs (All/Personal), chip sort (Update 일시/완료 희망일), pagination, and requirement cards (status circle badge, req ID, title, due date, task, updated time, author with role icon)

All other pages are blank placeholder pages using the shared 'BlankPage' component.

## Shared UI Components

- **LNB** ('src/shared/ui/LNB.tsx'): Main Sidebar - logo, collapsible GNB/LNB navigation sections, favorites, collapse toggle (240px ↔ 44px)
- **Layout** ('src/shared/ui/Layout.tsx'): Wrapper combining sidebar + content area
- **PageHeader** ('src/shared/ui/PageHeader.tsx'): Site header wrapper combining MDI Tab (36px) + page title wrap (120px). Contains MdiTab at top and renders children (Breadcrumb + PageTitle) in white content area with 24px/32px padding.
- **MdiTab** ('src/shared/ui/MdiTab.tsx'): MDI tab bar (36px, bg #fafafa). Each tab has label + close button, max-width 240px. Managed by Zustand store ('mdi.store.ts'). Pages register their own tab via 'useMdiStore.addTab()'.
- **Breadcrumb** ('src/shared/ui/Breadcrumb.tsx'): Navigation breadcrumb with home icon, chevron dividers. 12px Pretendard font. Last item is active (#3f3f46, Medium weight) with hover underline.
- **PageTitle** ('src/shared/ui/PageTitle.tsx'): Page title (32px Bold, 40px line-height) with optional status badge (purple #7a5af8) and ID badge (blue #36bffa), favorite button (1px solid black border, 3px padding), optional back button, refresh button, and CTA action slot.
- **PageFooter** ('src/shared/ui/PageFooter.tsx'): Footer with copyright text (10px #a1a1aa) and links (서비스 이용약관 12px Regular, 개인정보처리방침 12px Bold in #52525b). Border-top #e4e4e7, padding 16px 32px.
- **Typography** ('src/shared/ui/styles.ts'): Figma-based typography system with 'typography.title' (page 32/40, popup 24/32), 'typography.paragraphTitle' (xl→xs: 20→12, Bold/Medium), 'typography.paragraph' (xl→xs: 20→10, Regular), 'typography.field' (labelM/S, valueL/M, indicator, placeholderL). All Pretendard. Import as 'import { typography } from "@/shared/ui/styles"'.
- **Button** ('src/shared/ui/Button.tsx'): Figma-based button component. Props: 'size' (l/m/s → 40/32/24px), 'variant' (filled/outlined/text), 'color' (positive #7a5af8, negative #f04438, warning #f79009, success #1ac057, info #71717a), 'disabled' (opacity 0.4), 'leadingIcon', 'trailingIcon', 'children'. Font: L=16px Bold, M=14px Medium, S=12px Regular. Border-radius 4px. Named export 'Button'.
- **Input** ('src/shared/ui/Input.tsx'): Figma-based input field. Props: 'label', 'required' (6px blue dot), 'prefix' ("search" → built-in magnifier icon), 'leftIcon', 'rightIcon', 'indicator' (char count), 'error' (red border #f04438), 'disabled', 'helperText'. Field base: 40px height, 8px padding, border 1px solid #e4e7ec, radius 4px. Focus border #7a5af8. Text: Pretendard Regular 16px/24px. Label: Medium 14px/18px #a1a1aa. 'prefix' takes priority over nothing but 'leftIcon' overrides 'prefix'.
- **DatePicker** ('src/shared/ui/DatePicker.tsx'): Figma-based date picker field. Same Field pattern as Input. Props: 'value' (string), 'onChange' (string callback), 'label', 'required', 'disabled', 'error', 'helperText'. Right calendar icon (SVG). Native browser picker icon hidden. Focus/error border same as Input.
- **SelectBox** ('src/shared/ui/SelectBox.tsx'): Figma-based select dropdown. Supports single and multi-select modes. **Single mode** (default): 'value: string', 'onChange: (value: string) => void'. **Multi mode** ('multiple={true}'): 'value: string[]', 'onChange: (value: string[]) => void', displays selected items as chips (bg #fafaff, text #52525b 12px Medium, max-w 130px, border-radius 6px, X close icon 12px). Each chip has close button to remove. Clear all button (ClearIcon) when items selected. **Searchable** ('searchable={true}'): shows search input at top of dropdown with search icon, filters options by label. **Dropdown options**: multi-mode shows checkbox (20x20, checked #7a5af8 + white checkmark), single-mode shows text only. Option row: 40px height, padding 8px 16px. Hover #f4f4f5, selected #ede9fe. Max dropdown height 296px. Common props: 'options' ({label, value}[]), 'placeholder', 'label', 'required', 'disabled', 'error', 'helperText', 'searchPlaceholder'.
- **RadioGroup** ('src/shared/ui/RadioGroup.tsx'): Figma-based radio button group. Props: 'value', 'onChange' (string callback), 'options' ({label, value, disabled?}[]), 'size' (l/m/s → 24/20/18px circle), 'disabled', 'direction' (horizontal/vertical), 'gap'. Checked: bg #7a5af8, white inner dot. Unchecked: white bg, border #e4e7ec, gray inner dot opacity 0.3. Disabled: bg #71717a opacity 0.6. Label: Pretendard Regular, color #3f3f46. Sizes: L=16px, M=14px, S=12px text.
- **ChooseButton** ('src/shared/ui/ChooseButton.tsx'): Figma-based radio button group (RadioBtnControl). Props: 'value', 'onChange' (string callback — parent에서 실행할 함수 지정), 'options' ({label, value}[]). Active: bg #7a5af8, Default: bg #bdb4fe. Text: Pretendard Regular 16px/24px #fafaff. Padding 12px/8px. Container border-radius 6px, overflow hidden. 3개 또는 4개 이상 버튼 지원.
- **Toggle** ('src/shared/ui/Toggle.tsx'): Figma-based toggle switch. Props: 'checked', 'onChange' (boolean callback), 'label', 'labelPosition' ("left"/"right" — 좌측/우측 레이블 위치), 'size' (l/m/s → track 40/36/32px), 'disabled'. Checked: track bg #7a5af8, white knob right. Unchecked: track white + border #e4e7ec, gray knob left opacity 0.3. Disabled checked: track #71717a opacity 0.6. Disabled unchecked: track #fcfcfd, knob #e4e7ec opacity 0.5. Knob sizes: L=16px, M=14px, S=12px.
- **Snackbar** ('src/shared/ui/Snackbar.tsx'): Figma-based snackbar/toast notification. Props: 'open', 'onClose', 'message' (ReactNode), 'type' (info #71717a, positive #7a5af8, negative #f04438, error #ee46bc, warning #f79009, success #1ac057), 'duration' (auto-dismiss ms, default 3000). Container: 480px width, padding 24/12/16px, border-radius 8px, fixed bottom-center. Text: Pretendard Regular 16px/24px white. Close X 24x24 white.
- **AlertModal** ('src/shared/ui/AlertModal.tsx'): Figma-based alert modal dialog. Props: 'open', 'onClose', 'type' (info/success/warning/error — 각각 다른 아이콘), 'message' (ReactNode), 'confirmLabel', 'cancelLabel', 'onConfirm', 'onCancel', 'showCancel' (true → 취소+삭제 2버튼, false → 확인 1버튼). Container: 440px width, padding 24px, border-radius 16px, shadow. Close X 버튼 top-right 10px. Icon 52x52px. Message: Pretendard Regular 16px/24px #71717a center. Backdrop overlay. ESC 키 닫기 지원. 기존 Button 컴포넌트 활용.
- **Textarea** ('src/shared/ui/Textarea.tsx'): Figma-based textarea field. Props: 'label', 'required' (6px blue dot), 'indicator' (charCount/maxLength, default true), 'maxLength' (default 300), 'error' (border #ee46bc), 'helperText', 'readOnly' (bg #fafafa), 'disabled' (bg #f4f4f5). Container: min-height 120px, padding 8px, border 1px solid, radius 4px, flex-col justify-between. Focus border #7a5af8. Text: Pretendard Regular 16px/24px #3f3f46. Indicator: 12px/18px #a1a1aa bottom-right.
- **Checkbox** ('src/shared/ui/Checkbox.tsx'): Figma-based checkbox. Props: 'checked', 'onChange' (boolean callback), 'label', 'size' (l/m/s → 24/20/18px box), 'disabled'. Checked: bg #7a5af8, white checkmark SVG. Unchecked: white bg, border #e4e7ec. Disabled: bg #71717a opacity 0.6 (checked) or border opacity 0.6 (unchecked). Border-radius 4px (L/M) or 3px (S). Label: Pretendard Regular, color #3f3f46. Sizes: L=16px, M=14px, S=12px text.
- When composing screens, import and use the common components (such as Button, Input, Datepicker, SelectBox, RadioGroup, Checkbox, etc.) that are defined in 'shared/ui'.
- **All styles use inline CSSProperties** (no CSS files, no Tailwind). Pretendard font family.


## Tech Stack

- **React 19** with TypeScript
- **Vite 5** as the build tool and dev server
- **React Router 7** for client-side routing
- **TanStack React Query 5** for server state management
- **Zustand 4** for client state management

## Running the App

The dev server runs on port 5000 (0.0.0.0) via:

'''
npm run dev
'''

## Deployment

Configured as a **static** deployment:
- Build command: 'npm run build'
- Public directory: 'dist'


# Prompt Rules
Always maintain the folder structure as defined below.

When a new scre* Never modify common components in shared/ui unless requested.en is created, add the corresponding domain under features and pages at the appropriate location and proceed accordingly.
src/
 ├─ app/
 │   ├─ providers/
 │   ├─ router/
 │   └─ store/
 ├─ features/
 │   ├─ notices/
 │   │   ├─ components/
 │   │   ├─ hooks/
 │   │   ├─ api/
 │   │   ├─ model/
 │   │   ├─ ui/
 │   ├─ qna/
 │   │   ├─ api/
 │   │   ├─ model/
 │   │   ├─ ui/
 ├─ pages/
 │   ├─ notices/
 │   ├─ requirements/
 │   ├─ ui-management/
 │   ├─ feature-management/
 │   ├─ qna/
 ├─ shared/
 │   ├─ components/
 │   ├─ hooks/
 │   └─ lib/
 │   └─ ui/
 │   └─ utils/


## Component Rules

* All components must be function components.
* Props must be defined using an 'interface'.
* 'export default' is prohibited (use named exports only).
* Use components and utilities, library, ui from the 'shared' directory when constructing pages.
* When modifying a screen, do not make any changes to other domains unless explicitly requested.
* Please conduct a code review and verify that the build completes successfully, and check for any errors.
* When creating a page, always follow the folder structure rules and organize it under 'features/ssf' with the appropriate 'api', 'model', and 'ui' folders.
* Process only the requested items and do not make any suggestions.
* Handle it without asking about execution or configuration.

---

## Hook Rules

* Server state must use React Query only.
* Direct API calls are prohibited.

---

## State Ownership Rules

### R1. Server State must use React Query only

* Do not store remote data (GET/POST/PATCH/DELETE results) in Zustand.
* The Query Cache is the single source of truth for globally stored server data.

### R2. Client State must use Zustand only

* UI state (modal/toast/sidebar), temporary drafts, and wizard progress must use Zustand.
* Do not store UI state inside the React Query cache.

### R3. Shareable State must use URL (Search Params) only

* List filters/sorting/pagination/tabs must not use Zustand; manage them only via 'useSearchParams'.
* URL state must be connected to Query key parameters.

---

## Query Key / Caching Rules

### R4. Enforce Query Key namespace

* Only the pattern below is allowed:

  '''ts
  featureKeys = { all, list(params), detail(id), ... }
  '''
* Hardcoded string queryKeys are prohibited.

### R5. Fix Query Key parameter shape

* 'params' must always maintain the same shape (inject default values for missing fields).
* 'page' must be a number.
* 'q/sort' must be normalized as string/enum before composing the query key.

### R6. List pagination UX rule

* List queries must use 'keepPreviousData' (or 'placeholderData') by default.
* Arbitrary use of 'staleTime = 0' is prohibited (follow the default staleTime policy).

---

## Mutation / Synchronization Rules

### R7. Standardize synchronization after mutation success

After a successful mutation, 반드시 one of the following must be executed:

* 'invalidateQueries({ queryKey: featureKeys.all })'
* Update cache directly using 'setQueryData' (including optimistic updates)

### R8. Do not store server responses in Zustand during mutation

* If necessary, only store 'id' or selection state in Zustand.

---

## Router Integration Rules

### R9. Route-level data prefetching (optional rule)

* Prefer using 'queryClient.prefetchQuery' before route entry.
* Do not enforce for all routes; focus on core list/detail pages.

### R10. Centralize URL parameter parsing/validation

* Normalize via a utility function such as 'parseBoardListSearchParams()'.
* Duplicate parsing logic inside components is prohibited.

---

## Zustand Store Design Rules

### R11. Store separation principle

* Separate by purpose: 'uiStore', 'sessionStore', 'draftStore', etc.
* Even if feature stores are created, storing server data is prohibited.

### R12. Enforce selector usage

* Full subscription via 'useStore()' is prohibited.
* Only selector usage is allowed: 'useStore(s => s.xxx)' (to prevent excessive re-renders).

### R13. Persist usage criteria (optional rule)

'persist' is allowed only for:

* Theme / language / UX preferences
* Authentication-related data (upon policy approval)

Filters and pagination must not use persist (= URL is the source of truth).

---

## API Layer Rules

### R14. Restrict direct API calls

* Direct 'fetch/axios' calls inside components are prohibited.
* API calls are allowed only in:

  * 'features/*/api/*'
  * 'shared/api/*'

### R15. API types belong to feature/types

* Request/response types must be located within the feature.
* Usage of 'any' is prohibited (enforced via ESLint).

---

## Code Generation / Vibe Coding AI Rules (Operational Rules)

### R18. Always decide state ownership first

The generation prompt must explicitly include:

* Whether it is Server State
* Whether it is URL State
* Whether Zustand is required

### R19. File-level responsibility for generated code

* 'components' handle rendering only; data fetching must be separated into 'queries/hooks'.
* Combining Router + Query + UI logic in a single file is prohibited (enforce max line/complexity limits).


Context (JSON):
${JSON.stringify(payload)}
`.trim();
}

/* -----------------------------
 * API 1) One-pass generation
 * ----------------------------- */
app.post('/api/generate-react', async (req, res) => {
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
        'https://www.figma.com/design/xcwBh4uNiuw9VMZyNshv1c/aiops?node-id=6633-133271&t=qtbOqFTAorsicYa5-0';
      outputDir = '../preview_react/src/';
    }

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
    // console.log(`spec=${JSON.stringify(spec)}`);

    // Assets map (image fills)
    const imageNodeIds = Array.from(collectImageNodeIds(spec));
    const assetsMap = await buildAssetsMap({ fileKey, imageNodeIds });

    const prompt = buildPromptOnePass({ figmaUrl: url, spec, assetsMap });

    // console.log(`prompt=${JSON.stringify(prompt)}`);
    const { stdout, stderr } = await runCodexExec({ prompt });
    // console.log(`Codex stdout:\n${stdout}`);
    // console.log(`Codex stderr:\n${stderr}`);
    console.log('End');
    return res.json({
      ok: true,
      // codexStdoutLen: stdout.length,
      // codexStderrLen: stderr.length,
    });
    // return res.json({
    //   ok: true,
    //   message: nodesJson,
    // });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`Codex API Server listening on http://localhost:${port}`);
  console.log(`CODEX_TARGET_DIR = ${TARGET_DIR}`);
});
