export interface Document {
  id: string;
  title: string;
  priority: number;
  type: string;
  lastUpdated: string;
  status: 'pending' | 'reviewed' | 'approved';
}

export interface DocumentStore {
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  reorderDocuments: (startIndex: number, endIndex: number) => void;
  saveNewOrder: () => void;
  resetOrder: () => void;
  isLoading: boolean;
  error: string | null;
}