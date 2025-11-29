
import { ProductFormContext } from "@/context/createproductContext/ProductFormContext";
import { ProductFormContextType } from "@/types/productsTypes";
import { useContext } from "react";

// Hook
export const useProductForm = (): ProductFormContextType => {
    const context = useContext(ProductFormContext);
    if (!context) {
        throw new Error("useProductForm must be used within ProductFormProvider");
    }
    return context;
};