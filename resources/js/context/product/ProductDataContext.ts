
import { ProductSchemaType } from "@/shemas/productCreateform"
import { Category } from "@/types/inventoryTypes"
import { ProductBase } from "@/types/products/baseProductTypes"
import { createContext, Dispatch, RefObject, SetStateAction } from "react"
import { Control, FormState, SubmitHandler, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormWatch, WatchDefaultValue } from "react-hook-form"



export type ModeForm = "edit" | "create"
interface ProductDataContextProps {
    modeForm : ModeForm
    options: any

    nicheCategory : Category[] ;
    setNicheCategory :Dispatch<Category[]>
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