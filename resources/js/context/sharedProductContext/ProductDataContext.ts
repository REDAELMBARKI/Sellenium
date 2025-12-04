import { InventoryOptions } from "@/types/inventoryTypes"
import { ProductBasicInfoData, ProductDataGlobal, ProductVariant } from "@/types/productsTypes"
import { Tag } from "@/types/tagsTypes"
import { createContext } from "react"



export type ModeForm = "edit" | "create"
interface ProductDataContextProps {
    modeForm : ModeForm
    productData?: ProductDataGlobal | undefined
    setProductData: React.Dispatch<React.SetStateAction<ProductDataGlobal | undefined>>
    inventoryOptionsState : InventoryOptions
    setInventoryOptionsState: React.Dispatch<React.SetStateAction<InventoryOptions>>
    variantForm?: ProductVariant | undefined | null
    setVariantForm: React.Dispatch<React.SetStateAction<ProductVariant | undefined | null>>
    variantToDelete?: number | undefined | null
    setVariantToDelete: React.Dispatch<React.SetStateAction<number | undefined | null>> 
    tagSuggestionsState: Tag[] 
    setTagSuggestionsState: React.Dispatch<React.SetStateAction<Tag[] >>
    
    basicInfoForm: ProductBasicInfoData
    setBasicInfoForm: React.Dispatch<React.SetStateAction<ProductBasicInfoData>>
    variants : ProductVariant[]
    setVariants: React.Dispatch<React.SetStateAction<ProductVariant[]>>

    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)