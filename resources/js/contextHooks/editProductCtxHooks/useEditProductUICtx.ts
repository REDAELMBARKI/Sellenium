

import { EditProductUIContext } from '@/context/editProductContext/editProductUiContext';
import { useContext } from 'react';




export const useEditProductUICtx = () => {
    const ctx =  useContext(EditProductUIContext) ; 
    if(!ctx) throw new Error("product data context should dbe passed in the provider")
    return ctx
}

