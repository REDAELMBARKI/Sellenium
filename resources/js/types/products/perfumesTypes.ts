import { Gender } from "../inventoryTypes";
import { ProductBase } from "./baseProductTypes";
import { ProductVariant } from "./productVariantType";

export interface PerfumesAttributes  {
  category: "perfumes";
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



export interface PerfumesProduct extends ProductBase {
  category: "perfumes";
  attributes: PerfumesAttributes;
  variants: ProductVariant[];
}

