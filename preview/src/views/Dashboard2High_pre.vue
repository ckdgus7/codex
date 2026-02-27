<template>
  <div class="dashboard2-high" data-screen="dashboard-base" data-node-id="1:43351">
    <aside class="sidebar" data-node-id="1:43619" aria-label="SideBar">
      <div class="sidebar-bg"></div>
      <img class="sidebar-pattern" :src="sidebarPattern" alt="" aria-hidden="true" data-node-id="I1:43619;1:288" />

      <div class="sidebar-top" data-node-id="I1:43619;1:290">
        <div class="brand" data-node-id="I1:43619;1:291">
          <div class="brand-mark" aria-hidden="true"></div>
          <div class="brand-text">FORCE</div>
        </div>
      </div>

      <div class="sidebar-links" data-node-id="I1:43619;1:294">
        <button class="link-group" type="button">Configuration</button>
        <div class="sub-links" data-node-id="I1:43619;1:303">
          <button class="sub-link" type="button">Utilisateurs</button>
          <button class="sub-link active" type="button">Base</button>
          <button class="sub-link" type="button">Controle</button>
          <button class="sub-link" type="button">Workflow</button>
          <button class="sub-link" type="button">Alertes</button>
          <button class="sub-link" type="button">Roles</button>
          <button class="sub-link" type="button">Preferences</button>
          <button class="sub-link" type="button">Calendrier</button>
        </div>
      </div>

      <div class="sidebar-footer" data-node-id="I1:43619;1:349">
        <img class="avatar" :src="avatar" alt="Tim Cook" data-node-id="I1:43619;1:350" />
        <div class="identity">Tim Cook<br />timcook@force.com</div>
      </div>
    </aside>

    <div class="topbar" data-node-id="1:43352">
      <div class="crumb" data-node-id="1:43358">Base</div>
      <button class="notif" type="button" aria-label="Notifications" @click="() => onNotificationClick()" data-node-id="1:43359">
        <span class="bell"></span>
      </button>
    </div>

    <main class="canvas">
      <h1 class="title" data-node-id="1:43362">Base</h1>

      <section class="card countries" data-node-id="1:43363">
        <div class="card-head" data-node-id="1:43375">
          <h2 data-node-id="1:43376">Liste des pays</h2>
          <button class="btn-primary" type="button" @click="() => onAddCountry()" data-node-id="1:43377">
            Ajouter
            <span class="plus" aria-hidden="true"></span>
          </button>
        </div>

        <form class="search" data-node-id="1:43365" @submit.prevent="() => onCountrySearchSubmit()">
          <span class="search-icon" aria-hidden="true"></span>
          <input
            v-model="countrySearch"
            type="search"
            placeholder="Vous cherchez un pays ..."
            aria-label="Vous cherchez un pays"
          />
        </form>

        <div class="table-head cols-4" data-node-id="1:43370">
          <span data-node-id="1:43371">Libelle</span>
          <span data-node-id="1:43372">Code ISO</span>
          <span data-node-id="1:43373">Description</span>
          <span data-node-id="1:43374">Actions</span>
        </div>

        <div class="rows" data-node-id="1:43382">
          <div v-for="row in filteredCountries" :key="row.iso" class="row cols-4">
            <span>{{ row.label }}</span>
            <span>{{ row.iso }}</span>
            <span>{{ row.description }}</span>
            <div class="actions">
              <button class="btn-outline" type="button" @click="() => onEdit('country', row.label)">Modifier</button>
              <button class="btn-danger" type="button" @click="() => onDelete('country', row.label)">Supprimer</button>
            </div>
          </div>
        </div>

        <div class="card-foot" data-node-id="1:43411">
          <span class="summary" data-node-id="1:43412">{{ countrySummary }}</span>

          <div class="pager-detailed" data-node-id="1:43413">
            <button class="page-edge" type="button" aria-label="Page precedente" @click="() => setCountryPage(Math.max(1, status.countryPage - 1))">&lsaquo;</button>
            <button class="page mid active" type="button" @click="() => setCountryPage(1)">1</button>
            <span class="divider"></span>
            <button class="page mid" type="button" @click="() => setCountryPage(2)">2</button>
            <span class="divider"></span>
            <button class="page mid" type="button" @click="() => setCountryPage(3)">3</button>
            <span class="divider"></span>
            <button class="page mid" type="button" @click="() => setCountryPage(4)">...</button>
            <span class="divider"></span>
            <button class="page mid" type="button" @click="() => setCountryPage(8)">8</button>
            <span class="divider"></span>
            <button class="page mid" type="button" @click="() => setCountryPage(9)">9</button>
            <span class="divider"></span>
            <button class="page mid" type="button" @click="() => setCountryPage(10)">10</button>
            <button class="page-edge" type="button" aria-label="Page suivante" @click="() => setCountryPage(status.countryPage + 1)">&rsaquo;</button>
          </div>
        </div>
      </section>

      <section class="card mini left" data-node-id="1:43429">
        <div class="mini-head" data-node-id="1:43440">
          <h3>Liste des villes</h3>
          <button class="btn-primary" type="button" @click="() => onCreate('city')">Ajouter <span class="plus"></span></button>
        </div>
        <form class="search mini-search" data-node-id="1:43435" @submit.prevent="() => onMiniSearch('city')">
          <span class="search-icon" aria-hidden="true"></span>
          <input v-model="citySearch" type="search" placeholder="Vous cherchez une ville ..." aria-label="Vous cherchez une ville" />
        </form>
        <div class="table-head cols-3" data-node-id="1:43431">
          <span>Libelle</span><span>Description</span><span>Actions</span>
        </div>
        <div class="rows rows-mini" data-node-id="1:43443">
          <div v-for="row in filteredCities" :key="`city-${row.label}`" class="row cols-3">
            <span>{{ row.label }}</span><span>{{ row.description }}</span>
            <div class="actions">
              <button class="btn-outline small" type="button" @click="() => onEdit('city', row.label)">Modifier</button>
              <button class="btn-danger small" type="button" @click="() => onDelete('city', row.label)">Supprimer</button>
            </div>
          </div>
        </div>
        <div class="mini-foot">
          <span class="summary">{{ citySummary }}</span>
          <div class="simple-pager">
            <button class="ghost" type="button" @click="() => onPrev('city')">Precedent</button>
            <button class="ghost" type="button" @click="() => onNext('city')">Suivant</button>
          </div>
        </div>
      </section>

      <section class="card mini right" data-node-id="1:43542">
        <div class="mini-head" data-node-id="1:43553">
          <h3>Liste des methodes d'evaluation</h3>
          <button class="btn-primary" type="button" @click="() => onCreate('method')">Ajouter <span class="plus"></span></button>
        </div>
        <form class="search mini-search" data-node-id="1:43548" @submit.prevent="() => onMiniSearch('method')">
          <span class="search-icon" aria-hidden="true"></span>
          <input
            v-model="methodSearch"
            type="search"
            placeholder="Vous cherchez une methode d'evaluation ..."
            aria-label="Vous cherchez une methode d'evaluation"
          />
        </form>
        <div class="table-head cols-3" data-node-id="1:43544">
          <span>Libelle</span><span>Description</span><span>Actions</span>
        </div>
        <div class="rows rows-mini" data-node-id="1:43556">
          <div v-for="row in filteredMethods" :key="`method-${row.label}`" class="row cols-3">
            <span>{{ row.label }}</span><span>{{ row.description }}</span>
            <div class="actions">
              <button class="btn-outline small" type="button" @click="() => onEdit('method', row.label)">Modifier</button>
              <button class="btn-danger small" type="button" @click="() => onDelete('method', row.label)">Supprimer</button>
            </div>
          </div>
        </div>
        <div class="mini-foot">
          <span class="summary">{{ methodSummary }}</span>
          <div class="simple-pager">
            <button class="ghost" type="button" @click="() => onPrev('method')">Precedent</button>
            <button class="ghost" type="button" @click="() => onNext('method')">Suivant</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

