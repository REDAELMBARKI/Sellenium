
import { ProductSchemaType } from "@/shemas/productCreateform"
import { Category } from "@/types/inventoryTypes"
import { ProductBase } from "@/types/products/baseProductTypes"
import { createContext, Dispatch, RefObject, SetStateAction } from "react"
import { Control, FormState, SubmitHandler, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormWatch, WatchDefaultValue } from "react-hook-form"



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
    draftId: RefObject<string | undefined>
    register: UseFormRegister<ProductSchemaType>
    control: Control<ProductSchemaType>
    formState: FormState<ProductSchemaType>
    watch: UseFormWatch<ProductSchemaType>
    setValue : UseFormSetValue<ProductSchemaType>
    handleSubmit : SubmitHandler<ProductSchemaType>
    getValues : UseFormGetValues<ProductSchemaType>
    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)