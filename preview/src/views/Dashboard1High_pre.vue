<template>
  <div class="dashboard-root" role="main" aria-label="Dashboard / Base">
    <div class="page-bg" />

    <header class="topbar">
      <div class="breadcrumb" @click="() => onBreadcrumbClick()">Base</div>
      <button class="notif" type="button" aria-label="Notifications" @click="() => onNotificationClick()">
        <svg viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 1C5.686 1 3 3.686 3 7V10.2L1 13V14H17V13L15 10.2V7C15 3.686 12.314 1 9 1Z" stroke="currentColor" stroke-width="2" />
          <path d="M7.27 19H10.73" stroke="currentColor" stroke-width="2" />
        </svg>
      </button>
    </header>

    <h1 class="page-title">Base</h1>

    <section class="card countries-card">
      <div class="card-header">
        <h2>Liste des pays</h2>
        <button class="btn-add" type="button" @click="() => onAddCountry()">
          <span>Ajouter</span>
          <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>

      <button class="search" type="button" @click="() => onSearchCountry()">
        <span class="search-icon" aria-hidden="true" />
        <span class="search-text">Vous cherchez un pays ...</span>
      </button>

      <div class="table-head four-col">
        <span>Libellé</span>
        <span>Code ISO</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div class="table-body countries-body">
        <div v-for="row in countries" :key="row.id" class="table-row four-col">
          <span>{{ row.label }}</span>
          <span>{{ row.code }}</span>
          <span>{{ row.description }}</span>
          <div class="actions">
            <button class="btn-outline" type="button" @click="() => onEditCountry(row.id)">Modifier</button>
            <button class="btn-danger" type="button" @click="() => onDeleteCountry(row.id)">Supprimer</button>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <span class="summary">02 pays</span>
        <div class="pager wide">
          <button class="pager-btn" type="button" aria-label="Page précédente" @click="() => onCountryPrevPage()">‹</button>
          <button class="pager-btn active" type="button" @click="() => onCountryGoToPage(1)">1</button>
          <button class="pager-btn" type="button" @click="() => onCountryGoToPage(2)">2</button>
          <button class="pager-btn" type="button" @click="() => onCountryGoToPage(3)">3</button>
          <button class="pager-btn" type="button" disabled>...</button>
          <button class="pager-btn" type="button" @click="() => onCountryGoToPage(8)">8</button>
          <button class="pager-btn" type="button" @click="() => onCountryGoToPage(9)">9</button>
          <button class="pager-btn" type="button" @click="() => onCountryGoToPage(10)">10</button>
          <button class="pager-btn" type="button" aria-label="Page suivante" @click="() => onCountryNextPage()">›</button>
        </div>
      </div>
    </section>

    <section class="card cities-card">
      <div class="card-header">
        <h2>Liste des villes</h2>
        <button class="btn-add" type="button" @click="() => onAddCity()">
          <span>Ajouter</span>
          <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>

      <button class="search" type="button" @click="() => onSearchCity()">
        <span class="search-icon" aria-hidden="true" />
        <span class="search-text">Vous cherchez une ville ...</span>
      </button>

      <div class="table-head three-col">
        <span>Libellé</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div class="table-body city-body">
        <div v-for="row in cities" :key="row.id" class="table-row three-col">
          <span>{{ row.label }}</span>
          <span>{{ row.description }}</span>
          <div class="actions compact">
            <button class="btn-outline small" type="button" @click="() => onEditCity(row.id)">Modifier</button>
            <button class="btn-danger small" type="button" @click="() => onDeleteCity(row.id)">Supprimer</button>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <span class="summary">07 villes</span>
        <div class="pager mini">
          <button class="nav-btn" type="button" @click="() => onCityPrevPage()">Précedent</button>
          <button class="nav-btn" type="button" @click="() => onCityNextPage()">Suivant</button>
        </div>
      </div>
    </section>

    <section class="card diligence-card">
      <div class="card-header small-title">
        <h2>Liste des domaines de diligences et risques</h2>
        <button class="btn-create" type="button" @click="() => onCreateDiligence()">
          <span>Créer</span>
          <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>

      <button class="search" type="button" @click="() => onSearchDiligence()">
        <span class="search-icon" aria-hidden="true" />
        <span class="search-text">Vous cherchez un domaine de diligences et risques ...</span>
      </button>

      <div class="table-head three-col">
        <span>Libellé</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div class="table-body single-row">
        <div class="table-row three-col">
          <span>SWOT</span>
          <span>.</span>
          <div class="actions compact">
            <button class="btn-outline small" type="button" @click="() => onEditDiligence('swot')">Modifier</button>
            <button class="btn-danger small" type="button" @click="() => onDeleteDiligence('swot')">Supprimer</button>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <span class="summary">01 Méthode</span>
        <div class="pager mini disabled-look">
          <button class="nav-btn disabled" type="button" disabled>Précedent</button>
          <button class="nav-btn disabled" type="button" disabled>Suivant</button>
        </div>
      </div>
    </section>

    <section class="card methods-card">
      <div class="card-header">
        <h2>Liste des méthodes d'évaluation</h2>
        <button class="btn-add" type="button" @click="() => onAddMethod()">
          <span>Ajouter</span>
          <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>

      <button class="search" type="button" @click="() => onSearchMethod()">
        <span class="search-icon" aria-hidden="true" />
        <span class="search-text">Vous cherchez une méthode d'évaluation ...</span>
      </button>

      <div class="table-head three-col">
        <span>Libellé</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div class="table-body single-row">
        <div class="table-row three-col">
          <span>SWOT</span>
          <span>.</span>
          <div class="actions compact">
            <button class="btn-outline small" type="button" @click="() => onEditMethod('swot')">Modifier</button>
            <button class="btn-danger small" type="button" @click="() => onDeleteMethod('swot')">Supprimer</button>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <span class="summary">Aucun domaine</span>
        <div class="pager mini disabled-look">
          <button class="nav-btn disabled" type="button" disabled>Précedent</button>
          <button class="nav-btn disabled" type="button" disabled>Suivant</button>
        </div>
      </div>
    </section>

    <section class="card domains-card">
      <div class="card-header small-title">
        <h2>Liste des domaines de diligences et risques</h2>
        <button class="btn-create" type="button" @click="() => onCreateDomain()">
          <span>Créer</span>
          <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>

      <button class="search" type="button" @click="() => onSearchDomain()">
        <span class="search-icon" aria-hidden="true" />
        <span class="search-text">Vous cherchez un domaine de diligences et risques ...</span>
      </button>

      <div class="table-head three-col">
        <span>Libellé</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div class="card-footer">
        <span class="summary">Aucun domaine</span>
        <div class="pager mini disabled-look">
          <button class="nav-btn disabled" type="button" disabled>Précedent</button>
          <button class="nav-btn disabled" type="button" disabled>Suivant</button>
        </div>
      </div>
    </section>

    <section class="card skills-card">
      <div class="card-header small-title">
        <h2>Liste des compétences</h2>
        <button class="btn-create" type="button" @click="() => onCreateSkill()">
          <span>Créer</span>
          <span class="plus" aria-hidden="true">+</span>
        </button>
      </div>

      <button class="search" type="button" @click="() => onSearchSkill()">
        <span class="search-icon" aria-hidden="true" />
        <span class="search-text">Vous cherchez une compétence ...</span>
      </button>

      <div class="table-head three-col">
        <span>Libellé</span>
        <span>Description</span>
        <span>Actions</span>
      </div>

      <div class="card-footer">
        <span class="summary">Aucun domaine</span>
        <div class="pager mini disabled-look">
          <button class="nav-btn disabled" type="button" disabled>Précedent</button>
          <button class="nav-btn disabled" type="button" disabled>Suivant</button>
        </div>
      </div>
    </section>

    <aside class="sidebar">
      <div class="sidebar-fill" />
      <img class="sidebar-pattern" src="./assets/I1_43619_1_288.png" alt="" />

      <div class="sidebar-top">
        <div class="logo-mark" aria-hidden="true" />
        <div class="logo-type">Logotype</div>
      </div>

      <div class="sidebar-content">
        <div class="section-title">
          <span>Configuration</span>
          <span>⌄</span>
        </div>

        <div class="link-group">
          <button class="side-link" type="button" @click="() => onSideLinkClick('Utilisateurs')">Utilisateurs</button>
          <button class="side-link active" type="button" @click="() => onSideLinkClick('Base')">Base</button>
          <button class="side-link" type="button" @click="() => onSideLinkClick('Contrôle')">Contrôle</button>
          <button class="side-link" type="button" @click="() => onSideLinkClick('Workflow')">Workflow</button>
          <button class="side-link" type="button" @click="() => onSideLinkClick('Alertes')">Alertes</button>
          <button class="side-link" type="button" @click="() => onSideLinkClick('Rôles')">Rôles</button>
          <button class="side-link" type="button" @click="() => onSideLinkClick('Préferences')">Préferences</button>
          <button class="side-link" type="button" @click="() => onSideLinkClick('Calendrier')">Calendrier</button>
        </div>

        <button class="section-collapsed" type="button" @click="() => onSideLinkClick('Dossier')">
          <span>Dossier</span>
          <span>⌃</span>
        </button>
        <button class="section-collapsed" type="button" @click="() => onSideLinkClick('Projet')">
          <span>Projet</span>
          <span>⌃</span>
        </button>
        <button class="section-collapsed" type="button" @click="() => onSideLinkClick('Direction Technique')">
          <span>Direction Technique</span>
          <span>⌃</span>
        </button>
        <button class="section-collapsed" type="button" @click="() => onSideLinkClick('Protection')">
          <span>Protection</span>
          <span>⌃</span>
        </button>
      </div>

      <div class="sidebar-user">
        <img src="./assets/I1_43619_1_350.png" alt="Tim Cook" />
        <div>
          <p>Tim Cook</p>
          <p>timcook@force.com</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