type CountryRow = { label: string; iso: string; description: string };
type SimpleRow = { label: string; description: string };
type MiniKey = 'city' | 'method';

const useDashboard2HighStore = defineStore('dashboard2HighStatus', () => {
  const countryPage = ref(1);
  const cityPage = ref(1);
  const methodPage = ref(1);
  return { countryPage, cityPage, methodPage };
});

const status = useDashboard2HighStore();
const router = useRouter();

const sidebarPattern = './assets/I1_43619_1_288.png';
const avatar = './assets/I1_43619_1_350.png';

const countrySearch = ref('');
const citySearch = ref('');
const methodSearch = ref('');

const countries = ref<CountryRow[]>([
  { label: 'Tortor.', iso: 'CMR', description: 'alexander.foley@gmail.com' },
  { label: 'Gabon', iso: 'GAB', description: 'alexander.foley@gmail.com' }
]);

const cities = ref<SimpleRow[]>([
  { label: 'Tellus.', description: 'Libero scelerisque massa quis mauris nisl.' },
  { label: 'Kribi', description: '.' },
  { label: 'Libreville', description: '.' },
  { label: 'Yagoua', description: '.' },
  { label: 'Yaounde', description: '.' }
]);

const methods = ref<SimpleRow[]>([{ label: 'SWOT', description: '.' }]);

