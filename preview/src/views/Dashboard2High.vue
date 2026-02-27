<template>
  <div class="dashboard2-high">
    <aside class="sidebar" aria-label="Navigation principale">
      <div class="sidebar-bg-pattern" aria-hidden="true">
        <img src="./assets/I1_43619_1_288.png" alt="" />
      </div>

      <header class="sidebar-header">
        <div class="logo-wrap">
          <span class="logo-mark" aria-hidden="true"></span>
          <span class="logo-type">Logipulse</span>
        </div>
      </header>

      <div class="sidebar-body">
        <div class="nav-group">
          <button class="nav-title" type="button" @click="() => toggleConfigOpen()">
            <span class="title-left">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="8" cy="8" r="2.2" />
                <path d="M8 1.2v2.2M8 12.6v2.2M1.2 8h2.2M12.6 8h2.2M3.2 3.2l1.55 1.55M11.25 11.25l1.55 1.55M12.8 3.2l-1.55 1.55M4.75 11.25L3.2 12.8" />
              </svg>
              <span>Configuration</span>
            </span>
            <svg class="title-chevron" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M1 1l7 8 7-8" />
            </svg>
          </button>

          <div v-if="status.configOpen" class="nav-subgroup">
            <button class="nav-subitem" :class="{ active: status.activeSection === 'base' }" type="button" @click="() => setActiveSection('base')">Base</button>
            <button class="nav-subitem" :class="{ active: status.activeSection === 'control' }" type="button" @click="() => setActiveSection('control')">Contrôle</button>
            <button class="nav-subitem" :class="{ active: status.activeSection === 'workflow' }" type="button" @click="() => setActiveSection('workflow')">Workflow</button>
            <button class="nav-subitem" :class="{ active: status.activeSection === 'alertes' }" type="button" @click="() => setActiveSection('alertes')">Alertes</button>
            <button class="nav-subitem" :class="{ active: status.activeSection === 'roles' }" type="button" @click="() => setActiveSection('roles')">Rôles</button>
            <button class="nav-subitem" :class="{ active: status.activeSection === 'preferences' }" type="button" @click="() => setActiveSection('preferences')">Préférences</button>
            <button class="nav-subitem" :class="{ active: status.activeSection === 'calendar' }" type="button" @click="() => setActiveSection('calendar')">Calendrier</button>
          </div>
        </div>

        <div class="nav-group muted">
          <button class="nav-title" type="button">
            <span class="title-left">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="1.5" y="2" width="13" height="11" rx="1.8" />
                <path d="M5 13.7h6" />
              </svg>
              <span>Dossier</span>
            </span>
            <svg class="title-chevron" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M1 1l7 8 7-8" />
            </svg>
          </button>

          <button class="nav-title" type="button">
            <span class="title-left">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 1.6h8a2 2 0 0 1 2 2v10.8H4a2 2 0 0 1-2-2Z" />
                <path d="M10 1.6v3.2h3.2" />
                <path d="M5.2 8h4.2M5.2 10.6h4.2M5.2 5.4h1" />
              </svg>
              <span>Projet</span>
            </span>
            <svg class="title-chevron" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M1 1l7 8 7-8" />
            </svg>
          </button>

          <button class="nav-title" type="button">
            <span class="title-left">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect x="1.5" y="2" width="13" height="8.8" rx="1.6" />
                <path d="M5.2 11v3.4h5.6V11" />
              </svg>
              <span>Direction Technique</span>
            </span>
            <svg class="title-chevron" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M1 1l7 8 7-8" />
            </svg>
          </button>

          <button class="nav-title" type="button">
            <span class="title-left">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2.2 8.5l5.6-6 5.6 6v5H2.2Z" />
                <path d="M6.2 8.6h3.6" />
              </svg>
              <span>Protection</span>
            </span>
            <svg class="title-chevron" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M1 1l7 8 7-8" />
            </svg>
          </button>
        </div>
      </div>

      <footer class="sidebar-user">
        <img src="./assets/I1_43619_1_350.png" alt="Avatar Tim Cook" class="avatar" />
        <div class="user-copy">
          <p class="name">Tim Cook</p>
          <p class="mail">timcook@force.com</p>
        </div>
      </footer>

      <div class="hidden-asset" aria-hidden="true">
        <img src="./assets/I1_43619_1_355_377_1605_1_43320.png" alt="" />
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <button type="button" class="crumb-link active" @click="() => navigateToBase()">Base</button>

        <button class="bell" type="button" aria-label="Notifications" @click="() => openNotifications()">
          <svg viewBox="0 0 18 20" aria-hidden="true">
            <path d="M9 1c-3.87 0-7 3.13-7 7v5.2l-2 1.8h18l-2-1.8V8c0-3.87-3.13-7-7-7Z" />
            <path d="M7.3 19a1.7 1.7 0 0 0 3.4 0" />
          </svg>
        </button>
      </header>

      <section class="content-zone">
        <h1 class="page-title">Base</h1>

        <section class="panel panel-large" aria-label="Liste des pays">
          <div class="panel-header">
            <h2>Liste des pays</h2>
            <button class="btn-create" type="button" @click="() => handleCreateCountry()">
              Ajouter
              <span class="plus">+</span>
            </button>
          </div>

          <form class="search" @submit.prevent="() => applyCountrySearch()">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="5.4" />
              <path d="M11.2 11.2L15 15" />
            </svg>
            <input
              v-model.trim="countryQuery"
              type="search"
              placeholder="Vous cherchez un pays ..."
              autocomplete="off"
            />
          </form>

          <div class="table-head cols-4">
            <span>Libellé</span>
            <span>Code ISO</span>
            <span>Description</span>
            <span>Actions</span>
          </div>

          <div class="rows rows-large">
            <article v-for="row in filteredCountryRows" :key="row.label" class="row cols-4">
              <span>{{ row.label }}</span>
              <span>{{ row.iso }}</span>
              <span>{{ row.description }}</span>
              <span class="actions">
                <button class="btn-outline" type="button" @click="() => handleEditCountry(row.label)">Modifier</button>
                <button class="btn-danger" type="button" @click="() => handleDeleteCountry(row.label)">Supprimer</button>
              </span>
            </article>
          </div>

          <footer class="panel-footer">
            <p>02 pays</p>

            <div class="pagination-pill" aria-label="Pagination pays">
              <button class="pill-cell icon" type="button" @click="() => moveCountryPage(-1)">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.8 7.2 10l5.3 5.2" /></svg>
              </button>
              <button class="pill-cell active" type="button" @click="() => setCountryPage(1)">1</button>
              <span class="divider"></span>
              <button class="pill-cell" type="button" @click="() => setCountryPage(2)">2</button>
              <span class="divider"></span>
              <button class="pill-cell" type="button" @click="() => setCountryPage(3)">3</button>
              <span class="divider"></span>
              <button class="pill-cell" type="button" @click="() => setCountryPage(0)">...</button>
              <span class="divider"></span>
              <button class="pill-cell" type="button" @click="() => setCountryPage(8)">8</button>
              <span class="divider"></span>
              <button class="pill-cell" type="button" @click="() => setCountryPage(9)">9</button>
              <span class="divider"></span>
              <button class="pill-cell" type="button" @click="() => setCountryPage(10)">10</button>
              <button class="pill-cell icon" type="button" @click="() => moveCountryPage(1)">
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.8 5.3 5.2-5.3 5.2" /></svg>
              </button>
            </div>
          </footer>
        </section>

        <section class="cards-grid">
          <section class="panel panel-small" aria-label="Liste des villes">
            <div class="panel-header small-header">
              <h3>Liste des villes</h3>
              <button class="btn-create" type="button" @click="() => handleCreateCity()">
                Ajouter
                <span class="plus">+</span>
              </button>
            </div>

            <form class="search" @submit.prevent="() => applyCitySearch()">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.4" />
                <path d="M11.2 11.2L15 15" />
              </svg>
              <input
                v-model.trim="cityQuery"
                type="search"
                placeholder="Vous cherchez une ville ..."
                autocomplete="off"
              />
            </form>

            <div class="table-head cols-3">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="rows rows-small">
              <article v-for="row in filteredCityRows" :key="row.label" class="row cols-3 compact">
                <span>{{ row.label }}</span>
                <span>{{ row.description }}</span>
                <span class="actions compact-actions">
                  <button class="btn-outline mini" type="button" @click="() => handleEditCity(row.label)">Modifier</button>
                  <button class="btn-danger mini" type="button" @click="() => handleDeleteCity(row.label)">Supprimer</button>
                </span>
              </article>
            </div>

            <footer class="panel-footer">
              <p>07 villes</p>
              <div class="mini-pager">
                <button type="button" @click="() => moveCityPage(-1)">Précedent</button>
                <button type="button" @click="() => moveCityPage(1)">Suivant</button>
              </div>
            </footer>
          </section>

          <section class="panel panel-small" aria-label="Liste des méthodes d'évaluation">
            <div class="panel-header small-header">
              <h3>Liste des méthodes d'évaluation</h3>
              <button class="btn-create" type="button" @click="() => handleCreateMethod()">
                Ajouter
                <span class="plus">+</span>
              </button>
            </div>

            <form class="search" @submit.prevent="() => applyMethodSearch()">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.4" />
                <path d="M11.2 11.2L15 15" />
              </svg>
              <input
                v-model.trim="methodQuery"
                type="search"
                placeholder="Vous cherchez une méthode d'évaluation ..."
                autocomplete="off"
              />
            </form>

            <div class="table-head cols-3">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="rows rows-small">
              <article class="row cols-3 compact">
                <span>SWOT</span>
                <span>.</span>
                <span class="actions compact-actions">
                  <button class="btn-outline mini" type="button" @click="() => handleEditMethod('SWOT')">Modifier</button>
                  <button class="btn-danger mini" type="button" @click="() => handleDeleteMethod('SWOT')">Supprimer</button>
                </span>
              </article>
            </div>

            <footer class="panel-footer">
              <p>01 Méthode</p>
              <div class="mini-pager disabled">
                <button type="button" disabled>Précedent</button>
                <button type="button" disabled>Suivant</button>
              </div>
            </footer>
          </section>

          <section class="panel panel-small" aria-label="Liste des domaines de diligences et risques">
            <div class="panel-header small-header">
              <h3>Liste des domaines de diligences et risques</h3>
              <button class="btn-create compact-create" type="button" @click="() => handleCreateDomain()">
                Créer
                <span class="plus">+</span>
              </button>
            </div>

            <form class="search" @submit.prevent="() => applyDomainSearch()">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.4" />
                <path d="M11.2 11.2L15 15" />
              </svg>
              <input type="search" placeholder="Vous cherchez un domaine de diligences et risques ..." />
            </form>

            <div class="table-head cols-3">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <footer class="panel-footer">
              <p>Aucun domaine</p>
              <div class="mini-pager disabled">
                <button type="button" disabled>Précedent</button>
                <button type="button" disabled>Suivant</button>
              </div>
            </footer>
          </section>

          <section class="panel panel-small" aria-label="Liste des compétences">
            <div class="panel-header small-header">
              <h3>Liste des compétences</h3>
              <button class="btn-create compact-create" type="button" @click="() => handleCreateSkill()">
                Créer
                <span class="plus">+</span>
              </button>
            </div>

            <form class="search" @submit.prevent="() => applySkillSearch()">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.4" />
                <path d="M11.2 11.2L15 15" />
              </svg>
              <input type="search" placeholder="Vous cherchez une compétence ..." />
            </form>

            <div class="table-head cols-3">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <footer class="panel-footer">
              <p>Aucun domaine</p>
              <div class="mini-pager disabled">
                <button type="button" disabled>Précedent</button>
                <button type="button" disabled>Suivant</button>
              </div>
            </footer>
          </section>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

