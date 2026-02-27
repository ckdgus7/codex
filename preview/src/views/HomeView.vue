<script setup lang="ts">
  import { computed } from 'vue';
  import { useCounterStore } from '../stores/counter';

  const counter = useCounterStore();
  const doubled = computed(() => counter.count * 2);
</script>

<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="6" rounded="xl">
          <v-card-title class="text-h5">Vuetify + Pinia Starter</v-card-title>
          <v-card-text>
            <div class="text-body-1 mb-4">
              Count:
              <strong>{{ counter.count }}</strong>
              <span class="text-medium-emphasis">(doubled: {{ doubled }})</span>
            </div>
            <div class="d-flex justify-end ga-2">
              <v-btn size="small" color="primary" @click="counter.increment">Increment</v-btn>
              <v-btn size="small" color="secondary" variant="tonal" @click="counter.reset">Reset</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="xl">
          <v-card-title class="text-subtitle-1">Packages Ready</v-card-title>
          <v-card-text class="d-flex flex-wrap ga-2">
            <v-chip label color="primary" variant="tonal">Vue 3</v-chip>
            <v-chip label color="primary" variant="tonal">Vue Router 4</v-chip>
            <v-chip label color="primary" variant="tonal">Pinia 3</v-chip>
            <v-chip label color="primary" variant="tonal">Vuetify 3</v-chip>
            <v-chip label color="primary" variant="tonal">Axios</v-chip>
            <v-chip label color="primary" variant="tonal">VueUse</v-chip>
            <v-chip label color="primary" variant="tonal">Lodash</v-chip>
            <v-chip label color="primary" variant="tonal">Moment</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
