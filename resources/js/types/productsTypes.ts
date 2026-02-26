import { ProductBase } from "./products/baseProductTypes";
import { FashionAttributes } from "./products/fashionTypes";
import { PerfumesAttributes } from "./products/perfumesTypes";
import { ElectronicsAttributes } from "./products/electronicsTypes";
import { Category } from "./inventoryTypes";
import { Variant } from "./products/productVariantType";
export interface ProductBackendProps {
    children : React.ReactNode ;
    data : {product?: ProductBase , categoryObject? : Category  , options : any}
    options : any
    [key: string]: any; 
}





