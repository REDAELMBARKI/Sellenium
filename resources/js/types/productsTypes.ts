import { NicheItem } from "@/context/NicheContext";
import { Color, Fit, InventoryItem, InventoryOptions, Material, Size } from "./inventoryTypes";
import { Tag } from "./tagsTypes";

export interface ProductBackendProps {
    children : React.ReactNode ;
    product: ProductDataGlobal;
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
  id?: number;
  name: string;
  brand: string;
  price: string;
  category: string | string[];
  gender?: string | string[];
  description: string;
  rating_average?: number ,
  thumbnail: string;
  tags: Tag[];
  isFeatured?: boolean;
  niche: NicheItem;
}


export interface FashionFields {
  sizes: string[];           // ["S", "M", "L"]
  materials: string[];       // ["Cotton", "Leather"]
  colors: string[];          // ["Black", "White"]
  fit: "regular" | "slim" | "oversized" | "loose";
  fabricType?: string;       // Optional: Denim / Wool / Knit
  gender?: "men" | "women" | "unisex";
}
export interface ParfumesFields {
  concentration: "EDT" | "EDP" | "Parfum" | "Cologne";
  notes: string[];               // ["Citrus", "Vanilla", "Rose"]
  longevity: number;             // hours (1–12)
  sillage: "soft" | "moderate" | "strong";
  volume_ml: number;             // bottle size in ml
  fragranceFamily: "fresh" | "woody" | "oriental" | "floral" | "aromatic";
}

export interface ElectronicsFields {
  brandModel?: string;           // e.g., "iPhone 14 Pro Max"
  batteryLife?: string;          // "10h", "24h standby"
  voltage?: string;              // "220V", "110V"
  warrantyMonths?: number;       // 0–36
  dimensions?: string;           // "140 x 70 x 8 mm"
  weightGrams?: number;          // 500
  connectivity?: string[];       // ["Bluetooth", "WiFi", "5G"]
  powerConsumption?: string;     // "65W"
}

export interface ProductDataGlobal  extends ProductBasicInfoData{
  // niche-specific fields (optional)
  fashion?: FashionFields;
  parfumes?: ParfumesFields;
  electronics?: ElectronicsFields;
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


