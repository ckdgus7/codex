import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json({ limit: '1mb' }));

// ✅ 반드시 제한하세요: Codex가 수정할 작업 디렉터리(= preview 앱 폴더)
const TARGET_DIR = process.env.CODEX_TARGET_DIR || '../preview';

// 간단한 CORS (PoC 용도)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5009');
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
app.get('/api/notices', (req, res) => {
  const notices = [
    { id: 30, type: "공통", title: "AI DevOps 시스템 안내입니다.", isNew: true, author: "Admin", createdAt: "2026-03-01 10:00", updatedAt: "2026-03-01 10:00", attachments: 2, readNum: 312 },
    { id: 29, type: "공통", title: "2026년 상반기 시스템 점검 일정 안내", isNew: false, author: "Admin", createdAt: "2026-02-28 09:30", updatedAt: "2026-02-28 14:20", attachments: 1, readNum: 254 },
    { id: 28, type: "업무", title: "신규 기능 업데이트 안내 (v2.5.0)", isNew: false, author: "김개발", createdAt: "2026-02-27 15:00", updatedAt: "2026-02-27 15:00", attachments: 0, readNum: 189 },
    { id: 27, type: "공통", title: "보안 정책 변경 사항 공지", isNew: true, author: "Admin", createdAt: "2026-02-26 11:00", updatedAt: "2026-02-27 09:10", attachments: 3, readNum: 421 },
    { id: 26, type: "업무", title: "개발 환경 설정 가이드 업데이트", isNew: false, author: "이운영", createdAt: "2026-02-25 14:30", updatedAt: "2026-02-25 14:30", attachments: 1, readNum: 167 },
    { id: 25, type: "서비스", title: "2월 정기 배포 완료 안내", isNew: false, author: "박배포", createdAt: "2026-02-24 18:00", updatedAt: "2026-02-24 18:00", attachments: 0, readNum: 134 },
    { id: 24, type: "공통", title: "서비스 이용약관 개정 안내", isNew: false, author: "Admin", createdAt: "2026-02-23 10:00", updatedAt: "2026-02-24 11:30", attachments: 2, readNum: 298 },
    { id: 23, type: "서비스", title: "CI/CD 파이프라인 개선 사항", isNew: false, author: "최자동", createdAt: "2026-02-22 16:45", updatedAt: "2026-02-22 16:45", attachments: 0, readNum: 112 },
    { id: 22, type: "공통", title: "개인정보 처리방침 변경 안내", isNew: false, author: "Admin", createdAt: "2026-02-21 09:00", updatedAt: "2026-02-22 10:00", attachments: 1, readNum: 356 },
    { id: 21, type: "업무", title: "코드 리뷰 프로세스 가이드라인", isNew: false, author: "김개발", createdAt: "2026-02-20 13:30", updatedAt: "2026-02-20 13:30", attachments: 1, readNum: 145 },
  ];

  res.json({
    items: notices.map(({ no, type, readNum, attachments: _attachments, ...rest }) => ({
      id: String(no),
      type: type,
      readNum: readNum,
      ...rest,
    })),
    total: 10,
    page: 1,
    pageSize: 10,
    totalPages: 1
  });
});
app.post('/api/notice/insert', (req, res) => {
  console.log(req.body)
  const notices = [
  ];
    notices.push(
    { id: 30, type: "공통", title: "AI DevOps 시스템 안내입니다.", isNew: true, author: "Admin", createdAt: "2026-03-01 10:00", updatedAt: "2026-03-01 10:00", attachments: 2, readNum: 312 },
    { id: 29, type: "공통", title: "2026년 상반기 시스템 점검 일정 안내", isNew: false, author: "Admin", createdAt: "2026-02-28 09:30", updatedAt: "2026-02-28 14:20", attachments: 1, readNum: 254 },
    { id: 28, type: "업무", title: "신규 기능 업데이트 안내 (v2.5.0)", isNew: false, author: "김개발", createdAt: "2026-02-27 15:00", updatedAt: "2026-02-27 15:00", attachments: 0, readNum: 189 },
    { id: 27, type: "공통", title: "보안 정책 변경 사항 공지", isNew: true, author: "Admin", createdAt: "2026-02-26 11:00", updatedAt: "2026-02-27 09:10", attachments: 3, readNum: 421 },
    { id: 26, type: "업무", title: "개발 환경 설정 가이드 업데이트", isNew: false, author: "이운영", createdAt: "2026-02-25 14:30", updatedAt: "2026-02-25 14:30", attachments: 1, readNum: 167 },
    { id: 25, type: "서비스", title: "2월 정기 배포 완료 안내", isNew: false, author: "박배포", createdAt: "2026-02-24 18:00", updatedAt: "2026-02-24 18:00", attachments: 0, readNum: 134 },
    { id: 24, type: "공통", title: "서비스 이용약관 개정 안내", isNew: false, author: "Admin", createdAt: "2026-02-23 10:00", updatedAt: "2026-02-24 11:30", attachments: 2, readNum: 298 },
    { id: 23, type: "서비스", title: "CI/CD 파이프라인 개선 사항", isNew: false, author: "최자동", createdAt: "2026-02-22 16:45", updatedAt: "2026-02-22 16:45", attachments: 0, readNum: 112 },
    { id: 22, type: "공통", title: "개인정보 처리방침 변경 안내", isNew: false, author: "Admin", createdAt: "2026-02-21 09:00", updatedAt: "2026-02-22 10:00", attachments: 1, readNum: 356 },
    { id: 21, type: "업무", title: "코드 리뷰 프로세스 가이드라인", isNew: false, author: "김개발", createdAt: "2026-02-20 13:30", updatedAt: "2026-02-20 13:30", attachments: 1, readNum: 145 },
    { id: 20, type: "서비스", title: "테스트 자동화 도구 도입 안내", isNew: false, author: "이테스트", createdAt: "2026-02-19 11:00", updatedAt: "2026-02-19 15:20", attachments: 2, readNum: 198 },)


  res.json({
    items: notices,
    total: 11,
    page: 1,
    pageSize: 10,
    totalPages: 2
  });
});
app.get('/api/qna', (req, res) => {
  console.log(req.query)
  const qna = [
  ];
  if (req.query.page === '1') {
    qna.push(
    { id: '1', category: "서비스", title: "AI DevOps 이용방법에 대해서 문의드립니다.", hasReply: false, author: "김개발", createdAt: "2026-03-01 10:00", status: "답변완료", attachments: 2, readNum: 312 },
    { id: '29', category: "공통", title: "2026년 상반기 시스템 점검 일정 안내", hasReply: false, author: "Admin", createdAt: "2026-02-28 09:30", status: "답변대기", attachments: 1, readNum: 254 },
    { id: '28', category: "업무", title: "신규 기능 업데이트 안내 (v2.5.0)", hasReply: false, author: "김개발", createdAt: "2026-02-27 15:00", status: "답변완료", attachments: 0, readNum: 189 },
    { id: '27', category: "공통", title: "보안 정책 변경 사항 공지", hasReply: true, author: "Admin", createdAt: "2026-02-26 11:00", status: "답변완료", attachments: 3, readNum: 421 },
    { id: '26', category: "업무", title: "개발 환경 설정 가이드 업데이트", hasReply: false, author: "이운영", createdAt: "2026-02-25 14:30", status: "답변완료", attachments: 1, readNum: 167 },
    { id: '25', category: "서비스", title: "2월 정기 배포 완료 안내", hasReply: false, author: "박배포", createdAt: "2026-02-24 18:00", status: "답변대기", attachments: 0, readNum: 134 },
    { id: '24', category: "공통", title: "서비스 이용약관 개정 안내", hasReply: false, author: "Admin", createdAt: "2026-02-23 10:00", status: "답변완료", attachments: 2, readNum: 298 },
    { id: '23', category: "서비스", title: "CI/CD 파이프라인 개선 사항", hasReply: false, author: "최자동", createdAt: "2026-02-22 16:45", status: "답변완료", attachments: 0, readNum: 112 },
    { id: '22', category: "공통", title: "개인정보 처리방침 변경 안내", hasReply: false, author: "Admin", createdAt: "2026-02-21 09:00", status: "답변완료", attachments: 1, readNum: 356 },
    { id: '21', category: "업무", title: "코드 리뷰 프로세스 가이드라인", hasReply: false, author: "김개발", createdAt: "2026-02-20 13:30", status: "답변완료", attachments: 1, readNum: 145 },)
  } else {
    qna.push(
    { id: '20', category: "서비스", title: "테스트 자동화 도구 도입 안내", hasReply: false, author: "이테스트", createdAt: "2026-02-19 11:00", status: "답변완료", attachments: 2, readNum: 198 },
    { id: '19', category: "공통", title: "시스템 긴급 점검 안내 (2/18)", hasReply: false, author: "Admin", createdAt: "2026-02-18 08:00", status: "답변완료", attachments: 0, readNum: 467 },)
  }

  res.json({
    items: qna,
    total: 12,
    page: req.query.page,
    pageSize: 10,
    totalPages: 2
  });
});
app.post('/api/qna/insert', (req, res) => {
  console.log(req.body)
  const qna = [
  ];
    qna.push(
    { id: '1', category: "서비스", title: "AI DevOps 이용방법에 대해서 문의드립니다.", hasReply: false, author: "김개발", createdAt: "2026-03-01 10:00", status: "답변완료", attachments: 2, readNum: 312 },
    { id: '29', category: "공통", title: "2026년 상반기 시스템 점검 일정 안내", hasReply: false, author: "Admin", createdAt: "2026-02-28 09:30", status: "답변대기", attachments: 1, readNum: 254 },
    { id: '28', category: "업무", title: "신규 기능 업데이트 안내 (v2.5.0)", hasReply: false, author: "김개발", createdAt: "2026-02-27 15:00", status: "답변완료", attachments: 0, readNum: 189 },
    { id: '27', category: "공통", title: "보안 정책 변경 사항 공지", hasReply: true, author: "Admin", createdAt: "2026-02-26 11:00", status: "답변완료", attachments: 3, readNum: 421 },
    { id: '26', category: "업무", title: "개발 환경 설정 가이드 업데이트", hasReply: false, author: "이운영", createdAt: "2026-02-25 14:30", status: "답변완료", attachments: 1, readNum: 167 },
    { id: '25', category: "서비스", title: "2월 정기 배포 완료 안내", hasReply: false, author: "박배포", createdAt: "2026-02-24 18:00", status: "답변대기", attachments: 0, readNum: 134 },
    { id: '24', category: "공통", title: "서비스 이용약관 개정 안내", hasReply: false, author: "Admin", createdAt: "2026-02-23 10:00", status: "답변완료", attachments: 2, readNum: 298 },
    { id: '23', category: "서비스", title: "CI/CD 파이프라인 개선 사항", hasReply: false, author: "최자동", createdAt: "2026-02-22 16:45", status: "답변완료", attachments: 0, readNum: 112 },
    { id: '22', category: "공통", title: "개인정보 처리방침 변경 안내", hasReply: false, author: "Admin", createdAt: "2026-02-21 09:00", status: "답변완료", attachments: 1, readNum: 356 },
    { id: '21', category: "업무", title: "코드 리뷰 프로세스 가이드라인", hasReply: false, author: "김개발", createdAt: "2026-02-20 13:30", status: "답변완료", attachments: 1, readNum: 145 },)


  res.json({
    items: qna,
    total: 12,
    page: 1,
    pageSize: 10,
    totalPages: 2
  });
});
const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`Codex API Server listening on http://localhost:${port}`);
  console.log(`CODEX_TARGET_DIR = ${TARGET_DIR}`);
});
