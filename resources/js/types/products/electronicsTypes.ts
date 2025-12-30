import { Color } from "../inventoryTypes";
import { ProductBasicInfoData } from "./baseProductTypes";

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

export interface ElectronicsProduct extends ProductBasicInfoData {
  category: "electronics";
  batteryLife?: string;        // "10h"
  connectivity?: string[];     // e.g., ["Bluetooth","WiFi"]
  voltage?: string;            // e.g., "220V"
  storage?: string;            // e.g., "128GB", "256GB"
  colors: Color[];          // optional if devices have color variants
  warrantyMonths?: number;
  model?: string;
  brandSeries?: string;
  techSpecs?: Record<string, string>;
}



