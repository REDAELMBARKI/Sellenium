import { ProductBase } from "./products/baseProductTypes";
import { FashionAttributes } from "./products/fashionTypes";
import { PerfumesAttributes } from "./products/perfumesTypes";
import { ElectronicsAttributes } from "./products/electronicsTypes";
import { Category } from "./inventoryTypes";
import { Variant } from "./products/productVariantType";
export interface ProductBackendProps {
    children : React.ReactNode ;
    data : {product?: ProductDataGlobal , categoryObject? : Category  , options : any}
    options : any
    [key: string]: any; 
}



export type ProductDataGlobal =  
  |  FashionProduct
  |  PerfumesProduct 
  |  ElectronicsProduct 





export type FashionProduct =
  ProductBase & {
    attributes: FashionAttributes;
    variants: Variant[];
  };

export type PerfumesProduct =
  ProductBase & {
    attributes: PerfumesAttributes;
    variants: Variant[];
  };

export type ElectronicsProduct =
  ProductBase & {
    attributes: ElectronicsAttributes;
    variants: Variant[];
  };


export interface VariantDisplayProps {
    variant: Variant
}






