import { Gender, Material } from "../inventoryTypes";
import { ProductBasicInfoData } from "./baseProductTypes";
import { ProductVariant } from "./productVariantType";

// 8️⃣ Jewelry
export interface JewelryProduct extends ProductBasicInfoData {
  category: "jewelry";
  material?: Material[];
  gemstone?: string[];
  gender?: Gender[];
  variants?: ProductVariant[];
}

