<template>
  <div class="dashboard-root">
    <aside class="sidebar">
      <img class="sidebar-pattern" src="./assets/I1_43619_1_288.png" alt="" aria-hidden="true" />
      <div class="sidebar-top">
        <div class="logo-mark" aria-hidden="true"></div>
        <div class="logo-text">Force</div>
      </div>

      <div class="sidebar-content">
        <div class="sidebar-section-title" @click="onConfigurationClick">
          <span class="section-icon gear"></span>
          <span>Configuration</span>
          <span class="chev-down"></span>
        </div>

        <nav class="sidebar-links" aria-label="Configuration links">
          <button type="button" class="nav-link">Utilisateurs</button>
          <button type="button" class="nav-link active" @click="onBaseMenuClick">Base</button>
          <button type="button" class="nav-link">Contrôle</button>
          <button type="button" class="nav-link">Workflow</button>
          <button type="button" class="nav-link">Alertes</button>
          <button type="button" class="nav-link">Rôles</button>
          <button type="button" class="nav-link">Préferences</button>
          <button type="button" class="nav-link">Calendrier</button>
        </nav>

        <button type="button" class="sidebar-group">Dossier</button>
        <button type="button" class="sidebar-group">Projet</button>
        <button type="button" class="sidebar-group">Direction Technique</button>
        <button type="button" class="sidebar-group">Protection</button>
      </div>

      <button type="button" class="sidebar-profile" @click="onProfileClick">
        <img class="profile-avatar" src="./assets/I1_43619_1_350.png" alt="Tim Cook" />
        <span class="profile-text">Tim Cook<br />timcook@force.com</span>
      </button>
    </aside>

    <header class="topbar">
      <button type="button" class="breadcrumb" @click="onBreadcrumbClick">Base</button>
      <button type="button" class="bell-btn" aria-label="Notifications" @click="onNotificationsClick">
        <span class="bell-icon"></span>
      </button>
    </header>

    <h1 class="page-title">Base</h1>

    <section class="card card-countries">
      <div class="card-header-row">
        <h2 class="card-title">Liste des pays</h2>
        <button type="button" class="primary-btn" @click="onAddCountryClick">
          <span>Ajouter</span>
          <span class="plus">+</span>
        </button>
      </div>

      <form class="search-box" @submit.prevent="onSearchCountries">
        <span class="search-icon" aria-hidden="true"></span>
        <input
          v-model="searchCountries"
          type="text"
          class="search-input"
          placeholder="Vous cherchez un pays ..."
          aria-label="Vous cherchez un pays ..."
        />
      </form>

      <div class="table-head countries-grid">
        <span>Libellé</span>
        <span>Code ISO</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div v-for="row in countryRows" :key="row.label" class="table-row countries-grid">
        <span>{{ row.label }}</span>
        <span>{{ row.code }}</span>
        <span>{{ row.description }}</span>
        <div class="row-actions">
          <button type="button" class="ghost-btn" @click="onEditCountryClick(row.label)">Modifier</button>
          <button type="button" class="danger-btn" @click="onDeleteCountryClick(row.label)">Supprimer</button>
        </div>
      </div>

      <div class="card-footer">
        <span class="summary">02 pays</span>
        <div class="pagination-wide">
          <button type="button" class="page-arrow" @click="onCountryPrevPage">‹</button>
          <button type="button" class="page-chip active" @click="onCountrySetPage(1)">1</button>
          <button type="button" class="page-chip" @click="onCountrySetPage(2)">2</button>
          <button type="button" class="page-chip" @click="onCountrySetPage(3)">3</button>
          <button type="button" class="page-chip">...</button>
          <button type="button" class="page-chip" @click="onCountrySetPage(8)">8</button>
          <button type="button" class="page-chip" @click="onCountrySetPage(9)">9</button>
          <button type="button" class="page-chip" @click="onCountrySetPage(10)">10</button>
          <button type="button" class="page-arrow" @click="onCountryNextPage">›</button>
        </div>
      </div>
    </section>

    <section class="card card-cities">
      <div class="card-header-row small">
        <h2 class="card-title small">Liste des villes</h2>
        <button type="button" class="primary-btn" @click="onAddCityClick">
          <span>Ajouter</span>
          <span class="plus">+</span>
        </button>
      </div>

      <form class="search-box narrow" @submit.prevent="onSearchCities">
        <span class="search-icon" aria-hidden="true"></span>
        <input
          v-model="searchCities"
          type="text"
          class="search-input"
          placeholder="Vous cherchez une ville ..."
          aria-label="Vous cherchez une ville ..."
        />
      </form>

      <div class="table-head three-grid">
        <span>Libellé</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div v-for="row in cityRows" :key="row.label" class="table-row three-grid compact">
        <span>{{ row.label }}</span>
        <span>{{ row.description }}</span>
        <div class="row-actions tight">
          <button type="button" class="ghost-btn compact" @click="onEditCityClick(row.label)">Modifier</button>
          <button type="button" class="danger-btn compact" @click="onDeleteCityClick(row.label)">Supprimer</button>
        </div>
      </div>

      <div class="card-footer small-footer">
        <span class="summary small">07 villes</span>
        <div class="pager-mini">
          <button type="button" class="pager-btn" @click="onCityPrevPage">Précedent</button>
          <button type="button" class="pager-btn" @click="onCityNextPage">Suivant</button>
        </div>
      </div>
    </section>

    <section class="card card-methods">
      <div class="card-header-row small">
        <h2 class="card-title small">Liste des méthodes d'évaluation</h2>
        <button type="button" class="primary-btn" @click="onAddMethodClick">
          <span>Ajouter</span>
          <span class="plus">+</span>
        </button>
      </div>

      <form class="search-box narrow" @submit.prevent="onSearchMethods">
        <span class="search-icon" aria-hidden="true"></span>
        <input
          v-model="searchMethods"
          type="text"
          class="search-input"
          placeholder="Vous cherchez une méthode d'évaluation ..."
          aria-label="Vous cherchez une méthode d'évaluation ..."
        />
      </form>

      <div class="table-head three-grid">
        <span>Libellé</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div class="table-row three-grid compact">
        <span>SWOT</span>
        <span>.</span>
        <div class="row-actions tight">
          <button type="button" class="ghost-btn compact" @click="onEditMethodClick('SWOT')">Modifier</button>
          <button type="button" class="danger-btn compact" @click="onDeleteMethodClick('SWOT')">Supprimer</button>
        </div>
      </div>

      <div class="card-footer small-footer">
        <span class="summary small">01 Méthode</span>
        <div class="pager-mini disabled">
          <button type="button" class="pager-btn disabled" @click="onMethodPrevPage">Précedent</button>
          <button type="button" class="pager-btn disabled" @click="onMethodNextPage">Suivant</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'

