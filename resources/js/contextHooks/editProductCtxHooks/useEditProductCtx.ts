import { EditProductDataContext } from '@/context/editProductContext/editProductDataContext';
import { useContext } from 'react';



export const useEditProductDataCtx = () => {
    const ctx =  useContext(EditProductDataContext) ; 
    if(!ctx) throw new Error("edit product context should dbe passed in the provider")
    return ctx
}