const filteredCountries = computed(() => {
  const q = countrySearch.value.trim().toLowerCase();
  if (!q) return countries.value;
  return countries.value.filter((r) => [r.label, r.iso, r.description].some((v) => v.toLowerCase().includes(q)));
});

const filteredCities = computed(() => filterSimpleRows(cities.value, citySearch.value));
const filteredMethods = computed(() => filterSimpleRows(methods.value, methodSearch.value));

const countrySummary = computed(() => `${String(filteredCountries.value.length).padStart(2, '0')} pays`);
const citySummary = computed(() => `${String(filteredCities.value.length).padStart(2, '0')} villes`);
const methodSummary = computed(() => `${String(filteredMethods.value.length).padStart(2, '0')} Methode`);

function filterSimpleRows(rows: SimpleRow[], query: string): SimpleRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => [row.label, row.description].some((value) => value.toLowerCase().includes(q)));
}

function onNotificationClick(): void {
  void router.push({ name: 'notifications' }).catch(() => undefined);
}

function onAddCountry(): void {
  void router.push({ name: 'countries-create' }).catch(() => undefined);
}

function onCountrySearchSubmit(): void {
  status.countryPage = 1;
}

function onMiniSearch(_: MiniKey): void {
  // Form submit is intentionally handled without side effects.
}

function setCountryPage(page: number): void {
  if (page < 1) return;
  status.countryPage = page;
}

function onCreate(scope: MiniKey): void {
  void router.push({ name: `${scope}-create` }).catch(() => undefined);
}

function onEdit(scope: string, id: string): void {
  void router.push({ name: `${scope}-edit`, query: { id, screen: 'dashboard2-high' } }).catch(() => undefined);
}

function onDelete(scope: string, id: string): void {
  console.info('delete-action', { scope, id, page: status.countryPage });
}

function onPrev(scope: MiniKey): void {
  if (scope === 'city') status.cityPage = Math.max(1, status.cityPage - 1);
  if (scope === 'method') status.methodPage = Math.max(1, status.methodPage - 1);
}

function onNext(scope: MiniKey): void {
  if (scope === 'city') status.cityPage += 1;
  if (scope === 'method') status.methodPage += 1;
}
</script>

<style scoped>
.dashboard2-high {
  position: relative;
  width: 1440px;
  height: 1024px;
  overflow: hidden;
  background: #fafafa;
  font-family: Inter, sans-serif;
  color: #27272a;
}

.sidebar {
  position: absolute;
  inset: 0 auto 0 0;
  width: 256px;
  background: #4658ac;
}

.sidebar-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #131b55 0%, rgba(19, 27, 85, 0.35) 62%, rgba(19, 27, 85, 0) 100%);
}

.sidebar-pattern {
  position: absolute;
  inset: 0;
  width: 256px;
  height: 1024px;
  object-fit: cover;
  opacity: 0.25;
}

.sidebar-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 256px;
  height: 64px;
  background: #101b6b;
  display: grid;
  place-items: center;
}

.brand {
  width: 143px;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 33px;
  height: 30px;
  border-radius: 8px;
  background: #8da2fb;
}

.brand-text {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 22px;
  color: #fff;
}

.sidebar-links {
  position: absolute;
  left: 20px;
  top: 96px;
  width: 216px;
}

.link-group {
  all: unset;
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 19px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  margin-bottom: 12px;
}

.sub-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-link {
  all: unset;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: 36px;
  width: 216px;
  height: 19px;
  color: #fff;
  font-size: 16px;
  line-height: 19px;
}

.sub-link.active {
  height: 35px;
  border-radius: 8px;
  background: #4256d0;
  font-weight: 400;
}

.sidebar-footer {
  position: absolute;
  left: 20px;
  bottom: 128px;
  width: 205px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  object-fit: cover;
}

.identity {
  color: #fff;
  font-size: 16px;
  line-height: 18px;
  white-space: pre-line;
}

.topbar {
  position: absolute;
  left: 256px;
  top: 0;
  width: 1184px;
  height: 80px;
  background: #fff;
}

.crumb {
  position: absolute;
  left: 40px;
  top: 28px;
  color: #4658ac;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.notif {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  right: 40px;
  top: 30px;
  width: 18px;
  height: 20px;
  cursor: pointer;
}

