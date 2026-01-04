import { Color, Cover, Size } from "../inventoryTypes";
import { ImagePreviewItem } from "../mediaTypes";

export interface ProductVariant<C extends CategoryCode = CategoryCode> {
  category : C
  id: string;
  productId?: string;
  sku?: string;
  price?: number;
  oldPrice?: number;
  stockQuantity?: number;
  option: VariantOptionsByCategory[C]
}

type CategoryCode = keyof VariantOptionsByCategory;


type VariantOptionsByCategory = {
  fashion: FashionVariant;
  perfumes: PerfumesVariant;
  electronics: ElectronicsVariant;
};
export interface FashionVariant {
   size : Size
   color : Color
   covers : (Cover | ImagePreviewItem)[]
}


export interface PerfumesVariant {

}

export interface ElectronicsVariant {
  storage?: string;
  color?: Color;
}
