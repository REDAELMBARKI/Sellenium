import { ProductFormContext } from "@/context/ProductFormContext";
import { ProductFormContextType } from "@/types/createPageTypes";
import { useContext } from "react";

// Hook
export const useProductForm = (): ProductFormContextType => {
    const context = useContext(ProductFormContext);
    if (!context) {
        throw new Error("useProductForm must be used within ProductFormProvider");
    }
    return context;
};