type CountryRow = {
  label: string
  code: string
  description: string
}

type SimpleRow = {
  label: string
  description: string
}

const useDashboard1HighStore = defineStore('dashboard1High', () => {
  const activeMenu = ref('Base')
  const countryPage = ref(1)
  const cityPage = ref(1)
  const methodPage = ref(1)
  const searchCountries = ref('')
  const searchCities = ref('')
  const searchMethods = ref('')

  return {
    activeMenu,
    countryPage,
    cityPage,
    methodPage,
    searchCountries,
    searchCities,
    searchMethods,
  }
})

const store = useDashboard1HighStore()
const router = useRouter()

const { activeMenu, countryPage, cityPage, methodPage, searchCountries, searchCities, searchMethods } =
  storeToRefs(store)

const countryRows = computed<CountryRow[]>(() => [
  { label: 'Tortor.', code: 'CMR', description: 'alexander.foley@gmail.com' },
  { label: 'Gabon', code: 'GAB', description: 'alexander.foley@gmail.com' },
])

const cityRows = computed<SimpleRow[]>(() => [
  { label: 'Tellus.', description: 'Libero scelerisque massa quis mauris nisl.' },
  { label: 'Kribi', description: '.' },
  { label: 'Libreville', description: '.' },
  { label: 'Yagoua', description: '.' },
  { label: 'Yaoundé', description: '.' },
])