interface CountryRow {
  id: string
  label: string
  code: string
  description: string
}

interface CityRow {
  id: string
  label: string
  description: string
}

const useDashboard1HighStore = defineStore('dashboard1High', {
  state: () => ({
    countryPage: 1,
    cityPage: 1,
    lastAction: '',
  }),
  actions: {
    setCountryPage(page: number) {
      this.countryPage = page
    },
    setCityPage(page: number) {
      this.cityPage = page
    },
    setLastAction(action: string) {
      this.lastAction = action
    },
  },
})

const router = useRouter()
const dashboardStore = useDashboard1HighStore()
const { countryPage, cityPage } = storeToRefs(dashboardStore)

const countries: CountryRow[] = [
  {
    id: 'cmr',
    label: 'Tortor.',
    code: 'CMR',
    description: 'alexander.foley@gmail.com',
  },
  {
    id: 'gab',
    label: 'Gabon',
    code: 'GAB',
    description: 'alexander.foley@gmail.com',
  },
]

const cities: CityRow[] = [
  { id: 'tellus', label: 'Tellus.', description: 'Libero scelerisque massa quis mauris nisl.' },
  { id: 'kribi', label: 'Kribi', description: '.' },
  { id: 'libreville', label: 'Libreville', description: '.' },
  { id: 'yagoua', label: 'Yagoua', description: '.' },
  { id: 'yaounde', label: 'Yaoundé', description: '.' },
]