type ActiveSection = 'base' | 'control' | 'workflow' | 'alertes' | 'roles' | 'preferences' | 'calendar';

interface CountryRow {
  label: string;
  iso: string;
  description: string;
}

interface CityRow {
  label: string;
  description: string;
}

const highDetailNodeIds = ['I1:43619;1:293', '1:43413', '1:43525', '1:43602', '1:43359'] as const;

const useDashboardStatusStore = defineStore('dashboard2HighStatus', {
  state: () => ({
    activeSection: 'base' as ActiveSection,
    configOpen: true,
    countryQuery: '',
    cityQuery: '',
    methodQuery: '',
    countryPage: 1,
    cityPage: 1,
    selectedNodes: highDetailNodeIds
  })
});

const router = useRouter();
const status = useDashboardStatusStore();
const { countryQuery, cityQuery, methodQuery } = storeToRefs(status);

const countryRows = computed<CountryRow[]>(() => [
  { label: 'Tortor.', iso: 'CMR', description: 'alexander.foley@gmail.com' },
  { label: 'Gabon', iso: 'GAB', description: 'alexander.foley@gmail.com' }
]);

const cityRows = computed<CityRow[]>(() => [
  { label: 'Tellus.', description: 'Libero scelerisque massa quis mauris nisl.' },
  { label: 'Kribi', description: '.' },
  { label: 'Libreville', description: '.' },
  { label: 'Yagoua', description: '.' },
  { label: 'Yaoundé', description: '.' }
]);

