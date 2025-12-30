import { Gender } from "../inventoryTypes";
import { ProductBasicInfoData } from "./baseProductTypes";

export interface PerfumesProduct extends  ProductBasicInfoData {
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

export interface ParfumesFields {
  concentration: "EDT" | "EDP" | "Parfum" | "Cologne";
  notes: string[];
  longevity: number;
  sillage: "soft" | "moderate" | "strong";
  volume_ml: number;
  fragranceFamily: "fresh" | "woody" | "oriental" | "floral" | "aromatic";
}
