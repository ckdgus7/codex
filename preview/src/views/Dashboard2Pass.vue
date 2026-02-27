<template>
  <div class="dashboard2-pass">
    <aside class="sidebar">
      <div class="sidebar-bg"></div>
      <img class="sidebar-pattern" :src="assets.pattern" alt="" aria-hidden="true" />

      <div class="sidebar-top">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true"></div>
          <div class="brand-text">FORCE</div>
        </div>
      </div>

      <div class="sidebar-body">
        <div class="menu-group">
          <div class="menu-head">
            <span class="menu-dot" aria-hidden="true"></span>
            <span>Configuration</span>
            <span class="chev-down" aria-hidden="true"></span>
          </div>

          <button class="menu-item">Utilisateurs</button>
          <button class="menu-item active">Base</button>
          <button class="menu-item">Controle</button>
          <button class="menu-item">Workflow</button>
          <button class="menu-item">Alertes</button>
          <button class="menu-item">Roles</button>
          <button class="menu-item">Preferences</button>
          <button class="menu-item">Calendrier</button>
        </div>

        <div class="menu-folders">
          <div class="fold-row"><span>Dossier</span><span class="chev-right"></span></div>
          <div class="fold-row"><span>Projet</span><span class="chev-right"></span></div>
          <div class="fold-row"><span>Direction Technique</span><span class="chev-right"></span></div>
          <div class="fold-row"><span>Protection</span><span class="chev-right"></span></div>
        </div>

        <div class="user-card">
          <img :src="assets.avatar" alt="Tim Cook" />
          <p>
            <strong>Tim Cook</strong>
            <span>timcook@force.com</span>
          </p>
        </div>
      </div>
    </aside>

    <main class="content">
      <header class="topbar">
        <span class="crumb">Base</span>
        <button class="bell" aria-label="Notifications">
          <span class="bell-shape"></span>
        </button>
      </header>

      <section class="page">
        <h1>Base</h1>

        <article class="panel large-panel">
          <div class="panel-head">
            <h2>Liste des pays</h2>
            <button class="cta">Ajouter <span>+</span></button>
          </div>

          <label class="search">
            <span class="search-icon"></span>
            <input type="text" placeholder="Vous cherchez un pays ..." />
          </label>

          <div class="table table-4">
            <div class="thead">
              <span>Libelle</span>
              <span>Code ISO</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            <div v-for="row in countries" :key="row.id" class="trow">
              <span>{{ row.label }}</span>
              <span>{{ row.code }}</span>
              <span>{{ row.desc }}</span>
              <div class="actions">
                <button class="btn-outline">Modifier</button>
                <button class="btn-danger">Supprimer</button>
              </div>
            </div>
          </div>

          <div class="panel-foot">
            <p class="sum">02 pays</p>
            <div class="pager full">
              <button class="arrow left" aria-label="Page precedente"></button>
              <button class="p active">1</button>
              <button class="p">2</button>
              <button class="p">3</button>
              <button class="p">...</button>
              <button class="p">8</button>
              <button class="p">9</button>
              <button class="p">10</button>
              <button class="arrow right" aria-label="Page suivante"></button>
            </div>
          </div>
        </article>

        <section class="cards-grid">
          <article class="panel small-panel">
            <div class="panel-head">
              <h3>Liste des villes</h3>
              <button class="cta">Ajouter <span>+</span></button>
            </div>

            <label class="search">
              <span class="search-icon"></span>
              <input type="text" placeholder="Vous cherchez une ville ..." />
            </label>

            <div class="table table-3">
              <div class="thead">
                <span>Libelle</span>
                <span>Description</span>
                <span>Actions</span>
              </div>

              <div v-for="row in cities" :key="row.id" class="trow">
                <span>{{ row.label }}</span>
                <span>{{ row.desc }}</span>
                <div class="actions">
                  <button class="btn-outline small">Modifier</button>
                  <button class="btn-danger small">Supprimer</button>
                </div>
              </div>
            </div>

            <div class="panel-foot small-foot">
              <p class="sum">07 villes</p>
              <div class="pager simple">
                <button class="nav-btn">Precedent</button>
                <button class="nav-btn">Suivant</button>
              </div>
            </div>
          </article>

          <article class="panel small-panel">
            <div class="panel-head">
              <h3>Liste des methodes d'evaluation</h3>
              <button class="cta">Ajouter <span>+</span></button>
            </div>

            <label class="search">
              <span class="search-icon"></span>
              <input type="text" placeholder="Vous cherchez une methode d'evaluation ..." />
            </label>

            <div class="table table-3">
              <div class="thead">
                <span>Libelle</span>
                <span>Description</span>
                <span>Actions</span>
              </div>

              <div class="trow">
                <span>SWOT</span>
                <span>.</span>
                <div class="actions">
                  <button class="btn-outline small">Modifier</button>
                  <button class="btn-danger small">Supprimer</button>
                </div>
              </div>
            </div>

            <div class="panel-foot small-foot">
              <p class="sum">01 Methode</p>
              <div class="pager simple disabled">
                <button class="nav-btn">Precedent</button>
                <button class="nav-btn">Suivant</button>
              </div>
            </div>
          </article>

          <article class="panel small-panel">
            <div class="panel-head">
              <h3>Liste des domaines de diligences et risques</h3>
              <button class="cta alt">Creer <span>+</span></button>
            </div>

            <label class="search">
              <span class="search-icon"></span>
              <input type="text" placeholder="Vous cherchez un domaine de diligences et risques ..." />
            </label>

            <div class="table table-3">
              <div class="thead">
                <span>Libelle</span>
                <span>Description</span>
                <span>Actions</span>
              </div>
            </div>

            <div class="panel-foot small-foot">
              <p class="sum">Aucun domaine</p>
              <div class="pager simple disabled">
                <button class="nav-btn">Precedent</button>
                <button class="nav-btn">Suivant</button>
              </div>
            </div>
          </article>

          <article class="panel small-panel">
            <div class="panel-head">
              <h3>Liste des competences</h3>
              <button class="cta alt">Creer <span>+</span></button>
            </div>

            <label class="search">
              <span class="search-icon"></span>
              <input type="text" placeholder="Vous cherchez une competence ..." />
            </label>

            <div class="table table-3">
              <div class="thead">
                <span>Libelle</span>
                <span>Description</span>
                <span>Actions</span>
              </div>
            </div>

            <div class="panel-foot small-foot">
              <p class="sum">Aucun domaine</p>
              <div class="pager simple disabled">
                <button class="nav-btn">Precedent</button>
                <button class="nav-btn">Suivant</button>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  </div>
