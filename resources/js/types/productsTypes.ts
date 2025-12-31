import { Tag } from "./tagsTypes";
import { ProductVariant } from "./products/productVariantType";
import { CategoryCode } from "./products/categories";
import { ProductBase } from "./products/baseProductTypes";
import { FashionProduct } from "./products/fashionTypes";
import { PerfumesProduct } from "./products/perfumesTypes";
import { ElectronicsProduct } from "./products/electronicsTypes";
export interface ProductBackendProps {
    children : React.ReactNode ;
    product?: ProductDataGlobal;
    options : any
    [key: string]: any; // ✅ allows other keys
}



export type ProductDataGlobal =  
  | (ProductBase & { category: "fashion"; attributes: FashionProduct })
  | (ProductBase & { category: "perfumes"; attributes: PerfumesProduct })
  | (ProductBase & { category: "electronics"; attributes: ElectronicsProduct });



export interface VariantDisplayProps {
    variant: ProductVariant
}






