import { Gender, Material, Size } from "../inventoryTypes";
import { ProductBasicInfoData } from "./baseProductTypes";
import { ProductVariant } from "./productVariantType";


// 6️⃣ Sports
export interface SportsProduct extends ProductBasicInfoData{
  category: "sports";
  sportType?: string; // e.g., "fitness", "outdoor"
  sizes?: Size[];
  materials?: Material[];
  gender?: Gender[];
  variants?: ProductVariant[];
}
