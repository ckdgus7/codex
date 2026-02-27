<template>
  <div class="dashboard2-root">
    <aside class="sidebar" aria-label="Navigation principale">
      <div class="sidebar-bg"></div>
      <img
        class="sidebar-pattern"
        src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d6b8ef68-11f6-48fb-a4bd-51b076b73159"
        alt=""
      />

      <header class="sidebar-brand">
        <div class="brand-mark" aria-hidden="true"></div>
        <span class="brand-text">workflow</span>
      </header>

      <div class="sidebar-content">
        <div class="sidebar-group">
          <button type="button" class="sidebar-link">Utilisateurs</button>
          <button type="button" class="sidebar-link is-active" @click="() => navigateToScreen('baseTitle')">Base</button>
          <button type="button" class="sidebar-link">Controle</button>
          <button type="button" class="sidebar-link">Workflow</button>
          <button type="button" class="sidebar-link">Alertes</button>
          <button type="button" class="sidebar-link">Roles</button>
          <button type="button" class="sidebar-link">Preferences</button>
          <button type="button" class="sidebar-link">Calendrier</button>
          <button type="button" class="sidebar-link subtle">Dossier</button>
          <button type="button" class="sidebar-link subtle">Projet</button>
          <button type="button" class="sidebar-link subtle">Direction Technique</button>
          <button type="button" class="sidebar-link subtle">Protection</button>
        </div>

        <div class="sidebar-user">
          <img
            class="sidebar-avatar"
            src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/54bce8de-e088-4ba9-aa03-69cb87a473a5"
            alt="Tim Cook"
          />
          <div>
            <p class="user-name">Tim Cook</p>
            <p class="user-mail">timcook@force.com</p>
          </div>
        </div>

        <img
          class="sidebar-hidden-avatar"
          src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/205fd546-85c3-4390-ac7b-0a81fe556b1c"
          alt=""
          aria-hidden="true"
        />
      </div>
    </aside>

    <div class="page-shell">
      <header class="topbar">
        <nav class="breadcrumb" aria-label="Fil d'ariane">
          <span>Base</span>
        </nav>

        <button type="button" class="notification-btn" aria-label="Notifications" @click="() => onNotificationClick()">
          <svg viewBox="0 0 18 20" aria-hidden="true">
            <path d="M9 1.5a5.5 5.5 0 0 0-5.5 5.5v4.2L2 14h14l-1.5-2.8V7A5.5 5.5 0 0 0 9 1.5Z" />
            <path d="M7.4 17.2a1.9 1.9 0 0 0 3.2 0" />
          </svg>
        </button>
      </header>

      <main class="content-area">
        <h1 class="title">Base</h1>

        <section class="card large-card">
          <div class="card-head">
            <h2>Liste des pays</h2>
            <button type="button" class="btn-add" @click="() => onAddCountry()">
              Ajouter
              <span class="plus" aria-hidden="true"></span>
            </button>
          </div>

          <label class="search-field" aria-label="Rechercher un pays">
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

          <div class="table-head country-grid">
            <span>Libelle</span>
            <span>Code ISO</span>
            <span>Description</span>
            <span>Actions</span>
          </div>

          <div class="table-body">
            <div v-for="item in filteredCountries" :key="item.id" class="table-row country-grid">
              <span>{{ item.label }}</span>
              <span>{{ item.iso }}</span>
              <span>{{ item.description }}</span>
              <div class="row-actions large-actions">
                <button type="button" class="btn-edit btn-lg" @click="() => onEditCountry(item.id)">Modifier</button>
                <button type="button" class="btn-delete btn-lg" @click="() => onDeleteCountry(item.id)">Supprimer</button>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <p class="summary">{{ countrySummary }}</p>
            <div class="pagination-wide" role="navigation" aria-label="Pagination pays">
              <button type="button" class="pager-arrow" @click="() => onCountryPrevPage()">?</button>
              <button
                v-for="page in countryPages"
                :key="page"
                type="button"
                class="pager-number"
                :class="{ active: page === String(countryPage) }"
                @click="() => onCountryPageClick(page)"
              >
                {{ page }}
              </button>
              <button type="button" class="pager-arrow" @click="() => onCountryNextPage()">?</button>
            </div>
          </div>
        </section>

        <section class="grid-cards">
          <article class="card small-card">
            <div class="card-head compact">
              <h3>Liste des villes</h3>
              <button type="button" class="btn-add" @click="() => onAddCity()">
                Ajouter
                <span class="plus" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-field small-search" aria-label="Rechercher une ville">
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

            <div class="table-head three-grid">
              <span>Libelle</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="table-body">
              <div v-for="item in filteredCities" :key="item.id" class="table-row three-grid">
                <span>{{ item.label }}</span>
                <span>{{ item.description }}</span>
                <div class="row-actions">
                  <button type="button" class="btn-edit" @click="() => onEditCity(item.id)">Modifier</button>
                  <button type="button" class="btn-delete" @click="() => onDeleteCity(item.id)">Supprimer</button>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <p class="summary">{{ citySummary }}</p>
              <div class="pagination-small">
                <button type="button" class="pager-pill" @click="() => onCityPrevPage()">Precedent</button>
                <button type="button" class="pager-pill" @click="() => onCityNextPage()">Suivant</button>
              </div>
            </div>
          </article>

          <article class="card small-card">
            <div class="card-head compact">
              <h3>Liste des methodes d'evaluation</h3>
              <button type="button" class="btn-add" @click="() => onAddMethod()">
                Ajouter
                <span class="plus" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-field small-search" aria-label="Rechercher une methode d'evaluation">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5"></circle>
                <line x1="10.7" y1="10.7" x2="14.2" y2="14.2"></line>
              </svg>
              <input
                type="text"
                :value="methodQuery"
                placeholder="Vous cherchez une methode d'evaluation ..."
                @input="(event) => onMethodSearchInput(event)"
              />
            </label>

            <div class="table-head three-grid">
              <span>Libelle</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="table-body">
              <div v-for="item in filteredMethods" :key="item.id" class="table-row three-grid">
                <span>{{ item.label }}</span>
                <span>{{ item.description }}</span>
                <div class="row-actions">
                  <button type="button" class="btn-edit" @click="() => onEditMethod(item.id)">Modifier</button>
                  <button type="button" class="btn-delete" @click="() => onDeleteMethod(item.id)">Supprimer</button>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <p class="summary">{{ methodSummary }}</p>
              <div class="pagination-small disabled">
                <button type="button" class="pager-pill" @click="() => onMethodPrevPage()">Precedent</button>
                <button type="button" class="pager-pill" @click="() => onMethodNextPage()">Suivant</button>
              </div>
            </div>
          </article>

          <article class="card small-card">
            <div class="card-head compact">
              <h3>Liste des domaines de diligences et risques</h3>
              <button type="button" class="btn-create" @click="() => onCreateDomain()">
                Creer
                <span class="plus plus-12" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-field small-search" aria-label="Rechercher un domaine de diligences et risques">
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

            <div class="table-head three-grid">
              <span>Libelle</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="card-footer empty-footer">
              <p class="summary">Aucun domaine</p>
              <div class="pagination-small disabled">
                <button type="button" class="pager-pill" @click="() => onDomainPrevPage()">Precedent</button>
                <button type="button" class="pager-pill" @click="() => onDomainNextPage()">Suivant</button>
              </div>
            </div>
          </article>

          <article class="card small-card">
            <div class="card-head compact">
              <h3>Liste des competences</h3>
              <button type="button" class="btn-create" @click="() => onCreateSkill()">
                Creer
                <span class="plus plus-12" aria-hidden="true"></span>
              </button>
            </div>

            <label class="search-field small-search" aria-label="Rechercher une competence">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5"></circle>
                <line x1="10.7" y1="10.7" x2="14.2" y2="14.2"></line>
              </svg>
              <input
                type="text"
                :value="skillQuery"
                placeholder="Vous cherchez une competence ..."
                @input="(event) => onSkillSearchInput(event)"
              />
            </label>

            <div class="table-head three-grid">
              <span>Libelle</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div class="card-footer empty-footer">
              <p class="summary">Aucun domaine</p>
              <div class="pagination-small disabled">
                <button type="button" class="pager-pill" @click="() => onSkillPrevPage()">Precedent</button>
                <button type="button" class="pager-pill" @click="() => onSkillNextPage()">Suivant</button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineStore, storeToRefs } from 'pinia';

