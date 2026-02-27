import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json({ limit: '1mb' }));

// ✅ 반드시 제한하세요: Codex가 수정할 작업 디렉터리(= preview 앱 폴더)
const TARGET_DIR = process.env.CODEX_TARGET_DIR || '../preview';

// 간단한 CORS (PoC 용도)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// in-memory job store
const jobs = new Map();
function push(jobId, line) {
  const job = jobs.get(jobId);
  if (job) job.lines.push(line);
}
/**
 * POST /api/run
 * body: { prompt: string }
 * returns: { jobId: string }
 */
app.post('/api/run', (req, res) => {
  const prompt = (req.body?.prompt || '').toString().trim();
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const jobId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  jobs.set(jobId, { lines: [], done: false, exitCode: null });

  // Codex 실행 (로그는 SSE로 스트리밍)
  // 자동 실행이므로 승인 끄되, sandbox는 제한 권장
  const isWin = process.platform === 'win32';
  const CODEX_BIN = process.env.CODEX_BIN || 'codex';

  // ✅ 핵심: codex exec + PROMPT는 '-' 로 stdin에서 읽게 함
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

  // 로그
  child.stdout.on('data', b => push(jobId, b.toString()));
  child.stderr.on('data', b => push(jobId, b.toString()));

  // ✅ 중요: spawn 에러 핸들링 (서버가 죽지 않게)
  child.on('error', err => {
    push(jobId, `\n[error] spawn failed: ${err?.message || String(err)}\n`);
    const job = jobs.get(jobId);
    if (job) {
      job.done = true;
      job.exitCode = 1;
    }
  });

  // ✅ stdin으로 프롬프트 전달
  child.stdin.write(prompt, 'utf8');
  child.stdin.end();

  child.on('close', code => {
    const job = jobs.get(jobId);
    if (job) {
      job.done = true;
      job.exitCode = code ?? 0;
    }
    push(jobId, `\n[done] exit=${code ?? 0}\n`);
  });

  res.json({ jobId });
});

/**
 * GET /api/stream/:jobId
 * SSE stream: data: { type, message, done, exitCode }
 */
app.get('/api/stream/:jobId', (req, res) => {
  const { jobId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  let cursor = 0;

  const timer = setInterval(() => {
    const job = jobs.get(jobId);
    if (!job) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'job not found' })}\n\n`);
      clearInterval(timer);
      res.end();
      return;
    }

    // 새 로그만 전송
    while (cursor < job.lines.length) {
      const chunk = job.lines[cursor++];
      res.write(`data: ${JSON.stringify({ type: 'log', message: chunk })}\n\n`);
    }

    if (job.done) {
      res.write(
        `data: ${JSON.stringify({ type: 'done', done: true, exitCode: job.exitCode })}\n\n`,
      );
      clearInterval(timer);
      res.end();
    }
  }, 200);

  req.on('close', () => clearInterval(timer));
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`Codex API Server listening on http://localhost:${port}`);
  console.log(`CODEX_TARGET_DIR = ${TARGET_DIR}`);
});
