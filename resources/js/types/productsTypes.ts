import { ProductVariant } from "./products/productVariantType";
import { ProductBase } from "./products/baseProductTypes";
import { FashionAttributes } from "./products/fashionTypes";
import { PerfumesAttributes } from "./products/perfumesTypes";
import { ElectronicsAttributes } from "./products/electronicsTypes";
import { Category } from "./inventoryTypes";
export interface ProductBackendProps {
    children : React.ReactNode ;
    data : {product?: ProductDataGlobal , categoryObject? : Category  , options : any}
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