const filteredCountryRows = computed(() => {
  const q = countryQuery.value.toLowerCase();
  return countryRows.value.filter((row) => row.label.toLowerCase().includes(q) || row.iso.toLowerCase().includes(q));
});

const filteredCityRows = computed(() => {
  const q = cityQuery.value.toLowerCase();
  return cityRows.value.filter((row) => row.label.toLowerCase().includes(q));
});

const toggleConfigOpen = () => {
  status.configOpen = !status.configOpen;
};

const setActiveSection = (section: ActiveSection) => {
  status.activeSection = section;
};

const navigateToBase = async () => {
  if (router.currentRoute.value.path !== '/dashboard2-high') {
    await router.push({ path: '/dashboard2-high' });
  }
};

const openNotifications = () => {
  console.info('openNotifications');
};

const applyCountrySearch = () => {
  status.countryPage = 1;
};

const applyCitySearch = () => {
  status.cityPage = 1;
};

const applyMethodSearch = () => {
  console.info('applyMethodSearch', methodQuery.value);
};

const applyDomainSearch = () => {
  console.info('applyDomainSearch');
};

const applySkillSearch = () => {
  console.info('applySkillSearch');
};

const setCountryPage = (page: number) => {
  status.countryPage = page;
};

const moveCountryPage = (delta: number) => {
  status.countryPage = Math.max(1, status.countryPage + delta);
};

