import { RefObject } from "react";
import {  FashionAttributes, ProductVariant } from "./productsTypes";

// Base types
export interface Color {
    id?: number;
    name?: string;
    hex: string;
}
export type Season = "summer" | "winter" | "automn" | "spring"
export interface Size {
    id: number ;
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

export interface Cover {
    id: string | undefined ;
    path: string | undefined;
}



export type Style = "oversize"  | "streetwear" | "casual" | "formal" | "sportswear"

export interface FashionOptions {
  colors : Color[]
  sizes : Size[]
  fits : Fit[]
  materials : Material[]
}

export interface ParfumeOptions {

}

export interface ElectronicsOptions {

}

// Options from Laravel
export type NicheOptions  =  FashionOptions | ParfumeOptions | ElectronicsOptions

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