function track(action: string): void {
  dashboardStore.setLastAction(action)
}

function onBreadcrumbClick(): void {
  track('breadcrumb.base')
}

function onNotificationClick(): void {
  track('notification.open')
}

function onAddCountry(): void {
  track('country.add')
}

function onSearchCountry(): void {
  track('country.search')
}

function onEditCountry(id: string): void {
  track(`country.edit.${id}`)
}

function onDeleteCountry(id: string): void {
  track(`country.delete.${id}`)
}

function onCountryPrevPage(): void {
  dashboardStore.setCountryPage(Math.max(1, countryPage.value - 1))
  track('country.page.prev')
}

function onCountryNextPage(): void {
  dashboardStore.setCountryPage(countryPage.value + 1)
  track('country.page.next')
}

function onCountryGoToPage(page: number): void {
  dashboardStore.setCountryPage(page)
  track(`country.page.${page}`)
}

function onAddCity(): void {
  track('city.add')
}

function onSearchCity(): void {
  track('city.search')
}

function onEditCity(id: string): void {
  track(`city.edit.${id}`)
}

function onDeleteCity(id: string): void {
  track(`city.delete.${id}`)
}

function onCityPrevPage(): void {
  dashboardStore.setCityPage(Math.max(1, cityPage.value - 1))
  track('city.page.prev')
}

