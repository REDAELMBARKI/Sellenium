import { RefObject } from "react";

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
    colors: Color[];
    sizes: Size[];
    fits: Fit[];
    materials: Material[];
}

// For Inertia useForm (needs index signature)
export interface InventoryItem {
    [key: string]: unknown;
    id: string | null;
    colors: Color[];
    sizes: Size[];
    fits: Fit[];
    materials: Material[];
    quantity: number;
    covers: string[];
}

// Product variant
export interface ProductVariant {
    [key: string]: unknown;
    id: string | null;
    colors: Color[];
    sizes: Size[];
    fits: Fit[];
    materials: Material[];
    quantity: number;
    covers: string[];
}

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