const moveCityPage = (delta: number) => {
  status.cityPage = Math.max(1, status.cityPage + delta);
};

const handleCreateCountry = () => {
  console.info('handleCreateCountry');
};

const handleEditCountry = (label: string) => {
  console.info('handleEditCountry', label);
};

const handleDeleteCountry = (label: string) => {
  console.info('handleDeleteCountry', label);
};

const handleCreateCity = () => {
  console.info('handleCreateCity');
};

const handleEditCity = (label: string) => {
  console.info('handleEditCity', label);
};

const handleDeleteCity = (label: string) => {
  console.info('handleDeleteCity', label);
};

const handleCreateMethod = () => {
  console.info('handleCreateMethod');
};

const handleEditMethod = (label: string) => {
  console.info('handleEditMethod', label);
};

const handleDeleteMethod = (label: string) => {
  console.info('handleDeleteMethod', label);
};

const handleCreateDomain = () => {
  console.info('handleCreateDomain');
};

const handleCreateSkill = () => {
  console.info('handleCreateSkill');
};
</script>

<style scoped>
.dashboard2-high {
  min-height: 1024px;
  background: #fafafa;
  display: flex;
  color: #27272a;
  font-family: Inter, sans-serif;
}

.sidebar {
  width: 256px;
  min-height: 1024px;
  background: #4658ac;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-bg-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  pointer-events: none;
}

.sidebar-bg-pattern img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-header {
  height: 64px;
  background: #0e1b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: relative;
  z-index: 1;
}

.logo-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 33px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(180deg, #8ca2fb 0%, #5f74db 100%);
}

.logo-type {
  color: #fff;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0;
  font-weight: 600;
}

