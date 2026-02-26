
import { Category } from "@/types/inventoryTypes"
import { ProductBase } from "@/types/products/baseProductTypes"
import { createContext, Dispatch, RefObject, SetStateAction } from "react"



export type ModeForm = "edit" | "create"
interface ProductDataContextProps {
    modeForm : ModeForm
    productData?: ProductBase | undefined
    setProductData:Dispatch<SetStateAction<ProductBase | undefined>>
    options: any
    category? : Category
    setCategory: Dispatch<Category>
    categoryList : Category[] ;
    setCategoryList :Dispatch<Category[]>
    basicInfoForm: ProductBase
    setBasicInfoForm: Dispatch<SetStateAction<ProductBase>>
    draftId: RefObject<string | undefined>
   
    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)