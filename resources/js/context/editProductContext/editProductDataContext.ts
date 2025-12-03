import { InventoryOptions } from "@/types/inventoryTypes";
import {  ProductBasicInfoData, ProductDataGlobal, Variant } from "@/types/productsTypes";
import { Tag } from "@/types/tagsTypes";
import React, { createContext } from "react";




interface EditProductDataContextProps {
   
    variantToDelete: number | null
    setVariantToDelete: React.Dispatch<React.SetStateAction<number | null>> 
    
    }

export const EditProductDataContext = createContext<EditProductDataContextProps |undefined>(undefined)