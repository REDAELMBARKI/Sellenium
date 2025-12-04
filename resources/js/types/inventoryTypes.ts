import { RefObject } from "react";
import { ProductVariant } from "./productsTypes";

// Base types
export interface Color {
    id: number;
    name?: string;
    hex: string;
}

export interface Size {
    id: number;
    name: string;
}

export interface Fit {
    id: number;
    name: string;
}

export interface Material {
    id: number;
    name: string;
}

// Options from Laravel
export interface InventoryOptions {
    [key : string] : string[]
}

// For Inertia useForm (needs index signature)




// Context type
export interface InventoryContextType {
    productVariants: ProductVariant[];
    setProductVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>;
    currentVariant: ProductVariant;
    setCurrentVariant: React.Dispatch<React.SetStateAction<ProductVariant>>;
    inventoryValid: boolean;
    setInventoryValid: React.Dispatch<React.SetStateAction<boolean>>;
    newSelectedColors: Color[];
    setNewSelectedColors: React.Dispatch<React.SetStateAction<Color[]>>;
    updateVariantMode: boolean;
    setUpdateVariantMode: React.Dispatch<React.SetStateAction<boolean>>;
    isCurrentVariantActive: boolean;
    setIsCurrentVariantActive: React.Dispatch<React.SetStateAction<boolean>>;
    variantFormRef: RefObject<HTMLFormElement | null>;
}