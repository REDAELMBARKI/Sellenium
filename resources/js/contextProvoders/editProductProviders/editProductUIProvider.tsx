
import { useState } from 'react';

import { EditProductUIContext } from '@/context/editProductContext/editProductUiContext';









const EditProductUIProvider = ({children}:{children:React.ReactNode}) => {
        
            const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
            const [editingVariantId, setEditingVariantId] = useState<number | null>(
                null
            );
           
            const [deleteModalOpen, setDeleteModalOpen] = useState(false);
            const [deleteConfirmText, setDeleteConfirmText] = useState("");
            const [showToast, setShowToast] = useState(false);
            const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
   
            return (
        <EditProductUIContext.Provider value={{isEditingBasicInfo, setIsEditingBasicInfo , editingVariantId, setEditingVariantId , 
            deleteModalOpen, setDeleteModalOpen , deleteConfirmText, setDeleteConfirmText , showToast, setShowToast , 
            hasUnsavedChanges, setHasUnsavedChanges
        }}>
         {children}
        </EditProductUIContext.Provider>
    )
}

export default EditProductUIProvider ; 