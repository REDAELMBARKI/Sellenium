import { ProductDraftContext } from "@/context/ProductDraftContext";
import { useContext } from "react";

export const useProductDraft = () => {
  const ctx = useContext(ProductDraftContext);
  if (!ctx) {
    throw new Error('useProductDraft must be used within ProductDraftProvider');
  }
  return ctx;
};