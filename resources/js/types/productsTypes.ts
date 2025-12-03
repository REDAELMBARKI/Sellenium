import { NicheItem } from "@/context/NicheContext";
import { Color, Fit, InventoryItem, InventoryOptions, Material, Size } from "./inventoryTypes";
import { Tag } from "./tagsTypes";

export interface ProductBackendProps {
    children : React.ReactNode ;
    product?: ProductDataGlobal;
    inventoryOptions: InventoryOptions
    tagSuggestions: Tag[];
}

export interface Variant {
    id?: number;
    colors: Color[];
    sizes: Size[];
    fits: Fit[];
    materials: Material[];
    quantity: number;
    covers: string[];
}




export interface ProductBasicInfoData { 
  id?: number | null;
  name: string;
  brand: string;
  price: string;
  compareAtPrice?: string;    // optional, original price
  costPrice?: string;  
  category: string | string[];
  gender?: string | string[];
  description: string;
  rating_average?: number ,
  thumbnail: string;
  tags: Tag[];
  isFeatured?: boolean;
  niche: NicheItem;
}


export interface ParfumeVariant {
  id: string | number;        // unique variant ID
  concentration: "EDT" | "EDP" | "Parfum" | "Cologne";
  volume_ml: number;          // bottle size in ml
  quantity: number;           // stock
  fragranceFamily: "fresh" | "woody" | "oriental" | "floral" | "aromatic";
  notes: string[];            // e.g., ["Citrus","Vanilla"]
}

export interface FashionVariant {
  color: Color;
  coverImage: string;
  sizes: Size[];
  fits: Fit[];
  materials: Material[];           // e.g., ["Cotton", "Polyester"]
  fabricType?: string[];         // optional, e.g., ["Denim", "Wool"]
  quantity: Record<string, number>; // size => stock
}

export interface ElectronicsVariant {
  id: string | number;        // unique variant ID
  color: Color;          // optional if devices have color variants
  storage?: string;            // e.g., "128GB", "256GB"
  warrantyMonths?: number;
  quantity: number;            // stock
  connectivity?: string[];     // e.g., ["Bluetooth","WiFi"]
  voltage?: string;            // e.g., "220V"
  batteryLife?: string;        // "10h"
}


export interface FashionFields {
  sizes: Size[];
  materials: Material[];
  colors: Color[];
  fits: Fit[];
  fabricType?: string[];
  gender?: "men" | "women" | "unisex";
}

export interface ParfumesFields {
  concentration: "EDT" | "EDP" | "Parfum" | "Cologne";
  notes: string[];
  longevity: number;
  sillage: "soft" | "moderate" | "strong";
  volume_ml: number;
  fragranceFamily: "fresh" | "woody" | "oriental" | "floral" | "aromatic";
}

export interface ElectronicsFields {
  brandModel?: string;
  batteryLife?: string;
  voltage?: string;
  warrantyMonths?: number;
  dimensions?: string;
  weightGrams?: number;
  connectivity?: string[];
  powerConsumption?: string;
}

export interface ProductDataGlobal  extends ProductBasicInfoData{
  fashionFields?: FashionFields,
  parfumesFields?: ParfumesFields,
  electronicsFields?: ElectronicsFields,
  // niche-specific fields (optional)
  fashionVariants?: FashionVariant[];
  parfumesVariants?: ParfumeVariant[];
  electronicsVariants?: ElectronicsVariant[];
}






// create form Types
export interface ReadyToSubmit {
    bool: boolean;
    name: boolean;
    brand: boolean;
    description: boolean;
    price: boolean;
    tags: boolean;
    thumbnail: boolean;
    inventory: boolean;
}

export interface ProductFormContextType {
    data: {
        name: string;
        brand: string;
        price: string;
        thumbnail: string;
        description: string;
        isFeatured: boolean;
        free_shipping: boolean;
        inventory: InventoryItem[];
        tags: string[];
         [key: string]: unknown;
    };
    setData: (key: string, value: unknown) => void;
    post: (url: string) => void;
    errors: Record<string, string>;
    isReadyToSubmit: ReadyToSubmit;
    setIsReadyToSubmit: React.Dispatch<React.SetStateAction<ReadyToSubmit>>;
    otherStringFieldsValid: boolean;
    setOtherStringFieldsValid: React.Dispatch<React.SetStateAction<boolean>>;
}


