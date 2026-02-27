<script setup lang="ts"></script>

<template>
  <v-app>
    <v-app-bar elevation="1">
      <v-app-bar-title>test1</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" href="https://naver.com" target="_blank">Docs</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
