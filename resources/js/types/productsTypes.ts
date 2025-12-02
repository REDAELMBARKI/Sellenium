import { Color, Fit, InventoryItem, InventoryOptions, Material, Size } from "./inventoryTypes";
import { Tag } from "./tagsTypes";

export interface EditProductBackendProps {
    children : React.ReactNode ;
    product: ProductDataGlobal;
    inventoryOptions: InventoryOptions
    tagSuggestions: Tag[];
}

export interface Variant {
    id: number;
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
  gender: string | string[];
  description: string;
  rating_average : number ,
  thumbnail: string;
  tags: Tag[];
  isFeatured: boolean;
  free_shipping: boolean;
}


export interface ProductDataGlobal extends ProductBasicInfoData {

    inventories?: Variant[];
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


