// store/index.js
import { create } from 'zustand';

const useStore = create((set, get) => ({
  documents: [],
  stats: { categoryCounts: {} },
  
  setDocuments: (documents) => set({ documents }),
  
  calculateStats: () => {
    const { documents } = get();
    const categoryCounts = {};
    
    documents.forEach(doc => {
      categoryCounts[doc.category] = (categoryCounts[doc.category] || 0) + 1;
    });
    
    set({ stats: { categoryCounts } });
  },
}));

export default useStore;