<template>
  <div class="dashboard-page">
    <aside class="sidebar" aria-label="Navigation">
      <div class="sidebar-bg"></div>
      <img
        class="sidebar-pattern"
        src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/59180dfd-64ef-45eb-9fdc-f0fc1f229748"
        alt=""
      />

      <div class="sidebar-top">
        <div class="brand-mark" aria-hidden="true"></div>
        <span class="brand-text">workflow</span>
      </div>

      <div class="sidebar-content">
        <div class="sidebar-links">
          <p class="sidebar-group-title">Configuration</p>
          <button type="button" class="sidebar-link">Utilisateurs</button>
          <button type="button" class="sidebar-link is-active">Base</button>
          <button type="button" class="sidebar-link">Contrôle</button>
          <button type="button" class="sidebar-link">Workflow</button>
          <button type="button" class="sidebar-link">Alertes</button>
          <button type="button" class="sidebar-link">Rôles</button>
          <button type="button" class="sidebar-link">Préferences</button>
          <button type="button" class="sidebar-link">Calendrier</button>
          <button type="button" class="sidebar-link subtle">Dossier</button>
          <button type="button" class="sidebar-link subtle">Projet</button>
          <button type="button" class="sidebar-link subtle">Direction Technique</button>
          <button type="button" class="sidebar-link subtle">Protection</button>
        </div>

        <div class="sidebar-user">
          <img
            class="avatar"
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ab20af5f-9130-401f-b216-dd101e906342"
            alt="Tim Cook"
          />
          <div class="user-meta">
            <p>Tim Cook</p>
            <p>timcook@force.com</p>
          </div>
        </div>
      </div>
    </aside>

    <div class="content-shell">
      <header class="topbar" aria-label="Header">
        <nav class="breadcrumb">
          <button type="button" class="breadcrumb-item active">Base</button>
        </nav>
        <button type="button" class="icon-button" aria-label="Menu">
          <span></span>
          <span></span>
        </button>
      </header>

      <main class="main-area">
        <h1 class="page-title">Base</h1>

        <section class="card countries-card">
          <div class="card-head">
            <h2>Liste des pays</h2>
            <button type="button" class="btn-primary" @click="() => handleAddCountry()">
              Ajouter
              <span class="plus" aria-hidden="true"></span>
            </button>
          </div>

          <label class="search-box" aria-label="Rechercher un pays">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="7" cy="7" r="5.5"></circle>
              <line x1="10.7" y1="10.7" x2="14.2" y2="14.2"></line>
            </svg>
            <input
              type="text"
              :value="countryQuery"
              placeholder="Vous cherchez un pays ..."
              @input="(event) => onCountrySearchInput(event)"
            />
          </label>

          <div class="table-header country-grid">
            <span>Libellé</span>
            <span>Code ISO</span>
            <span>Description</span>
            <span>Actions</span>
          </div>

          <div class="table-body">
            <div v-for="country in filteredCountries" :key="country.id" class="table-row country-grid">
              <span>{{ country.label }}</span>
              <span>{{ country.iso }}</span>
              <span>{{ country.description }}</span>
              <div class="actions">
                <button
                  type="button"
                  class="btn-outline"
                  @click="() => handleEditCountry(country.id)"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  class="btn-danger"
                  @click="() => handleDeleteCountry(country.id)"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          <div class="card-foot">
            <p class="summary">{{ countrySummaryText }}</p>
            <div class="pagination-large">
              <button type="button" class="page-nav" @click="() => onCountryPrevPage()">◀</button>
              <button
                v-for="item in countryPaginationItems"
                :key="item"
                type="button"
                class="page-item"
                :class="{ active: item === String(countryPage) }"
                @click="() => onCountryPaginationItem(item)"
              >
                {{ item }}
              </button>
              <button type="button" class="page-nav" @click="() => onCountryNextPage()">▶</button>
            </div>
          </div>
        </section>

        <div class="cards-grid">
          <section class="card small-card">
            <div class="card-head compact">
              <h3>Liste des villes</h3>
              <button type="button" class="btn-primary" @click="() => handleAddCity()">
                Ajouter
                <span class="plus" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-box" aria-label="Rechercher une ville">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5"></circle>
                <line x1="10.7" y1="10.7" x2="14.2" y2="14.2"></line>
              </svg>
              <input
                type="text"
                :value="cityQuery"
                placeholder="Vous cherchez une ville ..."
                @input="(event) => onCitySearchInput(event)"
              />
            </label>

            <div class="table-header city-grid">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="table-body small">
              <div v-for="city in pagedCities" :key="city.id" class="table-row city-grid">
                <span>{{ city.label }}</span>
                <span>{{ city.description }}</span>
                <div class="actions small-actions">
                  <button type="button" class="btn-outline" @click="() => handleEditCity(city.id)">Modifier</button>
                  <button type="button" class="btn-danger" @click="() => handleDeleteCity(city.id)">Supprimer</button>
                </div>
              </div>
            </div>

            <div class="card-foot">
              <p class="summary">{{ citySummaryText }}</p>
              <div class="pagination-small">
                <button type="button" class="pager-btn" @click="() => onCityPrevPage()">Précedent</button>
                <button type="button" class="pager-btn" @click="() => onCityNextPage()">Suivant</button>
              </div>
            </div>
          </section>

          <section class="card small-card">
            <div class="card-head compact">
              <h3>Liste des méthodes d'évaluation</h3>
              <button type="button" class="btn-primary" @click="() => handleAddMethod()">
                Ajouter
                <span class="plus" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-box" aria-label="Rechercher une méthode">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5"></circle>
                <line x1="10.7" y1="10.7" x2="14.2" y2="14.2"></line>
              </svg>
              <input
                type="text"
                :value="methodQuery"
                placeholder="Vous cherchez une méthode d'évaluation ..."
                @input="(event) => onMethodSearchInput(event)"
              />
            </label>

            <div class="table-header city-grid">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="table-body small">
              <div v-for="method in filteredMethods" :key="method.id" class="table-row city-grid">
                <span>{{ method.label }}</span>
                <span>{{ method.description }}</span>
                <div class="actions small-actions">
                  <button type="button" class="btn-outline" @click="() => handleEditMethod(method.id)">Modifier</button>
                  <button type="button" class="btn-danger" @click="() => handleDeleteMethod(method.id)">Supprimer</button>
                </div>
              </div>
            </div>

            <div class="card-foot">
              <p class="summary">{{ methodSummaryText }}</p>
              <div class="pagination-small disabled">
                <button type="button" class="pager-btn" disabled>Précedent</button>
                <button type="button" class="pager-btn" disabled>Suivant</button>
              </div>
            </div>
          </section>

          <section class="card small-card">
            <div class="card-head compact">
              <h3>Liste des domaines de diligences et risques</h3>
              <button type="button" class="btn-primary" @click="() => handleCreateDomain()">
                Créer
                <span class="plus" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-box" aria-label="Rechercher un domaine">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5"></circle>
                <line x1="10.7" y1="10.7" x2="14.2" y2="14.2"></line>
              </svg>
              <input
                type="text"
                :value="domainQuery"
                placeholder="Vous cherchez un domaine de diligences et risques ..."
                @input="(event) => onDomainSearchInput(event)"
              />
            </label>

            <div class="table-header city-grid">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="card-foot empty-foot">
              <p class="summary">Aucun domaine</p>
              <div class="pagination-small disabled">
                <button type="button" class="pager-btn" disabled>Précedent</button>
                <button type="button" class="pager-btn" disabled>Suivant</button>
              </div>
            </div>
          </section>

          <section class="card small-card">
            <div class="card-head compact">
              <h3>Liste des compétences</h3>
              <button type="button" class="btn-primary" @click="() => handleCreateSkill()">
                Créer
                <span class="plus" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-box" aria-label="Rechercher une compétence">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5"></circle>
                <line x1="10.7" y1="10.7" x2="14.2" y2="14.2"></line>
              </svg>
              <input
                type="text"
                :value="skillQuery"
                placeholder="Vous cherchez une compétence ..."
                @input="(event) => onSkillSearchInput(event)"
              />
            </label>

            <div class="table-header city-grid">
              <span>Libellé</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="card-foot empty-foot">
              <p class="summary">Aucun domaine</p>
              <div class="pagination-small disabled">
                <button type="button" class="pager-btn" disabled>Précedent</button>
                <button type="button" class="pager-btn" disabled>Suivant</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore, storeToRefs } from 'pinia';
