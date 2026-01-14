
import { Cover } from "@/types/inventoryTypes"
import { CategoryCode } from "@/types/products/categories"
import { ProductDataGlobal } from "@/types/productsTypes"
import { createContext, RefObject } from "react"



export type ModeForm = "edit" | "create"
interface ProductDataContextProps {
    modeForm : ModeForm
    productData?: ProductDataGlobal | undefined
    setProductData: React.Dispatch<React.SetStateAction<ProductDataGlobal | undefined>>
    options: any
    
    setThumbnailPreview: React.Dispatch<React.SetStateAction<Cover| null>>
    thumbnailPreview: Cover | null
    setCoversPreview: React.Dispatch<React.SetStateAction<Cover[]>>
    coversPreview: Cover[]

    basicInfoForm: ProductDataGlobal
    setBasicInfoForm: React.Dispatch<React.SetStateAction<ProductDataGlobal>>
    draftId: RefObject<string | null>
   
    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)