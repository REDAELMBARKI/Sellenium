import { InventoryOptions } from "@/types/inventoryTypes"
import { ProductBasicInfoData, ProductDataGlobal, Variant } from "@/types/productsTypes"
import { Tag } from "@/types/tagsTypes"
import { createContext } from "react"



interface ProductDataContextProps {
    productData?: ProductDataGlobal
    setProductData?: React.Dispatch<React.SetStateAction<ProductDataGlobal>>
    inventoryOptionsState? : InventoryOptions
    setInventoryOptionsState?: React.Dispatch<React.SetStateAction<InventoryOptions>>

    tagSuggestionsState: Tag[] 
    setTagSuggestionsState: React.Dispatch<React.SetStateAction<Tag[] >>
   

    }

export const ProductDataContext = createContext<ProductDataContextProps |undefined>(undefined)