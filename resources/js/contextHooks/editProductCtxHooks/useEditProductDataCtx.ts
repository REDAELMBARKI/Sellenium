
import { useContext } from 'react';
import { EditProductDataContext } from '@/context/editProductContext/editProductDataContext';




export const useEditProductDataCtx = () => {
    const ctx =  useContext(EditProductDataContext) ; 
    if(!ctx) throw new Error("product data context should dbe passed in the provider")
    return ctx
}

