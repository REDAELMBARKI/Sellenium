import { Color } from "../inventoryTypes";
import { ProductBase } from "./baseProductTypes";
import { ProductVariant } from "./productVariantType";


export interface ElectronicsAttributes {
  category: "electronics";
  batteryLife?: string;
  connectivity?: string[];
  voltage?: string;
  storage?: string;
  colors: Color[];
  warrantyMonths?: number;
  model?: string;
  brandSeries?: string;
  techSpecs?: Record<string, string>;
}

export interface ElectronicsProduct extends ProductBase {
  category: "electronics";
  attributes: ElectronicsAttributes;
  variants: ProductVariant[];
}