.bell {
  position: absolute;
  left: 0;
  top: 0;
  width: 18px;
  height: 15px;
  border: 2px solid #000;
  border-bottom: 0;
  border-radius: 9px 9px 0 0;
}

.bell::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 17px;
  width: 4px;
  height: 1px;
  background: #000;
}

.canvas {
  position: absolute;
  left: 256px;
  top: 80px;
  width: 1184px;
  height: 944px;
}

.title {
  position: absolute;
  left: 40px;
  top: 20px;
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 38.73px;
  color: #000;
}

.card {
  background: #fff;
  border-radius: 12px;
}

.countries {
  position: absolute;
  left: 40px;
  top: 71px;
  width: 1104px;
  height: 389px;
  padding: 32px;
  box-sizing: border-box;
}

.card-head {
  height: 33px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-head h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  line-height: 22px;
  color: #27272a;
}

.btn-primary {
  all: unset;
  box-sizing: border-box;
  height: 33px;
  border-radius: 10px;
  padding: 8px;
  background: #4763e4;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.plus {
  width: 10px;
  height: 10px;
  position: relative;
  display: inline-block;
}

.plus::before,
.plus::after {
  content: '';
  position: absolute;
  background: #fff;
}

.plus::before {
  left: 4px;
  top: 0;
  width: 2px;
  height: 10px;
}

.plus::after {
  left: 0;
  top: 4px;
  width: 10px;
  height: 2px;
}

.search {
  margin-top: 18px;
  width: 1040px;
  height: 41px;
  border: 1px solid rgba(71, 99, 228, 0.5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  box-sizing: border-box;
}

.search-icon {
  width: 16px;
  height: 16px;
  border: 2px solid #18181b;
  border-radius: 50%;
  position: relative;
  flex: none;
}

.search-icon::after {
  content: '';
  position: absolute;
  right: -4px;
  bottom: -2px;
  width: 4px;
  height: 2px;
  background: #18181b;
  transform: rotate(45deg);
}

.search input {
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 14px;
  line-height: 16.94px;
  color: #a1a1aa;
}

.table-head {
  margin-top: 20px;
  color: #a1a1aa;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
}

.cols-4 {
  display: grid;
  grid-template-columns: 254px 254px 254px 254px;
  gap: 8px;
}

.cols-3 {
  display: grid;
  grid-template-columns: 156px 156px 156px;
  gap: 8px;
}

.rows {
  margin-top: 20px;
}

.row {
  min-height: 44px;
  display: grid;
  align-items: center;
  border-bottom: 1px solid #f4f4f5;
  font-size: 14px;
  line-height: 16.94px;
  color: #27272a;
}

.actions {
  display: flex;
  gap: 4px;
}

.btn-outline,
.btn-danger {
  all: unset;
  box-sizing: border-box;
  width: 125px;
  height: 31px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 14.52px;
  text-align: center;
  cursor: pointer;
}

.btn-outline.small,
.btn-danger.small {
  width: 76px;
  border-radius: 8px;
}

.btn-outline {
  border: 1px solid #5c73db;
  color: #5c73db;
}

.btn-danger {
  background: #dc2626;
  color: #fff;
}

.card-foot {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary {
  font-size: 16px;
  line-height: 24px;
  color: #4763e4;
}

.pager-detailed {
  width: 373px;
  height: 38px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.page-edge,
.page.mid {
  all: unset;
  box-sizing: border-box;
  height: 38px;
  display: grid;
  place-items: center;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

.page-edge {
  width: 36px;
  color: #71717a;
  background: #fff;
}

.page.mid {
  min-width: 39px;
  padding: 0 16px;
  color: #27272a;
  background: #fff;
}

.page.mid.active {
  background: #4763e4;
  color: #fff;
}

.divider {
  width: 1px;
  height: 38px;
  background: #d4d4d8;
}

.mini {
  position: absolute;
  top: 480px;
  width: 548px;
  height: 515px;
  padding: 32px;
  box-sizing: border-box;
}

.mini.left {
  left: 40px;
}

.mini.right {
  left: 596px;
}

.mini-head {
  height: 33px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mini-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 19.36px;
  color: #27272a;
}

.mini-search {
  width: 484px;
}

.rows-mini {
  min-height: 266px;
}

.mini-foot {
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.simple-pager {
  display: flex;
  gap: 4px;
}

.ghost {
  all: unset;
  box-sizing: border-box;
  height: 38px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  padding: 8px 12px;
  background: #fff;
  color: #27272a;
  font-size: 12px;
  line-height: 16px;
  cursor: pointer;
}
</style>

