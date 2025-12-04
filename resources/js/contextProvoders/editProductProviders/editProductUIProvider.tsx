
import { EditProductUIContext } from '@/context/editProductContext/editProductUIContext';
import { useState } from 'react';










const EditProductUIProvider = ({children}:{children:React.ReactNode}) => {
        
            const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
            const [editingVariantId, setEditingVariantId] = useState<number | null>(
                null
            );
           
            const [deleteModalOpen, setDeleteModalOpen] = useState(false);
            const [showToast, setShowToast] = useState(false);
            const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
            
            const [deleteConfirmText , setDeleteConfirmText] =  useState<string>("")
            return (
        <EditProductUIContext.Provider value={{deleteConfirmText , setDeleteConfirmText , isEditingBasicInfo, setIsEditingBasicInfo , editingVariantId, setEditingVariantId , 
            deleteModalOpen, setDeleteModalOpen  , showToast, setShowToast , 
            hasUnsavedChanges, setHasUnsavedChanges
        }}>
         {children}
        </EditProductUIContext.Provider>
    )
}

export default EditProductUIProvider ; 