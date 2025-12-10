import { NicheItem } from "@/context/NicheContext";
import { Color, Cover, Fit , InventoryOptions, Material, Season, Size, Style } from "./inventoryTypes";
import { Tag } from "./tagsTypes";
import { nichesOptions } from '../data/nichesOptions';
export interface ProductBackendProps {
    children : React.ReactNode ;
    product?: ProductDataGlobal;
    inventoryOptions: InventoryOptions
    tagSuggestions: Tag[];
}

export type Gender ="male" | "female" | "kids" | "all genders"

export type ProductDataGlobal =  FashionProduct | PerfumesProduct | ElectronicsProduct ;

export interface ProductBasicInfoData { 
  niche: NicheItem;
  id?: string | null;
  name: string;
  brand: string;
  price: string;
  compareAtPrice?: string;
  costPrice?: string;  
  category: string[];
  description: string;
  rating_average?: number;
  thumbnail: string;
  video : string ;
  covers : Cover[] , 
  tags: Tag[];
  isFeatured?: boolean;
  sku?: string;
  stockQuantity?: number | string;
  releaseDate?: string;
  visible?: boolean; // true = product is publicly visible
}




export interface PerfumesProduct extends  ProductBasicInfoData {
  niche: "perfumes";
  concentration: "EDT" | "EDP" | "Parfum" | "Cologne" | undefined;
  quantity: number;
  fragranceFamily: "fresh" | "woody" | "oriental" | "floral" | "aromatic" | undefined;
  gender : Gender[]

  topNotes: string[];      // NEW: Most perfumes have top/middle/base
  middleNotes: string[];   // NEW
  baseNotes: string[];     // NEW

  longevity?: string;
  sillage?: string;
  volumes: {volume : number  , price : number}[];
  
}


 


export interface FashionProduct extends  ProductBasicInfoData {
  niche: "fashion";
  materials : Material[]
  fits: Fit[]
  gender : Gender[]
  styles: Style[],
  season: Season[],
  country : string
  variants : FashionVariant[]
}

export interface FashionAttributes {
  color: Color;
  covers: Cover[];
  sizes: Size[];
}
export interface FashionVariant {
  niche : "fashion",
  id :string 
  attributes : FashionAttributes
  quantity : number
}




export interface ElectronicsProduct extends ProductBasicInfoData {
  niche: "electronics";
  batteryLife?: string;        // "10h"
  connectivity?: string[];     // e.g., ["Bluetooth","WiFi"]
  voltage?: string;            // e.g., "220V"
  storage?: string;            // e.g., "128GB", "256GB"
  colors: Color[];          // optional if devices have color variants
  quantity: number;            // stock
  warrantyMonths?: number;
  model?: string;
  brandSeries?: string;
  techSpecs?: Record<string, string>;
}




export interface FashionFields {
  sizes: Size[];
  materials: Material[];
  colors: Color[];
  covers: Cover[] , 
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


// Product variant
export type ProductVariant = FashionVariant



export interface VariantDisplayProps {
    variant: ProductVariant
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

// export interface ProductFormContextType {
//     data: {
//         name: string;
//         brand: string;
//         price: string;
//         thumbnail: string;
//         description: string;
//         isFeatured: boolean;
//         free_shipping: boolean;
//         inventory: InventoryItem[];
//         tags: string[];
//          [key: string]: unknown;
//     };
//     setData: (key: string, value: unknown) => void;
//     post: (url: string) => void;
//     errors: Record<string, string>;
//     isReadyToSubmit: ReadyToSubmit;
//     setIsReadyToSubmit: React.Dispatch<React.SetStateAction<ReadyToSubmit>>;
//     otherStringFieldsValid: boolean;
//     setOtherStringFieldsValid: React.Dispatch<React.SetStateAction<boolean>>;
// }