.sidebar-body {
  position: relative;
  z-index: 1;
  padding: 32px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-group.muted {
  opacity: 0.5;
  gap: 24px;
  margin-top: 12px;
}

.nav-title {
  border: 0;
  background: transparent;
  color: #fff;
  width: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  line-height: 19.36px;
  cursor: pointer;
}

.title-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.title-left svg {
  width: 16px;
  height: 16px;
  stroke: #fff;
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.title-chevron {
  width: 14.97px;
  height: 8.61px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-subgroup {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-subitem {
  height: 19px;
  border: 0;
  background: transparent;
  color: #fff;
  text-align: left;
  padding: 0 36px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 19.36px;
  font-weight: 400;
  cursor: pointer;
}

.nav-subitem.active {
  height: 35px;
  background: #4255d0;
  font-weight: 400;
  padding-top: 8px;
  padding-bottom: 8px;
}

.sidebar-user {
  margin-top: auto;
  position: relative;
  z-index: 1;
  padding: 0 20px 128px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-copy {
  color: #fff;
}

.user-copy p {
  margin: 0;
}

.name {
  font-size: 16px;
  line-height: 19.36px;
  font-weight: 400;
}

.mail {
  font-size: 14px;
  line-height: 16.94px;
  font-weight: 500;
}

.hidden-asset {
  display: none;
}

.workspace {
  flex: 1;
  min-width: 0;
}

.topbar {
  height: 80px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 40px 28px 40px;
}

.crumb-link {
  border: 0;
  background: transparent;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  padding: 0;
  color: #71717a;
  cursor: pointer;
}

.crumb-link.active {
  color: #4658ac;
}

.bell {
  border: 0;
  padding: 0;
  width: 18px;
  height: 20px;
  background: transparent;
  cursor: pointer;
}

.bell svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #000;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.content-zone {
  padding: 20px 40px 40px;
}

.page-title {
  margin: 0;
  font-size: 32px;
  line-height: 38.73px;
  letter-spacing: 0;
  font-weight: 600;
  color: #000;
}

.panel {
  background: #fff;
  border-radius: 12px;
  box-sizing: border-box;
}

.panel-large {
  width: 1104px;
  margin-top: 12px;
  padding: 32px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header h2,
.panel-header h3 {
  margin: 0;
  font-size: 18px;
  line-height: 21.78px;
  font-weight: 400;
  color: #27272a;
}

.panel-header h3 {
  font-size: 16px;
  line-height: 19.36px;
}

.btn-create {
  border: 0;
  border-radius: 10px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #475fd7;
  color: #fff;
  height: 33px;
  font-size: 14px;
  line-height: 16.94px;
  font-weight: 400;
  cursor: pointer;
}

.compact-create {
  border-radius: 8px;
  height: 31px;
  padding: 6px;
  font-size: 16px;
  line-height: 19.36px;
}

.plus {
  font-size: 16px;
  line-height: 10px;
  font-weight: 600;
}

.search {
  margin-top: 18px;
  height: 41px;
  border: 1px solid rgba(71, 99, 228, 0.5);
  border-radius: 10px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #18181b;
  stroke-width: 2;
  stroke-linecap: round;
}

.search input {
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 14px;
  line-height: 16.94px;
  color: #18181b;
  padding: 0;
}

.search input::placeholder {
  color: #a1a1aa;
}

.table-head {
  display: grid;
  gap: 8px;
  color: #a1a1aa;
  font-size: 16px;
  line-height: 19.36px;
  letter-spacing: 0;
  font-weight: 500;
  margin-top: 20px;
}

.cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.rows {
  display: flex;
  flex-direction: column;
}

.rows-large {
  margin-top: 20px;
  gap: 20px;
}

.rows-small {
  margin-top: 18px;
  gap: 18px;
}

.row {
  display: grid;
  gap: 8px;
  border-bottom: 1px solid #f4f4f5;
  padding-bottom: 12px;
  font-size: 14px;
  line-height: 16.94px;
  font-weight: 400;
  color: #27272a;
}

.row.compact {
  padding-bottom: 8px;
}

.actions {
  display: flex;
  gap: 4px;
}

.btn-outline,
.btn-danger {
  width: 125px;
  height: 31px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 14.52px;
  letter-spacing: 0;
  font-weight: 500;
  cursor: pointer;
}

.btn-outline {
  border: 1px solid #5c73db;
  color: #5c73db;
  background: transparent;
}

.btn-danger {
  border: 0;
  color: #fff;
  background: #dc2626;
}

.btn-outline.mini,
.btn-danger.mini {
  width: 76px;
  border-radius: 8px;
}

.panel-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-footer p {
  margin: 0;
  color: #475fd7;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

.panel-large .panel-footer p {
  font-size: 16px;
  line-height: 24px;
}

.pagination-pill {
  height: 38px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.pill-cell {
  min-width: 39px;
  height: 38px;
  border: 0;
  background: #fff;
  color: #27272a;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

.pill-cell.icon {
  min-width: 36px;
}

.pill-cell.active {
  background: #475fd7;
  color: #fff;
}

.divider {
  width: 1px;
  height: 38px;
  background: #d4d4d8;
}

.pill-cell svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: #71717a;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cards-grid {
  width: 1104px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.panel-small {
  min-height: 515px;
  padding: 32px;
}

.small-header {
  min-height: 33px;
}

.compact-actions {
  gap: 4px;
}

.mini-pager {
  display: flex;
  gap: 4px;
}

.mini-pager button {
  height: 38px;
  border-radius: 8px;
  border: 1px solid #d4d4d8;
  background: #fff;
  padding: 8px 12px;
  color: #27272a;
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  cursor: pointer;
}

.mini-pager.disabled button {
  color: #e4e4e7;
  border-color: #f4f4f5;
  cursor: not-allowed;
}

@media (max-width: 1400px) {
  .panel-large,
  .cards-grid {
    width: 100%;
  }
}

@media (max-width: 1200px) {
  .dashboard2-high {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-height: auto;
  }

  .sidebar-body {
    padding-bottom: 20px;
  }

  .sidebar-user {
    padding-bottom: 24px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .panel-large,
  .panel-small {
    padding: 24px;
  }

  .topbar,
  .content-zone {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
