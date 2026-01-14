import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useEffect } from "react";




export const useDataLoadingListener  = () => {
   
     const {variantForm , setIsVariantFormLoading} =  useProductDataCtx()  
     //data loading 
        useEffect(() => {
               const isReady =
                variantForm &&
                variantForm.attributes !== undefined &&
                variantForm.quantity !== undefined;
    
        if(isReady){
            setTimeout(()=> setIsVariantFormLoading(false) , 1000)
        }
        }, [variantForm]);
}