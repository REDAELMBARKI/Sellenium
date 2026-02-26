import { Color, Size } from "../inventoryTypes";

export interface Variant {
  id: string;
  price: number;
  compare_price : number ; 
  stock: string;
  sku: string | null;
  imageUrl: string | null;       // manual override per variant
  isOpen: boolean;    
  attrs: VariantAttr | null;
}


type VariantAttr = {
    color : Color , 
  } & Record<string, string >