<template>
  <div class="qna-nova">
    <header class="gnb">
      <div class="gnb-left">
        <div class="logo-wrap">
          <h1 class="logo">NOVA AI DevOps</h1>
          <button class="ghost-icon" type="button" aria-label="Collapse menu" @click="onToggleMenu">
            <span>←</span>
          </button>
        </div>
        <nav class="gnb-nav" aria-label="global navigation">
          <button v-for="item in gnbItems" :key="item" class="gnb-item" type="button" @click="onClickGnb(item)">
            {{ item }}
          </button>
        </nav>
      </div>
      <div class="gnb-right">
        <button class="ghost-icon" type="button" aria-label="Notifications" @click="onClickNotification">
          <span>B</span>
        </button>
        <div class="v-divider" />
        <div class="user-meta">
          <div class="avatar">U</div>
          <div>
            <p class="user-name">홍길동(p123456)</p>
            <p class="user-team">NOVA추진팀</p>
          </div>
        </div>
      </div>
    </header>

    <aside class="sidebar" v-show="uiStore.sidebarOpen">
      <div class="sidebar-inner">
        <div class="menu-search">
          <input v-model="menuKeyword" type="text" placeholder="메뉴를 검색하세요." @input="onMenuSearch" />
        </div>
        <div class="menu-tabs">
          <button class="tab active" type="button">메뉴</button>
          <button class="tab" type="button">즐겨찾기</button>
        </div>
        <ul class="menu-list">
          <li class="section">기획</li>
          <li class="item">요구사항</li>
          <li class="item">요구사항 상세</li>
          <li class="item">프로세스 기획</li>
          <li class="item">웹 기획</li>
          <li class="section">게시판</li>
          <li class="item active">Q&A</li>
        </ul>
        <div class="recent-box">
          <div class="recent-header">
            <span>최근 사용 메뉴</span>
            <button type="button" @click="onClearRecent">✕</button>
          </div>
          <div class="chips">
            <button v-for="chip in recentMenus" :key="chip" class="chip" type="button" @click="onClickRecent(chip)">
              {{ chip }}
            </button>
          </div>
        </div>
      </div>
    </aside>

    <main class="content" :class="{ full: !uiStore.sidebarOpen }">
      <div class="mdi-bar">
        <div class="mdi-left">
          <button v-for="mdi in openedMenus" :key="mdi" class="mdi-chip" type="button" @click="onClickMdi(mdi)">
            {{ mdi }}
          </button>
        </div>
        <div class="mdi-right">
          <button class="ghost-icon" type="button" @click="onMdiPrev">◀</button>
          <button class="ghost-icon" type="button" @click="onMdiNext">▶</button>
          <button class="ghost-icon" type="button" @click="onMdiClose">✕</button>
        </div>
      </div>

      <section class="page-header">
        <p class="breadcrumb">BreadCrumb > BreadCrumb > BreadCrumb</p>
        <div class="title-line">
          <h2>Q&A</h2>
          <div class="title-actions">
            <button type="button" class="ghost-icon" @click="onStar">☆</button>
            <button type="button" class="ghost-icon" @click="onRefresh">↻</button>
          </div>
        </div>
      </section>

      <section class="search-panel">
        <form class="search-grid" @submit.prevent="onSearch">
          <label class="field">
            <span>구분</span>
            <select v-model="filters.category">
              <option value="">선택</option>
              <option value="기타문의">기타문의</option>
              <option value="계정">계정</option>
              <option value="이용방법">이용방법</option>
            </select>
          </label>
          <label class="field">
            <span>제목</span>
            <input v-model="filters.title" type="text" placeholder="제목" />
          </label>
          <label class="field">
            <span>작성일</span>
            <div class="date-range">
              <input v-model="filters.startDate" type="text" placeholder="YYYY-MM-DD" />
              <span>→</span>
              <input v-model="filters.endDate" type="text" placeholder="YYYY-MM-DD" />
            </div>
          </label>
          <label class="field">
            <span>작성자</span>
            <input v-model="filters.author" type="text" placeholder="입력" />
          </label>
          <button class="search-btn" type="submit">조회</button>
        </form>
      </section>

      <section class="list-wrap">
        <div class="list-head">
          <h3>목록</h3>
          <p>총 <b>{{ filteredRows.length }}</b></p>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>NO</th>
                <th>구분</th>
                <th>제목</th>
                <th>작성일시</th>
                <th>작성자</th>
                <th>처리 상태</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pagedRows" :key="row.no" :class="{ alt: row.highlight }" @click="onRowClick(row.no)">
                <td>{{ row.no }}</td>
                <td>{{ row.category }}</td>
                <td>{{ row.title }}</td>
                <td>{{ row.createdAt }}</td>
                <td class="author">{{ row.author }} <span class="team">| {{ row.team }}</span></td>
                <td>
                  <span class="badge" :class="row.status === '답변대기' ? 'wait' : 'done'">{{ row.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button type="button" @click="onMovePage(1)">«</button>
          <button type="button" @click="onMovePage(Math.max(1, uiStore.currentPage - 1))">‹</button>
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            :class="{ active: page === uiStore.currentPage }"
            @click="onMovePage(page)"
          >
            {{ page }}
          </button>
          <button type="button" @click="onMovePage(Math.min(totalPages, uiStore.currentPage + 1))">›</button>
          <button type="button" @click="onMovePage(totalPages)">»</button>
          <div class="page-input">{{ uiStore.currentPage }}/{{ totalPages }}</div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

type QnaStatus = '답변대기' | '답변완료';

interface QnaRow {
  no: number;
  category: string;
  title: string;
  createdAt: string;
  author: string;
  team: string;
  status: QnaStatus;
  highlight?: boolean;
}

const useQnaUiStore = defineStore('qna-ui', {
  state: () => ({
    sidebarOpen: true,
    currentPage: 1,
    pageSize: 10,
  }),
  actions: {
    setPage(page: number) {
      this.currentPage = page;
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
  },
});

const router = useRouter();
const uiStore = useQnaUiStore();
const { currentPage } = storeToRefs(uiStore);

const filters = reactive({
  category: '',
  title: '',
  startDate: '',
  endDate: '',
  author: '',
});

const menuKeyword = ref('');
const gnbItems = ['기획', '분석/설계', '개발', '테스트', '빌드/배포', '게시판'];
const recentMenus = ref(['요구사항', '요구사항 상세', '프로세스 기획']);
const openedMenus = ref(['Q&A', '요구사항 상세', '프로세스 기획', '웹 기획', '업무(L3) 설계', '기능(L4) 설계']);

const rows = ref<QnaRow[]>([
  { no: 20, category: '기타문의', title: 'Q&A 문의 01', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변대기' },
  { no: 19, category: '계정', title: 'Q&A 문의 02 [2]', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변대기', highlight: true },
  { no: 18, category: '이용방법', title: 'Q&A 문의 03 [1]', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
  { no: 17, category: '기타문의', title: 'Q&A 문의 04 [2]', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
  { no: 16, category: '기타문의', title: 'Q&A 문의 05', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
  { no: 15, category: '기타문의', title: 'Q&A 문의 06 [2]', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
  { no: 14, category: '기타문의', title: 'Q&A 문의 07 [3]', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
  { no: 13, category: '기타문의', title: 'Q&A 문의 08', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
  { no: 12, category: '기타문의', title: 'Q&A 문의 09', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
  { no: 11, category: '기타문의', title: 'Q&A 문의 10', createdAt: '2025-08-09 12:00', author: '홍길동(p123456)', team: 'NOVA추진팀', status: '답변완료' },
]);

const filteredRows = computed(() => {
  return rows.value.filter((row) => {
    const matchCategory = !filters.category || row.category === filters.category;
    const matchTitle = !filters.title || row.title.includes(filters.title);
    const matchAuthor = !filters.author || row.author.includes(filters.author);
    return matchCategory && matchTitle && matchAuthor;
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / uiStore.pageSize)));

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * uiStore.pageSize;
  return filteredRows.value.slice(start, start + uiStore.pageSize);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const end = Math.min(totalPages.value, 10);
  for (let i = 1; i <= end; i += 1) pages.push(i);
  return pages;
});

function onSearch(): void {
  uiStore.setPage(1);
}

function onMenuSearch(): void {
  // Placeholder for menu filtering side effects.
}

function onMovePage(page: number): void {
  uiStore.setPage(page);
}

function onRowClick(no: number): void {
  router.push({ name: 'qna-detail', query: { no: String(no) } }).catch(() => undefined);
}

function onClickGnb(item: string): void {
  if (!openedMenus.value.includes(item)) openedMenus.value.push(item);
}

function onClickMdi(item: string): void {
  void item;
}

function onMdiPrev(): void {}
function onMdiNext(): void {}
function onMdiClose(): void {}
function onStar(): void {}
function onRefresh(): void {}
function onClickNotification(): void {}

function onClearRecent(): void {
  recentMenus.value = [];
}

function onClickRecent(chip: string): void {
  if (!openedMenus.value.includes(chip)) openedMenus.value.push(chip);
}

function onToggleMenu(): void {
  uiStore.toggleSidebar();
}
</script>

<style scoped>
.qna-nova {
  width: 100%;
  min-width: 1280px;
  min-height: 100vh;
  background: #f5f5f5;
  color: #222;
  font-family: Pretendard, sans-serif;
}

.gnb {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dde2e8;
  background: #fff;
  padding: 0 30px 0 16px;
}

.gnb-left,
.gnb-right,
.logo-wrap,
.gnb-nav,
.user-meta {
  display: flex;
  align-items: center;
}

.logo-wrap {
  gap: 12px;
  margin-right: 16px;
}

.logo {
  margin: 0;
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
}

.gnb-nav {
  gap: 70px;
}

.gnb-item {
  border: 0;
  background: transparent;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
}

.gnb-right {
  gap: 20px;
}

.v-divider {
  width: 1px;
  height: 24px;
  background: #ddd;
}

.user-meta {
  gap: 8px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #666;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name,
.user-team {
  margin: 0;
}

.user-name {
  font-size: 14px;
  line-height: 17px;
  color: #666;
}

.user-team {
  font-size: 13px;
  line-height: 16px;
  color: #999;
}

.ghost-icon {
  border: 1px solid #d9d7e7;
  background: #fff;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
}

.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  width: 240px;
  height: calc(100vh - 64px);
  background: #fff;
  border-right: 1px solid #dde2e8;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sidebar-inner {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.menu-search input {
  width: 100%;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 0 8px;
}

.menu-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tab {
  width: 104px;
  height: 33px;
  border: 0;
  background: #fff;
  color: #999;
  font-weight: 600;
}

.tab.active {
  color: #000;
  border-bottom: 3px solid #000;
}

.menu-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section {
  font-size: 12px;
  color: #999;
  margin-top: 12px;
}

.item {
  height: 36px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.item.active {
  background: #666;
  color: #fff;
}

.recent-box {
  border-radius: 10px;
  background: #f5f5f5;
  padding: 12px 16px;
}

.recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.recent-header button {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border: 0;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  background: #fff;
  color: #666;
}

.content {
  margin-left: 240px;
  width: calc(100% - 240px);
}

.content.full {
  margin-left: 0;
  width: 100%;
}

.mdi-bar {
  height: 40px;
  border: 1px solid #ddd;
  border-top: 0;
  background: #fff;
  margin: 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
}

.mdi-left {
  display: flex;
  gap: 4px;
}

.mdi-right {
  display: flex;
  gap: 12px;
}

.mdi-chip {
  border: 0;
  border-radius: 999px;
  background: #eee;
  color: #666;
  height: 28px;
  padding: 0 12px;
  font-size: 13px;
}

.mdi-chip:first-child {
  background: #000;
  color: #fff;
}

.page-header {
  margin: 0;
  background: #fff;
  height: 136px;
  padding: 40px 30px 10px;
}

.breadcrumb {
  margin: 0;
  font-size: 13px;
  line-height: 22px;
  color: #666;
}

.title-line {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-line h2 {
  margin: 0;
  font-size: 28px;
  line-height: 34px;
  font-weight: 700;
}

.title-actions {
  display: flex;
  gap: 5px;
}

.search-panel,
.list-wrap {
  margin-left: 30px;
  margin-right: 30px;
}

.search-panel {
  margin-top: 19px;
  background: #fff;
  border-radius: 8px;
  padding: 14px 20px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(220px, 1fr)) auto;
  gap: 30px;
  align-items: center;
}

.field {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 2px;
}

.field span {
  font-size: 13px;
  font-weight: 700;
}

.field input,
.field select {
  height: 36px;
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 0 12px;
  font-size: 14px;
}

.date-range {
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
}

.date-range input {
  border: 0;
  padding: 0;
  height: 28px;
}

.search-btn {
  width: 81px;
  height: 36px;
  border: 0;
  border-radius: 6px;
  background: #222;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.list-wrap {
  margin-top: 10px;
  background: #fff;
  padding: 16px 20px 24px;
}

.list-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.list-head h3,
.list-head p {
  margin: 0;
}

.list-head h3 {
  font-size: 14px;
  font-weight: 700;
}

.list-head p {
  font-size: 13px;
  color: #999;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid #ddd7e7;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  border: 1px solid #d9d7e7;
  font-size: 14px;
  line-height: 20px;
  color: #222;
  height: 42px;
  padding: 0 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

th {
  background: #f1f1f1;
  font-weight: 400;
  text-align: center;
}

td:nth-child(1) {
  width: 40px;
  text-align: center;
}

td:nth-child(2) {
  width: 126px;
  text-align: center;
}

td:nth-child(3) {
  width: auto;
}

td:nth-child(4) {
  width: 180px;
  text-align: center;
}

td:nth-child(5) {
  width: 190px;
}

td:nth-child(6) {
  width: 100px;
  text-align: center;
}

tr.alt td {
  background: #eeefff;
}

.author {
  font-size: 13px;
  font-weight: 600;
}

.team {
  color: #666;
  font-weight: 500;
  font-size: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  height: 22px;
  border-radius: 50px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 500;
}

.badge.wait {
  border: 1px solid #ff9d9e;
  background: #ffeeee;
  color: #ff4d4f;
}

.badge.done {
  border: 1px solid #c8c8cf;
  background: #f5f5f7;
  color: #9a9aa7;
}

.pagination {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.pagination button {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  color: #5b5b6b;
}

.pagination button.active {
  background: #000;
  color: #fff;
}

.page-input {
  margin-left: 22px;
  width: 87px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #5b5b6b;
}

@media (max-width: 1600px) {
  .search-grid {
    grid-template-columns: 1fr 1fr;
  }

  .search-btn {
    width: 100%;
  }
}
</style>
