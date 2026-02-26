
import { ProductSchemaType } from "@/shemas/productCreateform"
import { Category } from "@/types/inventoryTypes"
import { ProductBase } from "@/types/products/baseProductTypes"
import { createContext, Dispatch, RefObject, SetStateAction } from "react"
import { UseFormGetValues, UseFormHandleSubmit, UseFormRegister, UseFormSetValue } from "react-hook-form"



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
    register: UseFormRegister<ProductSchemaType>;
    handleSubmit: UseFormHandleSubmit<ProductSchemaType>;
    setValue: UseFormSetValue<ProductSchemaType>;
    getValues: UseFormGetValues<ProductSchemaType>;
    isDirty: boolean;
    isValid: boolean;
    draftId: RefObject<string | undefined>
   
    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)