import { useDesPaysStore } from '../store/desPays';

type NamedItem = {
  id: string;
  label: string;
  description: string;
};

const cities = ref<NamedItem[]>([
  { id: 'city-1', label: 'Tellus.', description: 'Libero scelerisque massa quis mauris nisl.' },
  { id: 'city-2', label: 'Kribi', description: '.' },
  { id: 'city-3', label: 'Libreville', description: '.' },
  { id: 'city-4', label: 'Yagoua', description: '.' },
  { id: 'city-5', label: 'Yaoundé', description: '.' },
  { id: 'city-6', label: 'Douala', description: '.' },
  { id: 'city-7', label: 'Bafoussam', description: '.' },
]);

const methods = ref<NamedItem[]>([{ id: 'method-swot', label: 'SWOT', description: '.' }]);

const useDashboardStore = defineStore('dashboard-screen', () => {
  const countryQuery = ref('');
  const cityQuery = ref('');
  const methodQuery = ref('');
  const domainQuery = ref('');
  const skillQuery = ref('');

  const countryPage = ref(1);
  const cityPage = ref(1);

  return {
    countryQuery,
    cityQuery,
    methodQuery,
    domainQuery,
    skillQuery,
    countryPage,
    cityPage,
  };
});

const router = useRouter();
const dashboardStore = useDashboardStore();
const desPaysStore = useDesPaysStore();

