import { createContext } from "react";

export const ProductDraftContext = createContext<{
  draftId: string | null;
  saveDraft: () => Promise<string | null>;
  unsaveDraftCleanup : () => Promise<void>;
}>({
  draftId: null,
  saveDraft: async () => null ,
  unsaveDraftCleanup: async () => {} ,
});
