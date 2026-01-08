
import { CategoryCode } from "@/types/products/categories"
import { ProductDataGlobal } from "@/types/productsTypes"
import { createContext } from "react"



export type ModeForm = "edit" | "create"
interface ProductDataContextProps {
    modeForm : ModeForm
    productData?: ProductDataGlobal | undefined
    setProductData: React.Dispatch<React.SetStateAction<ProductDataGlobal | undefined>>
    variantToDelete?: number | undefined | null
    setVariantToDelete: React.Dispatch<React.SetStateAction<number | undefined | null>> 
    options: any
    
    basicInfoForm: ProductDataGlobal
    setBasicInfoForm: React.Dispatch<React.SetStateAction<ProductDataGlobal>>
     
   
    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)