const {
  countryQuery,
  cityQuery,
  methodQuery,
  domainQuery,
  skillQuery,
  countryPage,
  cityPage,
} = storeToRefs(dashboardStore);
const { countries } = storeToRefs(desPaysStore);

const countryPaginationItems = ['1', '2', '3', '...', '8', '9', '10'];
const cityPageSize = 4;

const filteredCountries = computed(() => {
  const query = countryQuery.value.trim().toLowerCase();
  if (!query) {
    return countries.value;
  }

  return countries.value.filter((item) => {
    return [item.label, item.iso, item.description].join(' ').toLowerCase().includes(query);
  });
});

const filteredCities = computed(() => {
  const query = cityQuery.value.trim().toLowerCase();
  if (!query) {
    return cities.value;
  }

  return cities.value.filter((item) => {
    return [item.label, item.description].join(' ').toLowerCase().includes(query);
  });
});

const filteredMethods = computed(() => {
  const query = methodQuery.value.trim().toLowerCase();
  if (!query) {
    return methods.value;
  }

  return methods.value.filter((item) => {
    return [item.label, item.description].join(' ').toLowerCase().includes(query);
  });
});

const pagedCities = computed(() => {
  const start = (cityPage.value - 1) * cityPageSize;
  const end = start + cityPageSize;
  return filteredCities.value.slice(start, end);
});

const countrySummaryText = computed(() => `${String(filteredCountries.value.length).padStart(2, '0')} pays`);
const citySummaryText = computed(() => `${String(filteredCities.value.length).padStart(2, '0')} villes`);
const methodSummaryText = computed(() => `${String(filteredMethods.value.length).padStart(2, '0')} Méthode`);

const onCountrySearchInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  countryQuery.value = target.value;
};

const onCitySearchInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  cityQuery.value = target.value;
  cityPage.value = 1;
};

const onMethodSearchInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  methodQuery.value = target.value;
};

const onDomainSearchInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  domainQuery.value = target.value;
};

const onSkillSearchInput = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  skillQuery.value = target.value;
};

const onCountryPaginationItem = (value: string): void => {
  if (value === '...') {
    return;
  }

  countryPage.value = Number(value);
};

const onCountryPrevPage = (): void => {
  countryPage.value = Math.max(1, countryPage.value - 1);
};

const onCountryNextPage = (): void => {
  countryPage.value = countryPage.value + 1;
};

const onCityPrevPage = (): void => {
  cityPage.value = Math.max(1, cityPage.value - 1);
};

const onCityNextPage = (): void => {
  const totalPages = Math.max(1, Math.ceil(filteredCities.value.length / cityPageSize));
  cityPage.value = Math.min(totalPages, cityPage.value + 1);
};

const navigateSilently = (name: string): void => {
  void router.push({ name }).catch(() => undefined);
};

const handleAddCountry = (): void => navigateSilently('country-create');
const handleEditCountry = (id: string): void => navigateSilently(`country-edit-${id}`);
const handleDeleteCountry = (id: string): void => console.info('delete-country', id);

const handleAddCity = (): void => navigateSilently('city-create');
const handleEditCity = (id: string): void => navigateSilently(`city-edit-${id}`);
const handleDeleteCity = (id: string): void => console.info('delete-city', id);

const handleAddMethod = (): void => navigateSilently('method-create');
const handleEditMethod = (id: string): void => navigateSilently(`method-edit-${id}`);
const handleDeleteMethod = (id: string): void => console.info('delete-method', id);

const handleCreateDomain = (): void => navigateSilently('domain-create');
const handleCreateSkill = (): void => navigateSilently('skill-create');
</script>

<style scoped>
.dashboard-page {
  width: 1440px;
  min-height: 1024px;
  display: flex;
  background: #fafafa;
  color: #27272a;
  font-family: Inter, sans-serif;
}

.sidebar {
  width: 256px;
  min-height: 100%;
  position: relative;
  overflow: hidden;
}

.sidebar-bg {
  position: absolute;
  inset: 0;
  background: #4658ac;
}

.sidebar-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
}

.sidebar-top {
  position: relative;
  height: 64px;
  background: #0e1b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #8da2fb;
}

