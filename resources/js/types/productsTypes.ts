import { Color, Country, Cover, Fit , Material, NicheOptions, Season, Size, Style } from "./inventoryTypes";
import { Tag } from "./tagsTypes";
import { ImagePreviewItem } from "./mediaTypes";
import { NicheItem } from "./StoreConfigTypes";
import { ProductVariant } from "./products/productVariantType";
import { FashionProduct } from "./products/fashionTypes";
import { PerfumesProduct } from "./products/perfumesTypes";
import { ElectronicsProduct } from "./products/electronicsTypes";
import { CategoryCode } from "./products/categories";
export interface ProductBackendProps {
    children : React.ReactNode ;
    product?: ProductDataGlobal;
    categories: CategoryCode
    tagSuggestions: Tag[];
      [key: string]: any; // ✅ allows other keys
}



export type ProductDataGlobal =  FashionProduct | PerfumesProduct | ElectronicsProduct ;


export interface VariantDisplayProps {
    variant: ProductVariant
}






