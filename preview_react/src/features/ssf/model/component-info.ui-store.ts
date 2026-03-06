import { create } from "zustand";

interface ComponentInfoSelectionState {
  selectedIds: string[];
  toggleId: (id: string) => void;
  toggleAll: (ids: string[]) => void;
  clear: () => void;
}

export const useComponentInfoSelectionStore = create<ComponentInfoSelectionState>((set, get) => ({
  selectedIds: [],

  toggleId: (id) => {
    const { selectedIds } = get();
    if (selectedIds.includes(id)) {
      set({ selectedIds: selectedIds.filter((value) => value !== id) });
      return;
    }
    set({ selectedIds: [...selectedIds, id] });
  },

  toggleAll: (ids) => {
    const { selectedIds } = get();
    const allSelected = ids.every((id) => selectedIds.includes(id));
    if (allSelected) {
      set({ selectedIds: selectedIds.filter((id) => !ids.includes(id)) });
      return;
    }
    const next = new Set(selectedIds);
    ids.forEach((id) => next.add(id));
    set({ selectedIds: Array.from(next) });
  },

  clear: () => set({ selectedIds: [] }),
}));