const onConfigurationClick = (): void => {}

const onBaseMenuClick = (): void => {
  activeMenu.value = 'Base'
}

const onProfileClick = (): void => {}

const onBreadcrumbClick = async (): Promise<void> => {
  await router.push({ path: '/base' }).catch(() => undefined)
}

const onNotificationsClick = (): void => {}
const onAddCountryClick = (): void => {}
const onAddCityClick = (): void => {}
const onAddMethodClick = (): void => {}

const onSearchCountries = (): void => {}
const onSearchCities = (): void => {}
const onSearchMethods = (): void => {}

const onEditCountryClick = (label: string): void => {
  void label
}

const onDeleteCountryClick = (label: string): void => {
  void label
}

const onEditCityClick = (label: string): void => {
  void label
}

const onDeleteCityClick = (label: string): void => {
  void label
}

const onEditMethodClick = (label: string): void => {
  void label
}

const onDeleteMethodClick = (label: string): void => {
  void label
}

const onCountryPrevPage = (): void => {
  countryPage.value = Math.max(1, countryPage.value - 1)
}

const onCountryNextPage = (): void => {
  countryPage.value += 1
}

const onCountrySetPage = (page: number): void => {
  countryPage.value = page
}

const onCityPrevPage = (): void => {
  cityPage.value = Math.max(1, cityPage.value - 1)
}

const onCityNextPage = (): void => {
  cityPage.value += 1
}

const onMethodPrevPage = (): void => {
  methodPage.value = Math.max(1, methodPage.value - 1)
}

const onMethodNextPage = (): void => {
  methodPage.value += 1
}
</script>

<style scoped>
.dashboard-root {
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
  height: 1024px;
  background: #4658ac;
}

.sidebar-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
  pointer-events: none;
}

.sidebar-top {
  position: relative;
  height: 64px;
  background: #0e1b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-mark {
  width: 33px;
  height: 30px;
  border-radius: 8px;
  background: #8da2fb;
}