type Country = {
  id: string;
  label: string;
  iso: string;
  description: string;
};

type NamedItem = {
  id: string;
  label: string;
  description: string;
};

const countryRows: Country[] = [
  { id: 'country-1', label: 'Tortor.', iso: 'CMR', description: 'alexander.foley@gmail.com' },
  { id: 'country-2', label: 'Gabon', iso: 'GAB', description: 'alexander.foley@gmail.com' },
];

const cityRows: NamedItem[] = [
  { id: 'city-1', label: 'Tellus.', description: 'Libero scelerisque massa quis mauris nisl.' },
  { id: 'city-2', label: 'Kribi', description: '.' },
  { id: 'city-3', label: 'Libreville', description: '.' },
  { id: 'city-4', label: 'Yagoua', description: '.' },
  { id: 'city-5', label: 'Yaounde', description: '.' },
  { id: 'city-6', label: 'Douala', description: '.' },
  { id: 'city-7', label: 'Bafoussam', description: '.' },
];

const methodRows: NamedItem[] = [{ id: 'method-1', label: 'SWOT', description: '.' }];

const useDashboard2Store = defineStore('dashboard2-screen-state', () => {
  const countryQuery = ref('');
  const cityQuery = ref('');
  const methodQuery = ref('');
  const domainQuery = ref('');
  const skillQuery = ref('');

  const countryPage = ref(1);
  const cityPage = ref(1);
  const methodPage = ref(1);
  const domainPage = ref(1);
  const skillPage = ref(1);

  return {
    countryQuery,
    cityQuery,
    methodQuery,
    domainQuery,
    skillQuery,
    countryPage,
    cityPage,
    methodPage,
    domainPage,
    skillPage,
  };
});

