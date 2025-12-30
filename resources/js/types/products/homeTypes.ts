import { Color, Material } from "../inventoryTypes";
import { ProductBasicInfoData } from "./baseProductTypes";
import { ProductVariant } from "./productVariantType";


export interface HomeProduct extends ProductBasicInfoData {
  category: "home";
  material?: Material[];
  dimensions?: string;
  color?: Color[];
  variants?: ProductVariant[];
}