.logo-text {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.sidebar-content {
  position: relative;
  padding: 32px 20px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-section-title {
  height: 19px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.section-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
}

.gear {
  border: 2px solid #fff;
  border-radius: 50%;
}

.chev-down {
  margin-left: auto;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 8px solid #fff;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-link,
.sidebar-group {
  width: 216px;
  min-height: 19px;
  padding: 0 36px;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
}

.nav-link.active {
  height: 35px;
  border-radius: 8px;
  background: #4255d0;
  padding-top: 8px;
  padding-bottom: 8px;
}

.sidebar-group {
  opacity: 0.5;
  padding-left: 24px;
}

.sidebar-profile {
  position: absolute;
  left: 20px;
  bottom: 128px;
  width: 205px;
  border: 0;
  background: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  cursor: pointer;
  text-align: left;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-text {
  font-size: 16px;
  line-height: 19.36px;
}

.topbar {
  position: absolute;
  left: 256px;
  top: 0;
  width: 1184px;
  height: 80px;
  background: #fff;
}

.breadcrumb {
  position: absolute;
  left: 40px;
  top: 28px;
  border: 0;
  background: transparent;
  padding: 0;
  color: #4658ac;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  cursor: pointer;
}

.bell-btn {
  position: absolute;
  right: 40px;
  top: 30px;
  border: 0;
  background: transparent;
  width: 18px;
  height: 20px;
  padding: 0;
  cursor: pointer;
}

.bell-icon {
  display: block;
  width: 18px;
  height: 15px;
  border: 2px solid #000;
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
  border-bottom: 0;
  position: relative;
}

.bell-icon::after {
  content: '';
  position: absolute;
  left: 7px;
  top: 17px;
  width: 3px;
  border-bottom: 2px solid #000;
}

.page-title {
  position: absolute;
  left: 296px;
  top: 100px;
  margin: 0;
  color: #000;
  font-size: 32px;
  font-weight: 600;
  line-height: 38.73px;
}

.card {
  position: absolute;
  background: #fff;
  border-radius: 12px;
}

.card-countries {
  left: 296px;
  top: 151px;
  width: 1104px;
  height: 389px;
  padding: 32px;
}

.card-cities {
  left: 296px;
  top: 560px;
  width: 548px;
  height: 515px;
  padding: 32px;
}

.card-methods {
  left: 852px;
  top: 560px;
  width: 548px;
  height: 515px;
  padding: 32px;
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 33px;
}

.card-header-row.small {
  height: 31px;
}

.card-title {
  margin: 0;
  color: #27272a;
  font-size: 18px;
  font-weight: 400;
  line-height: 21.78px;
}

.card-title.small {
  font-size: 16px;
  line-height: 19.36px;
}

.primary-btn {
  height: 33px;
  border: 0;
  border-radius: 10px;
  background: #4658e4;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.plus {
  font-size: 18px;
  line-height: 10px;
}

.search-box {
  margin-top: 18px;
  height: 41px;
  border: 1px solid rgba(71, 99, 228, 0.5);
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  gap: 8px;
}

.search-box.narrow {
  width: 484px;
  margin-top: 14px;
}

.search-icon {
  width: 14px;
  height: 14px;
  border: 2px solid #18181b;
  border-radius: 50%;
  position: relative;
  flex: 0 0 auto;
}

.search-icon::after {
  content: '';
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 4px;
  border-bottom: 2px solid #18181b;
  transform: rotate(45deg);
}

.search-input {
  border: 0;
  outline: none;
  width: 100%;
  font-size: 14px;
  line-height: 16.94px;
  color: #27272a;
}

.search-input::placeholder {
  color: #a1a1aa;
}

.table-head {
  margin-top: 20px;
  color: #a1a1aa;
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
}

.countries-grid,
.three-grid {
  display: grid;
  align-items: center;
  column-gap: 8px;
}

.countries-grid {
  grid-template-columns: 254px 254px 254px 254px;
}

.three-grid {
  grid-template-columns: 156px 156px 156px;
}

.table-row {
  min-height: 44px;
  border-top: 1px solid #f4f4f5;
  color: #27272a;
  font-size: 14px;
  font-weight: 400;
  line-height: 16.94px;
  padding-top: 12px;
}

.table-row.compact {
  min-height: 40px;
  padding-top: 8px;
}

.row-actions {
  display: flex;
  gap: 4px;
}

.row-actions.tight .ghost-btn,
.row-actions.tight .danger-btn {
  width: 76px;
}

.ghost-btn,
.danger-btn {
  width: 125px;
  height: 31px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.ghost-btn {
  border: 1px solid #5c73db;
  color: #5c73db;
  background: transparent;
}

.danger-btn {
  border: 0;
  color: #fff;
  background: #dc2626;
}

.ghost-btn.compact,
.danger-btn.compact {
  border-radius: 8px;
}

.card-footer {
  position: absolute;
  left: 32px;
  right: 32px;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.small-footer {
  bottom: 13px;
}

.summary {
  color: #4658e4;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
}

.summary.small {
  font-size: 14px;
  line-height: 20px;
}

.pagination-wide {
  height: 38px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
}

.page-arrow,
.page-chip {
  width: 41px;
  border: 0;
  border-right: 1px solid #d4d4d8;
  background: #fff;
  color: #27272a;
  font-size: 14px;
  cursor: pointer;
}

.page-arrow {
  width: 36px;
}

.page-chip.active {
  background: #4658e4;
  color: #fff;
}

.pager-mini {
  display: flex;
  gap: 4px;
}

.pager-btn {
  height: 38px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  background: #fff;
  color: #27272a;
  font-size: 12px;
  font-weight: 400;
  padding: 0 12px;
  cursor: pointer;
}

.pager-mini.disabled .pager-btn,
.pager-btn.disabled {
  border-color: #f4f4f5;
  color: #e4e4e7;
}
</style>