.sidebar-content {
  position: relative;
  height: calc(100% - 64px);
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-group-title {
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 16px;
  line-height: 19.36px;
  font-weight: 500;
}

.sidebar-link {
  height: 35px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #ffffff;
  font-size: 16px;
  line-height: 19.36px;
  text-align: left;
  padding: 8px 16px;
  cursor: pointer;
}

.sidebar-link.is-active {
  background: #4255d0;
}

.sidebar-link.subtle {
  opacity: 0.5;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  object-fit: cover;
}

.user-meta p {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  line-height: 18px;
}

.content-shell {
  width: 1184px;
}

.topbar {
  height: 80px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.breadcrumb-item {
  border: 0;
  background: transparent;
  color: #4758ac;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.icon-button {
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  display: grid;
  place-content: center;
  gap: 4px;
  padding: 0;
}

.icon-button span {
  display: block;
  width: 18px;
  height: 2px;
  background: #000000;
}

.main-area {
  padding: 20px 40px 40px;
}

.page-title {
  margin: 0 0 12px;
  font-size: 32px;
  line-height: 38.73px;
  font-weight: 600;
  color: #000000;
}

.card {
  background: #ffffff;
  border-radius: 12px;
}

.countries-card {
  width: 1104px;
  height: 389px;
  padding: 32px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-head h2,
.card-head h3 {
  margin: 0;
  font-weight: 400;
  color: #27272a;
}

.card-head h2 {
  font-size: 18px;
  line-height: 21.78px;
}

.card-head h3 {
  font-size: 16px;
  line-height: 19.36px;
}

.compact {
  margin-bottom: 14px;
}

.btn-primary {
  height: 33px;
  border: 0;
  border-radius: 10px;
  background: #4763e4;
  color: #ffffff;
  font-size: 14px;
  line-height: 16.94px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.plus {
  position: relative;
  width: 10px;
  height: 10px;
  display: inline-block;
}

.plus::before,
.plus::after {
  content: '';
  position: absolute;
  background: #ffffff;
}

.plus::before {
  width: 10px;
  height: 2px;
  left: 0;
  top: 4px;
}

.plus::after {
  width: 2px;
  height: 10px;
  left: 4px;
  top: 0;
}

.search-box {
  width: 1040px;
  height: 41px;
  margin: 18px 0 20px;
  border: 1px solid rgba(71, 99, 228, 0.5);
  border-radius: 10px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #18181b;
  stroke-width: 2;
}

.search-box input {
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 14px;
  line-height: 16.94px;
  color: #27272a;
  background: transparent;
}

.search-box input::placeholder {
  color: #a1a1aa;
}

.table-header,
.table-row {
  display: grid;
  align-items: center;
}

.table-header {
  font-size: 16px;
  line-height: 19.36px;
  font-weight: 500;
  color: #a1a1aa;
  min-height: 19px;
}

.country-grid {
  grid-template-columns: 254px 254px 254px 254px;
  column-gap: 8px;
}

.city-grid {
  grid-template-columns: 156px 156px 156px;
  column-gap: 8px;
}

.table-body {
  margin-top: 20px;
}

.table-body.small {
  margin-top: 16px;
}

.table-row {
  min-height: 44px;
  font-size: 14px;
  line-height: 16.94px;
  color: #27272a;
  border-bottom: 1px solid #f4f4f5;
}

.table-row:last-child {
  border-bottom: 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.small-actions .btn-outline,
.small-actions .btn-danger {
  width: 76px;
}

.btn-outline,
.btn-danger {
  height: 31px;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  line-height: 14.52px;
  font-weight: 500;
  cursor: pointer;
}

.btn-outline {
  border: 1px solid #5c73db;
  background: transparent;
  color: #5c73db;
}

.btn-danger {
  border: 0;
  background: #dc2626;
  color: #ffffff;
}

.card-foot {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary {
  margin: 0;
  color: #4763e4;
  font-size: 14px;
  line-height: 20px;
}

.pagination-large {
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.page-nav,
.page-item {
  height: 38px;
  min-width: 36px;
  border: 0;
  border-right: 1px solid #d4d4d8;
  background: #ffffff;
  color: #27272a;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 12px;
  cursor: pointer;
}

.page-item.active {
  background: #4763e4;
  color: #ffffff;
}

.pagination-large > :last-child {
  border-right: 0;
}

.cards-grid {
  width: 1104px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 548px 548px;
  gap: 20px 8px;
}

.small-card {
  width: 548px;
  height: 515px;
  padding: 32px;
}

.small-card .search-box {
  width: 484px;
  margin: 14px 0 20px;
}

.pagination-small {
  display: flex;
  gap: 4px;
}

.pager-btn {
  height: 38px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  background: #ffffff;
  color: #27272a;
  font-size: 12px;
  line-height: 16px;
  padding: 8px 12px;
}

.pagination-small.disabled .pager-btn {
  border-color: #f4f4f5;
  color: #e4e4e7;
}

.empty-foot {
  margin-top: 304px;
}
</style>
