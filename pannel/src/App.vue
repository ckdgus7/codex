<template>
  <div class="root">
    <!-- LEFT: 실제 UI (preview dev server) -->
    <section class="left">
      <div class="bar">
        <div class="title">Live Preview</div>
        <a :href="previewUrl" target="_blank" rel="noreferrer">open</a>
      </div>
      <div v-show="state === 'running'">업데이트 진행 중...</div>
      <div v-show="state !== 'running'"><iframe ref="frame" class="frame" :src="previewUrl" /></div>
    </section>

    <!-- RIGHT: Codex panel -->
    <section class="right">
      <div class="bar">
        <div class="title">Codex Panel</div>
        <div class="status" :data-state="state">{{ stateLabel }}</div>
      </div>
      <div>
        <!-- <button @click="setMakeVueFile">figma로 파일 만들기</button>
        &nbsp;
        <button @click="setMakeVueFile2Pass">figma로 파일 만들기 2Pass</button>
        &nbsp;&nbsp;&nbsp; -->
        <button @click="setMakeVueFileHigh">figma로 파일 만들기 High</button>
        <!-- &nbsp;
        <button @click="setMakeVueFile2PassHigh">figma로 파일 만들기 2Pass High</button> -->
        &nbsp;&nbsp;&nbsp;
        <button @click="setMakeVueFileDiffs">figma로 파일 만들기 Diffs</button>
      </div>
      <div></div>
      <textarea
        v-model="prompt"
        class="prompt"
        placeholder="예: preview/src/App.vue에서 버튼을 Vuetify 스타일처럼 바꾸고, 문구를 'Updated by Codex'로 바꿔줘."
      />

      <div class="actions">
        <button :disabled="state === 'running' || !prompt.trim()" @click="run">Run</button>
        <button :disabled="state === 'running' || logs.length === 0" @click="clear">
          Clear logs
        </button>
        <button @click="reloadIframe">UI새로고침</button>
      </div>

      <pre class="logs">{{ logsText }}</pre>

      <div class="hint">
        <div class="hintTitle">프롬프트 팁</div>
        <ul>
          <li>
            수정 파일을 명시:
            <code>preview/src/App.vue</code>
          </li>
          <li>원하는 결과를 구체화: 레이아웃/문구/컴포넌트</li>
          <li>가능하면 “테스트/빌드 깨지지 않게” 조건 추가</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from 'vue';
  import {
    runCodex,
    streamLogs,
    runFigmaVueMake,
    runFigmaVueMake2Pass,
    runFigmaVueMakeHigh,
    runFigmaVueMake2PassHigh,
    runFigmaVueMakeDiffs,
  } from './api';

  const previewUrl = 'http://localhost:5174';

  const prompt = ref('');
  const logs = ref<string[]>([]);
  const state = ref<'idle' | 'running' | 'done' | 'error'>('idle');
  const exitCode = ref<number | null>(null);
  const frame = ref<any>(null);
  const reloadIframe = () => {
    frame.value.src = frame.value.src;
  };
  let stopStream: null | (() => void) = null;
  onBeforeUnmount(() => stopStream?.());

  const stateLabel = computed(() => {
    if (state.value === 'idle') return 'IDLE';
    if (state.value === 'running') return 'RUNNING';
    if (state.value === 'done') return `DONE (exit=${exitCode.value ?? 0})`;
    return 'ERROR';
  });

  const logsText = computed(() => logs.value.join(''));

  function clear() {
    logs.value = [];
  }

  async function run() {
    state.value = 'running';
    exitCode.value = null;

    stopStream?.();
    try {
      const { jobId } = await runCodex(prompt.value);
      stopStream = streamLogs(jobId, p => {
        if (p.type === 'log') logs.value.push(p.message);
        if (p.type === 'done') {
          exitCode.value = p.exitCode ?? 0;
          state.value = 'done';
          stopStream?.();
          stopStream = null;
          reloadIframe();
        }
        if (p.type === 'error') {
          logs.value.push(`\n[error] ${p.message}\n`);
          state.value = 'error';
        }
      });
    } catch (e: any) {
      logs.value.push(`\n[error] ${e?.message || String(e)}\n`);
      state.value = 'error';
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function setMakeVueFile() {
    const response = await runFigmaVueMake(prompt.value);
    console.log('Figma Vue Make Response:', response.ok);
  }
  async function setMakeVueFile2Pass() {
    const response = await runFigmaVueMake2Pass(prompt.value);
    console.log('Figma Vue Make Response:', response.ok);
  }
  async function setMakeVueFileHigh() {
    const response = await runFigmaVueMakeHigh(prompt.value);
    console.log('Figma Vue Make Response:', response.ok);
  }
  async function setMakeVueFile2PassHigh() {
    const response = await runFigmaVueMake2PassHigh(prompt.value);
    console.log('Figma Vue Make Response:', response.ok);
  }
  async function setMakeVueFileDiffs() {
    const response = await runFigmaVueMakeDiffs(prompt.value);
    console.log('Figma Vue Make Response:', response.ok);
  }
</script>

<style scoped>
  .root {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    width: 100vw;
    height: 100vh;
    margin: 0;
  }

  .left,
  .right {
    display: grid;
    grid-template-rows: auto 1fr;
    min-width: 0;
    border-right: 1px solid #ddd;
  }
  .right {
    border-right: 0;
    border-left: 1px solid #ddd;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-bottom: 1px solid #ddd;
    background: #fafafa;
  }
  .title {
    font-weight: 600;
    color: black;
  }
  .status {
    margin-left: auto;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1px solid #ccc;
    background: white;
    color: #0b0b0b;
  }
  .frame {
    width: 100%;
    height: 100%;
    border: 0;
  }

  .prompt {
    width: calc(100% - 24px);
    height: 160px;
    margin: 12px;
    padding: 10px;
    resize: vertical;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  }

  .actions {
    display: flex;
    gap: 8px;
    padding: 0 12px 12px;
  }
  .actions button {
    padding: 8px 10px;
    cursor: pointer;
  }

  .logs {
    margin: 0 12px 12px;
    padding: 10px;
    border: 1px solid #ddd;
    background: #0b0b0b;
    color: #eaeaea;
    border-radius: 8px;
    overflow: auto;
    min-height: 240px;
    height: 240px;
    font-size: 12px;
    line-height: 1.35;
  }

  .hint {
    margin: 0 12px 12px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  .hintTitle {
    font-weight: 600;
    margin-bottom: 6px;
  }
  code {
    background: #f3f3f3;
    padding: 1px 4px;
    border-radius: 4px;
    color: black;
  }
</style>
