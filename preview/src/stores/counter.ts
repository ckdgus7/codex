import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count += 5;
    },
    reset() {
      this.count = 0;
    },
  },
});
