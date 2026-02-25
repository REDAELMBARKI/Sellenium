import { Color, Size } from "../inventoryTypes";

export interface Variant {
  id: string;
  price: number | string;
  stock: string;
  sku: string;
  imageUrl: string | null;       // manual override per variant
  isOpen: boolean;               // tracks if card is expanded/unsaved
  attrs: VariantAttr | null;
}


type VariantAttr = {
    color : Color , 
  } & Record<string, string >