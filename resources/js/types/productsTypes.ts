import { Tag } from "./tagsTypes";
import { ProductVariant } from "./products/productVariantType";
import { CategoryCode } from "./products/categories";
import { ProductBase } from "./products/baseProductTypes";
import { FashionAttributes } from "./products/fashionTypes";
import { PerfumesAttributes } from "./products/perfumesTypes";
import { ElectronicsAttributes } from "./products/electronicsTypes";
export interface ProductBackendProps {
    children : React.ReactNode ;
    product?: ProductDataGlobal;
    options : any
    [key: string]: any; 
}



export type ProductDataGlobal =  
  | FashionProduct
  |  PerfumesProduct 
  |  ElectronicsProduct 





export type FashionProduct =
  ProductBase & {
    attributes: FashionAttributes;
    variants: ProductVariant[];
  };

export type PerfumesProduct =
  ProductBase & {
    attributes: PerfumesAttributes;
    variants: ProductVariant[];
  };

export type ElectronicsProduct =
  ProductBase & {
    attributes: ElectronicsAttributes;
    variants: ProductVariant[];
  };


export interface VariantDisplayProps {
    variant: ProductVariant
}






