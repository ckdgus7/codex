import { defineStore } from 'pinia';
import { ref } from 'vue';

export type Country = {
  id: string;
  label: string;
  iso: string;
  description: string;
};

export const useDesPaysStore = defineStore('des-pays', () => {
  const countries = ref<Country[]>([
    { id: 'country-fr', label: 'France', iso: 'FRA', description: 'Pays europeen' },
    { id: 'country-kr', label: 'Coree du Sud', iso: 'KOR', description: 'Pays asiatique' },
    { id: 'country-jp', label: 'Japon', iso: 'JPN', description: 'Archipel en Asie' },
    { id: 'country-ca', label: 'Canada', iso: 'CAN', description: 'Pays d Amerique du Nord' },
    { id: 'country-cm', label: 'Cameroun', iso: 'CMR', description: 'Pays d Afrique centrale' },
  ]);

  return {
    countries,
  };
});