function onCityNextPage(): void {
  dashboardStore.setCityPage(cityPage.value + 1)
  track('city.page.next')
}

function onCreateDiligence(): void {
  track('diligence.create')
}

function onSearchDiligence(): void {
  track('diligence.search')
}

function onEditDiligence(id: string): void {
  track(`diligence.edit.${id}`)
}

function onDeleteDiligence(id: string): void {
  track(`diligence.delete.${id}`)
}

function onAddMethod(): void {
  track('method.add')
}

function onSearchMethod(): void {
  track('method.search')
}

function onEditMethod(id: string): void {
  track(`method.edit.${id}`)
}

function onDeleteMethod(id: string): void {
  track(`method.delete.${id}`)
}

function onCreateDomain(): void {
  track('domain.create')
}

function onSearchDomain(): void {
  track('domain.search')
}

function onCreateSkill(): void {
  track('skill.create')
}

function onSearchSkill(): void {
  track('skill.search')
}

function onSideLinkClick(linkName: string): void {
  track(`sidebar.${linkName}`)
  if (linkName === 'Base') {
    void router.push({ name: 'base' }).catch(() => {})
  }
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

.page-bg {
  position: absolute;
  inset: 0;
  background: #fafafa;
  z-index: 0;
}

.topbar {
  position: absolute;
  left: 256px;
  top: 0;
  width: 1184px;
  height: 80px;
  background: #ffffff;
  z-index: 1;
}

.breadcrumb {
  position: absolute;
  left: 40px;
  top: 28px;
  width: 38px;
  height: 24px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: #4658ac;
  cursor: pointer;
}

.notif {
  position: absolute;
  left: 1126px;
  top: 30px;
  width: 18px;
  height: 20px;
  border: 0;
  background: transparent;
  color: #000000;
  padding: 0;
  cursor: pointer;
}

.page-title {
  position: absolute;
  left: 296px;
  top: 100px;
  margin: 0;
  font-size: 32px;
  line-height: 38.7273px;
  font-weight: 600;
  color: #000000;
  z-index: 2;
}

.card {
  position: absolute;
  background: #ffffff;
  border-radius: 12px;
  z-index: 2;
}

.countries-card {
  left: 296px;
  top: 151px;
  width: 1104px;
  height: 389px;
}

.cities-card {
  left: 296px;
  top: 560px;
  width: 548px;
  height: 515px;
}

.diligence-card {
  left: 296px;
  top: 1095px;
  width: 548px;
  height: 515px;
}

.methods-card {
  left: 852px;
  top: 560px;
  width: 548px;
  height: 515px;
}

.domains-card {
  left: 852px;
  top: 1095px;
  width: 548px;
  height: 515px;
}

.skills-card {
  display: none;
}

.card-header {
  position: absolute;
  left: 32px;
  top: 32px;
  width: calc(100% - 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h2 {
  margin: 0;
  font-weight: 400;
  font-size: 18px;
  line-height: 21.7841px;
  color: #27272a;
}

.cities-card .card-header h2,
.methods-card .card-header h2 {
  font-size: 16px;
  line-height: 19.3636px;
}

.small-title h2 {
  font-size: 16px;
  line-height: 19.3636px;
}

.btn-add,
.btn-create {
  height: 33px;
  border: 0;
  border-radius: 10px;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #4763e4;
  color: #ffffff;
  font-size: 14px;
  line-height: 16.9432px;
  font-weight: 400;
  cursor: pointer;
}

.btn-create {
  height: 31px;
  padding: 6px;
  border-radius: 8px;
  font-size: 16px;
  line-height: 19.3636px;
}

.plus {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
}

.search {
  position: absolute;
  left: 32px;
  top: 83px;
  width: calc(100% - 64px);
  height: 41px;
  border: 1px solid rgba(71, 99, 228, 0.5);
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  cursor: pointer;
}

.search-icon {
  width: 16px;
  height: 16px;
  border: 2px solid #18181b;
  border-radius: 50%;
  position: relative;
  box-sizing: border-box;
}

.search-icon::after {
  content: '';
  position: absolute;
  width: 5px;
  height: 2px;
  background: #18181b;
  right: -4px;
  bottom: -2px;
  transform: rotate(45deg);
}

.search-text {
  font-size: 14px;
  line-height: 16.9432px;
  font-weight: 400;
  color: #a1a1aa;
}

.table-head {
  position: absolute;
  left: 32px;
  top: 144px;
  display: grid;
  gap: 8px;
  width: calc(100% - 64px);
  font-size: 16px;
  line-height: 19.3636px;
  font-weight: 500;
  color: #a1a1aa;
}

.four-col {
  grid-template-columns: 254px 254px 254px 254px;
}

.three-col {
  grid-template-columns: 156px 156px 156px;
}

.table-body {
  position: absolute;
  left: 32px;
  right: 32px;
}

.countries-body {
  top: 183px;
}

.city-body {
  top: 175px;
}

.single-row {
  top: 175px;
}

.table-row {
  display: grid;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  border-bottom: 1px solid #f4f4f5;
  font-size: 14px;
  line-height: 16.9432px;
  font-weight: 400;
  color: #27272a;
}

.actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.btn-outline,
.btn-danger {
  height: 31px;
  min-width: 125px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 14.5227px;
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

.compact .btn-outline,
.compact .btn-danger,
.small {
  min-width: 76px;
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

.summary {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #4763e4;
}

.countries-card .summary {
  font-size: 16px;
  line-height: 24px;
}

.pager {
  display: flex;
  align-items: center;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  overflow: hidden;
}

.wide {
  height: 38px;
}

.pager-btn {
  width: 38px;
  height: 38px;
  border: 0;
  border-right: 1px solid #d4d4d8;
  background: #ffffff;
  color: #27272a;
  font-size: 14px;
  line-height: 20px;
  cursor: pointer;
}

.pager-btn:last-child {
  border-right: 0;
}

.pager-btn.active {
  background: #4763e4;
  color: #ffffff;
}

.mini {
  border: 0;
  gap: 4px;
  overflow: visible;
}

.nav-btn {
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

.disabled-look .disabled {
  border-color: #f4f4f5;
  color: #e4e4e7;
  cursor: not-allowed;
}

.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 256px;
  height: 1024px;
  z-index: 20;
  overflow: hidden;
}

.sidebar-fill {
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
  position: absolute;
  left: 0;
  top: 0;
  width: 256px;
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

.logo-type {
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
}

.sidebar-content {
  position: absolute;
  left: 20px;
  top: 96px;
  width: 216px;
  color: #ffffff;
}

.section-title,
.section-collapsed {
  width: 216px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  background: transparent;
  border: 0;
  padding: 0;
  font-size: 16px;
  line-height: 19.3636px;
}

.link-group {
  margin-top: 12px;
  display: grid;
  gap: 12px;
}

.side-link {
  width: 216px;
  height: 19px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #ffffff;
  text-align: left;
  padding: 0 36px;
  font-size: 16px;
  line-height: 19.3636px;
  cursor: pointer;
}

.side-link.active {
  height: 35px;
  background: #4255d0;
  padding-top: 8px;
  padding-bottom: 8px;
}

.section-collapsed {
  margin-top: 24px;
  opacity: 0.5;
}

.sidebar-user {
  position: absolute;
  left: 20px;
  bottom: 128px;
  width: 205px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-user p {
  margin: 0;
  font-size: 16px;
  line-height: 19.3636px;
  color: #ffffff;
}

@media (max-width: 1440px) {
  .dashboard-root {
    transform-origin: top left;
    transform: scale(calc(100vw / 1440));
  }
}
</style>