const router = useRouter();
const dashboard2Store = useDashboard2Store();
const {
  countryQuery,
  cityQuery,
  methodQuery,
  domainQuery,
  skillQuery,
  countryPage,
  cityPage,
  methodPage,
  domainPage,
  skillPage,
} = storeToRefs(dashboard2Store);

const countryPages = ['1', '2', '3', '...', '8', '9', '10'];
const cityPageSize = 5;

const filteredCountries = computed(() => {
  const query = countryQuery.value.trim().toLowerCase();
  if (!query) {
    return countryRows;
  }

  return countryRows.filter((item) => {
    return [item.label, item.iso, item.description].join(' ').toLowerCase().includes(query);
  });
});

const filteredCities = computed(() => {
  const query = cityQuery.value.trim().toLowerCase();
  const source = query
    ? cityRows.filter((item) => [item.label, item.description].join(' ').toLowerCase().includes(query))
    : cityRows;

  const start = (cityPage.value - 1) * cityPageSize;
  return source.slice(start, start + cityPageSize);
});

const filteredMethods = computed(() => {
  const query = methodQuery.value.trim().toLowerCase();
  if (!query) {
    return methodRows;
  }

  return methodRows.filter((item) => [item.label, item.description].join(' ').toLowerCase().includes(query));
});

const countrySummary = computed(() => `${String(filteredCountries.value.length).padStart(2, '0')} pays`);
const citySummary = computed(() => `${String(cityRows.length).padStart(2, '0')} villes`);
const methodSummary = computed(() => `${String(methodRows.length).padStart(2, '0')} Methode`);

const screenElements = {
  baseTitle: 'Base',
  countriesList: 'Liste des pays',
  citiesList: 'Liste des villes',
  methodsList: "Liste des methodes d'evaluation",
  domainsList: 'Liste des domaines de diligences et risques',
  skillsList: 'Liste des competences',
} as const;

const safePush = (name: string): void => {
  void router.push({ name }).catch(() => undefined);
};

const navigateToScreen = (screen: keyof typeof screenElements): void => {
  safePush(screen);
};

const onNotificationClick = (): void => {
  console.info('open-notifications');
};

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

const onCountryPageClick = (page: string): void => {
  if (page === '...') {
    return;
  }

  countryPage.value = Number(page);
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
  cityPage.value = Math.min(2, cityPage.value + 1);
};

const onMethodPrevPage = (): void => {
  methodPage.value = Math.max(1, methodPage.value - 1);
};

const onMethodNextPage = (): void => {
  methodPage.value = methodPage.value + 1;
};

const onDomainPrevPage = (): void => {
  domainPage.value = Math.max(1, domainPage.value - 1);
};

const onDomainNextPage = (): void => {
  domainPage.value = domainPage.value + 1;
};

const onSkillPrevPage = (): void => {
  skillPage.value = Math.max(1, skillPage.value - 1);
};

const onSkillNextPage = (): void => {
  skillPage.value = skillPage.value + 1;
};

const onAddCountry = (): void => safePush('country-create');
const onEditCountry = (id: string): void => safePush(`country-edit-${id}`);
const onDeleteCountry = (id: string): void => console.info('delete-country', id);

const onAddCity = (): void => safePush('city-create');
const onEditCity = (id: string): void => safePush(`city-edit-${id}`);
const onDeleteCity = (id: string): void => console.info('delete-city', id);

const onAddMethod = (): void => safePush('method-create');
const onEditMethod = (id: string): void => safePush(`method-edit-${id}`);
const onDeleteMethod = (id: string): void => console.info('delete-method', id);

const onCreateDomain = (): void => safePush('domain-create');
const onCreateSkill = (): void => safePush('skill-create');
</script>

<style scoped>
.dashboard2-root {
  width: 1440px;
  height: 1024px;
  background: #fafafa;
  color: #27272a;
  font-family: Inter, sans-serif;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 256px;
  height: 1024px;
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
  width: 256px;
  height: 1024px;
  object-fit: cover;
  opacity: 0.25;
}

.sidebar-brand {
  position: relative;
  z-index: 1;
  height: 64px;
  background: #0e1b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.brand-mark {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #8da2fb;
}

