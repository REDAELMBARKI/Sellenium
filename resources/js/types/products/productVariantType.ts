import { Color, Size } from "../inventoryTypes";

export interface Variant {
  variant_id: string;
  price: number | null ;
  compare_price : number ; 
  stock: number | null;
  sku: string | null;
  image:{
      id? : number , 
      url : string
  };       // manual override per variant
  isOpen: boolean;    
  attrs: VariantAttr | null;
}


type VariantAttr = {
    color : Color , 
  } & Record<string, string >