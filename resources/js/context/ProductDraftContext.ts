import { createContext } from "react";

export const ProductDraftContext = createContext<{
  draftId: string | null;
  saveDraft: () => Promise<void>;
  unsaveDraftCleanup : () => Promise<void>;
}>({
  draftId: null,
  saveDraft: async () => {} ,
  unsaveDraftCleanup: async () => {} ,
});