</template>

<script setup>
const assets = {
  pattern: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/d6b8ef68-11f6-48fb-a4bd-51b076b73159',
  avatar: 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/54bce8de-e088-4ba9-aa03-69cb87a473a5',
};

const countries = [
  { id: 'cmr', label: 'Tortor.', code: 'CMR', desc: 'alexander.foley@gmail.com' },
  { id: 'gab', label: 'Gabon', code: 'GAB', desc: 'alexander.foley@gmail.com' },
];

const cities = [
  { id: 'tellus', label: 'Tellus.', desc: 'Libero scelerisque massa quis mauris nisl.' },
  { id: 'kribi', label: 'Kribi', desc: '.' },
  { id: 'libreville', label: 'Libreville', desc: '.' },
  { id: 'yagoua', label: 'Yagoua', desc: '.' },
];
</script>

<style scoped>
.dashboard2-pass {
  --bg: #fafafa;
  --surface: #ffffff;
  --text: #27272a;
  --muted: #a1a1aa;
  --line: #f4f4f5;
  --blue: #4758ac;
  --blue-dark: #4458ac;
  --blue-soft: rgba(71, 88, 172, 0.5);
  --blue-outline: #5c73db;
  --danger: #dc2626;
  --stroke: #d4d4d8;
  --disabled: #e4e4e7;
  display: grid;
  grid-template-columns: 256px 1fr;
  min-height: 1024px;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.sidebar {
  position: relative;
  overflow: hidden;
  min-height: 1024px;
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

.sidebar-top,
.sidebar-body {
  position: relative;
  z-index: 1;
}

.sidebar-top {
  height: 64px;
  background: #0e1b6b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand {
  width: 143px;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #8da2fb;
  transform: rotate(45deg);
}

.brand-text {
  color: #fff;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0.2px;
}

.sidebar-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 64px);
  padding: 24px 20px 32px;
}

