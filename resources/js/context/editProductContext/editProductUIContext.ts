import { InventoryOptions } from "@/types/inventoryTypes";
import { ProductBasicInfoData, ProductDataGlobal, Variant } from "@/types/productsTypes";
import { Tag } from "@/types/tagsTypes";
import { createContext } from "react";




interface EditProductUIContextProps {
  isEditingBasicInfo: boolean 
  setIsEditingBasicInfo: React.Dispatch<React.SetStateAction<boolean>>
  editingVariantId: number | null 
  setEditingVariantId: React.Dispatch<React.SetStateAction<number | null>>

  deleteModalOpen: boolean
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>

  deleteConfirmText: string
  setDeleteConfirmText: React.Dispatch<React.SetStateAction<string>>
  
  showToast: boolean
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>

  hasUnsavedChanges: boolean
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
}

export const EditProductUIContext = createContext<EditProductUIContextProps |undefined>(undefined)