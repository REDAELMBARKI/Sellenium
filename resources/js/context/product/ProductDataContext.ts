
import { Category } from "@/types/inventoryTypes"
import { ProductDataGlobal } from "@/types/productsTypes"
import { createContext, Dispatch, RefObject, SetStateAction } from "react"



export type ModeForm = "edit" | "create"
interface ProductDataContextProps {
    modeForm : ModeForm
    productData?: ProductDataGlobal | undefined
    setProductData:Dispatch<SetStateAction<ProductDataGlobal | undefined>>
    options: any
    category? : Category
    setCategory: Dispatch<Category>
    categoryList : Category[] ;
    setCategoryList :Dispatch<Category[]>
    basicInfoForm: ProductDataGlobal
    setBasicInfoForm: Dispatch<SetStateAction<ProductDataGlobal>>
    draftId: RefObject<string | undefined>
   
    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)