.menu-group {
  color: #fff;
}

.menu-head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 19px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
}

.menu-dot {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-radius: 3px;
  box-sizing: border-box;
}

.chev-down,
.chev-right {
  margin-left: auto;
  width: 10px;
  height: 10px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}

.chev-down {
  transform: rotate(45deg);
}

.chev-right {
  transform: rotate(-45deg);
  width: 8px;
  height: 8px;
}

.menu-item {
  width: 216px;
  height: 19px;
  padding: 0 36px;
  margin: 0 0 12px;
  border: 0;
  border-radius: 8px;
  text-align: left;
  color: #fff;
  background: transparent;
  font-size: 16px;
  line-height: 19px;
  cursor: default;
}

.menu-item.active {
  height: 35px;
  margin-top: 12px;
  margin-bottom: 12px;
  line-height: 19px;
  background: #4255d0;
}

.menu-folders {
  margin-top: -60px;
  opacity: 0.5;
}

.fold-row {
  height: 19px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 16px;
  margin-bottom: 24px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.user-card img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-card p {
  margin: 0;
  display: flex;
  flex-direction: column;
}

.user-card strong {
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
}

.user-card span {
  font-size: 14px;
  line-height: 17px;
}

.content {
  min-width: 0;
}

.topbar {
  height: 80px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}

.crumb {
  color: var(--blue-dark);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.bell {
  width: 18px;
  height: 20px;
  border: 0;
  background: transparent;
  padding: 0;
  display: grid;
  place-items: center;
}

.bell-shape {
  width: 14px;
  height: 15px;
  border: 2px solid #000;
  border-radius: 8px 8px 4px 4px;
  position: relative;
}

.bell-shape::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 4px;
  height: 1px;
  transform: translateX(-50%);
  border-top: 2px solid #000;
}

.page {
  padding: 20px 40px 30px;
}

h1 {
  margin: 0 0 12px;
  font-size: 32px;
  line-height: 39px;
  font-weight: 600;
}

.panel {
  background: var(--surface);
  border-radius: 12px;
}

.large-panel {
  width: 1104px;
  min-height: 389px;
  padding: 32px;
}

.panel-head {
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-head h2,
.panel-head h3 {
  margin: 0;
  font-weight: 400;
  color: var(--text);
}

.panel-head h2 {
  font-size: 18px;
  line-height: 22px;
}

.panel-head h3 {
  font-size: 16px;
  line-height: 19px;
}

.cta {
  height: 33px;
  border: 0;
  border-radius: 10px;
  padding: 8px;
  background: var(--blue);
  color: #fff;
  font-size: 14px;
  line-height: 17px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cta.alt {
  height: 31px;
  border-radius: 8px;
  padding: 6px;
  font-size: 16px;
  line-height: 19px;
}

.search {
  margin-top: 14px;
  width: 100%;
  height: 41px;
  border: 1px solid var(--blue-soft);
  border-radius: 10px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}

.search-icon {
  width: 14px;
  height: 14px;
  border: 2px solid #18181b;
  border-radius: 50%;
  position: relative;
}

.search-icon::after {
  content: '';
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 4px;
  border-top: 2px solid #18181b;
  transform: rotate(45deg);
}

.search input {
  border: 0;
  outline: 0;
  width: 100%;
  font-size: 14px;
  line-height: 17px;
  color: var(--text);
}

.search input::placeholder {
  color: var(--muted);
}

.table {
  margin-top: 20px;
}

.thead,
.trow {
  display: grid;
  align-items: center;
  column-gap: 8px;
}

.table-4 .thead,
.table-4 .trow {
  grid-template-columns: 254px 254px 254px 254px;
}

.table-3 .thead,
.table-3 .trow {
  grid-template-columns: 156px 156px 156px;
}

.thead {
  height: 19px;
  color: var(--muted);
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
}

.trow {
  min-height: 40px;
  border-top: 1px solid var(--line);
  color: var(--text);
  font-size: 14px;
  line-height: 17px;
  padding-top: 9px;
}

.large-panel .trow {
  min-height: 44px;
  padding-top: 13px;
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
  padding: 8px;
  font-size: 12px;
  line-height: 15px;
  font-weight: 500;
}

.btn-outline {
  border: 1px solid var(--blue-outline);
  background: #fff;
  color: var(--blue-outline);
}

.btn-danger {
  border: 0;
  background: var(--danger);
  color: #fff;
}

.btn-outline.small,
.btn-danger.small {
  width: 76px;
  border-radius: 8px;
}

.panel-foot {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sum {
  margin: 0;
  color: var(--blue);
  font-size: 16px;
  line-height: 24px;
}

.small-foot .sum {
  font-size: 14px;
  line-height: 20px;
}

.pager {
  display: inline-flex;
  align-items: center;
}

.pager.full {
  height: 38px;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  overflow: hidden;
}

.p {
  height: 38px;
  min-width: 39px;
  border: 0;
  border-left: 1px solid var(--stroke);
  background: #fff;
  color: var(--text);
  font-size: 14px;
  line-height: 20px;
  padding: 8px 16px;
}

.p.active {
  background: var(--blue);
  color: #fff;
  border-left-color: var(--blue);
}

.arrow {
  width: 36px;
  height: 38px;
  background: #fff;
  border: 0;
  position: relative;
}

.arrow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 10px;
  border-right: 2px solid #71717a;
  border-bottom: 2px solid #71717a;
}

.arrow.left {
  border-right: 1px solid var(--stroke);
}

.arrow.left::before {
  transform: translate(-30%, -50%) rotate(135deg);
}

.arrow.right {
  border-left: 1px solid var(--stroke);
}

.arrow.right::before {
  transform: translate(-70%, -50%) rotate(-45deg);
}

.cards-grid {
  width: 1104px;
  margin-top: 20px;
  display: grid;
  grid-template-columns: 548px 548px;
  column-gap: 8px;
  row-gap: 20px;
}

.small-panel {
  min-height: 515px;
  padding: 32px;
}

.pager.simple {
  display: inline-flex;
  gap: 4px;
}

.nav-btn {
  height: 38px;
  border: 1px solid var(--stroke);
  border-radius: 8px;
  background: #fff;
  color: var(--text);
  font-size: 12px;
  line-height: 16px;
  padding: 8px 12px;
}

.pager.simple.disabled .nav-btn {
  border-color: var(--line);
  color: #e4e4e7;
}

@media (max-width: 1480px) {
  .large-panel,
  .cards-grid {
    width: 100%;
  }

  .table-4 .thead,
  .table-4 .trow {
    grid-template-columns: repeat(4, minmax(120px, 1fr));
  }

  .table-3 .thead,
  .table-3 .trow {
    grid-template-columns: repeat(3, minmax(120px, 1fr));
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .dashboard2-pass {
    grid-template-columns: 1fr;
  }

  .sidebar {
    min-height: 320px;
  }

  .page,
  .topbar {
    padding-left: 20px;
    padding-right: 20px;
  }

  .panel {
    padding: 20px;
  }
}
</style>
