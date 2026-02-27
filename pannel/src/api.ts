const API_BASE = 'http://localhost:8787';

export async function runCodex(prompt: string): Promise<{ jobId: string }> {
  const res = await fetch(`${API_BASE}/api/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`run failed: ${res.status}`);
  return res.json();
}

export function streamLogs(jobId: string, onMessage: (payload: any) => void) {
  const es = new EventSource(`${API_BASE}/api/stream/${jobId}`);
  es.onmessage = ev => {
    try {
      onMessage(JSON.parse(ev.data));
    } catch {
      onMessage({ type: 'log', message: ev.data });
    }
  };
  es.onerror = () => {
    // 서버가 정상 종료하면서도 onerror가 뜰 수 있어, PoC에서는 조용히 닫습니다.
  };
  return () => es.close();
}

export async function runFigmaVueMake(prompt: string): Promise<any> {
  const body = prompt ? JSON.stringify({ prompt }) : undefined;
  const res = await fetch(`${API_BASE}/api/generate-vue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`run failed: ${res.status}`);
  return res.json();
}
export async function runFigmaVueMake2Pass(prompt: string): Promise<any> {
  const body = prompt ? JSON.stringify({ prompt }) : undefined;
  const res = await fetch(`${API_BASE}/api/generate-vue-2pass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`run failed: ${res.status}`);
  return res.json();
}

export async function runFigmaVueMakeHigh(prompt: string): Promise<any> {
  const body = prompt ? JSON.stringify({ prompt }) : undefined;
  const res = await fetch(`${API_BASE}/api/generate-vue-high`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`run failed: ${res.status}`);
  return res.json();
}
export async function runFigmaVueMake2PassHigh(prompt: string): Promise<any> {
  const body = prompt ? JSON.stringify({ prompt }) : undefined;
  const res = await fetch(`${API_BASE}/api/generate-vue-2pass-high`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`run failed: ${res.status}`);
  return res.json();
}
export async function runFigmaVueMakeDiffs(prompt: string): Promise<any> {
  const body = prompt ? JSON.stringify({ prompt }) : undefined;
  const res = await fetch(`${API_BASE}/api/generate-vue-3pass`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!res.ok) throw new Error(`run failed: ${res.status}`);
  return res.json();
}
