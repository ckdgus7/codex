<template>
  <main class="about-view" aria-label="Table layout">
    <section class="table-grid" role="table" aria-label="Three column six row table">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        class="table-cell"
        :class="{ 'table-cell--header': cell.isHeader }"
        role="cell"
        aria-hidden="true"
      />
    </section>
  </main>
</template>

<script setup>
const rows = 6
const cols = 3

const cells = Array.from({ length: rows * cols }, (_, index) => {
  const row = Math.floor(index / cols)
  return {
    isHeader: row === 0
  }
})
</script>

<style scoped>
.about-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 156px;
  box-sizing: border-box;
  background: #ffffff;
}

.table-grid {
  width: 2232px;
  height: 1316px;
  display: grid;
  grid-template-columns: repeat(3, 744px);
  grid-template-rows: repeat(6, 219.3333px);
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.table-cell {
  background: #ffffff;
  box-sizing: border-box;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.table-cell--header {
  background: #1e1e1e;
}

.table-cell:nth-child(3n) {
  border-right: 0;
}

.table-cell:nth-last-child(-n + 3) {
  border-bottom: 0;
}
</style>
