import { InventoryOptions } from "@/types/inventoryTypes"
import { ProductBasicInfoData, ProductDataGlobal, Variant } from "@/types/productsTypes"
import { Tag } from "@/types/tagsTypes"
import { createContext } from "react"



interface ProductDataContextProps {
    productData?: ProductDataGlobal
    setProductData?: React.Dispatch<React.SetStateAction<ProductDataGlobal>>
    inventoryOptionsState? : InventoryOptions
    setInventoryOptionsState?: React.Dispatch<React.SetStateAction<InventoryOptions>>
    variantForm?: Variant | null 
    setVariantForm?: React.Dispatch<React.SetStateAction<Variant | null>>
    variantToDelete: number | null
    setVariantToDelete: React.Dispatch<React.SetStateAction<number | null>> 
    tagSuggestionsState: Tag[] 
    setTagSuggestionsState: React.Dispatch<React.SetStateAction<Tag[] >>
    basicInfoForm: ProductBasicInfoData
    setBasicInfoForm: React.Dispatch<React.SetStateAction<ProductBasicInfoData>>

    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)