.brand-text {
  font-size: 26px;
  line-height: 30px;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.sidebar-content {
  position: relative;
  z-index: 1;
  height: 960px;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-link {
  width: 216px;
  min-height: 19px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  font-size: 16px;
  line-height: 19.36px;
  color: #ffffff;
  padding: 8px 36px;
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

.sidebar-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name,
.user-mail {
  margin: 0;
  color: #ffffff;
  line-height: 19.36px;
  font-size: 16px;
}

.sidebar-hidden-avatar {
  width: 36px;
  height: 36px;
  object-fit: cover;
  display: none;
}

.page-shell {
  width: 1184px;
  height: 1024px;
}

.topbar {
  width: 1184px;
  height: 80px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 40px;
}

.breadcrumb {
  color: #4658ac;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.notification-btn {
  width: 18px;
  height: 20px;
  border: 0;
  background: transparent;
  padding: 0;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.notification-btn svg {
  width: 18px;
  height: 20px;
  fill: none;
  stroke: #000000;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.content-area {
  padding: 20px 40px 32px;
  width: 1184px;
  height: 944px;
  overflow: auto;
}

.title {
  margin: 0;
  color: #000000;
  font-size: 32px;
  line-height: 38.73px;
  font-weight: 600;
}

.card {
  border-radius: 12px;
  background: #ffffff;
}

.large-card {
  width: 1104px;
  height: 389px;
  margin-top: 12px;
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
  color: #27272a;
  font-weight: 400;
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

.btn-add,
.btn-create {
  height: 33px;
  border: 0;
  border-radius: 10px;
  background: #4763e4;
  color: #ffffff;
  font-size: 14px;
  line-height: 16.94px;
  font-weight: 400;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-create {
  height: 31px;
  border-radius: 8px;
  padding: 6px;
  font-size: 16px;
  line-height: 19.36px;
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

.plus-12 {
  width: 12px;
  height: 12px;
}

.plus-12::before {
  width: 12px;
  top: 5px;
}

.plus-12::after {
  height: 12px;
  left: 5px;
}

.search-field {
  width: 1040px;
  height: 41px;
  margin: 14px 0 20px;
  border: 1px solid rgba(71, 99, 228, 0.5);
  border-radius: 10px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.small-search {
  width: 484px;
}

.search-field svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #18181b;
  stroke-width: 2;
}

.search-field input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;
  line-height: 16.94px;
  color: #27272a;
}

.search-field input::placeholder {
  color: #a1a1aa;
}

.table-head,
.table-row {
  display: grid;
  align-items: center;
}

.table-head {
  color: #a1a1aa;
  font-size: 16px;
  line-height: 19.36px;
  font-weight: 500;
}

.country-grid {
  grid-template-columns: 254px 254px 254px 254px;
  column-gap: 8px;
}

.three-grid {
  grid-template-columns: 156px 156px 156px;
  column-gap: 8px;
}

.table-body {
  margin-top: 20px;
}

.table-row {
  min-height: 44px;
  border-bottom: 1px solid #f4f4f5;
  color: #27272a;
  font-size: 14px;
  line-height: 16.94px;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-edit,
.btn-delete {
  width: 76px;
  height: 31px;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  line-height: 14.52px;
  font-weight: 500;
  cursor: pointer;
}

.btn-lg {
  width: 125px;
  border-radius: 10px;
}

.btn-edit {
  border: 1px solid #5c73db;
  color: #5c73db;
  background: transparent;
}

.btn-delete {
  border: 0;
  color: #ffffff;
  background: #dc2626;
}

.card-footer {
  margin-top: 20px;
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

.pagination-wide {
  width: 373px;
  height: 38px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.pager-arrow,
.pager-number {
  border: 0;
  border-right: 1px solid #d4d4d8;
  background: #ffffff;
  color: #27272a;
  font-size: 14px;
  line-height: 20px;
  padding: 8px 16px;
  cursor: pointer;
}

.pager-number.active {
  background: #4763e4;
  color: #ffffff;
}

.pagination-wide > :last-child {
  border-right: 0;
}

.grid-cards {
  margin-top: 20px;
  width: 1104px;
  display: grid;
  grid-template-columns: 548px 548px;
  gap: 20px 8px;
}

.small-card {
  width: 548px;
  height: 515px;
  padding: 32px;
}

.pagination-small {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pager-pill {
  height: 38px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  background: #ffffff;
  color: #27272a;
  font-size: 12px;
  line-height: 16px;
  padding: 8px 12px;
  cursor: pointer;
}

.pagination-small.disabled .pager-pill {
  border-color: #f4f4f5;
  color: #e4e4e7;
}

.empty-footer {
  margin-top: 304px;
}
</style>
