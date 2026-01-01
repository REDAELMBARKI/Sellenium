import { RefObject } from "react";
import { ProductVariant } from "./products/productVariantType";

// Base types
export interface Color {
    id?: string | number;
    name?: string;
    hex: string;
}
export type Season = "summer" | "winter" | "automn" | "spring"
export interface Size {
    id: string | number ;
    name: string;
}

export  interface Country {
    code: string;
    name: string;
}

export type Gender ="male" | "female" | "kids" | "all genders"


export interface Fit {
    id: string | number;
    name: string;
}

export interface Material {
    id: string | number;
    name: string;
}



export interface Category {
        id: string;
        name: string;
}

export interface Cover {
    id: string | null ;
    path: string | null;
}



export type Style = "oversize"  | "streetwear" | "casual" | "formal" | "sportswear"


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