import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { route } from "ziggy-js";

export const useBackendInteraction = () => {

    const {draftId , basicInfoForm} = useProductDataCtx() ; 
    const createDraft = async () => {
        if(draftId.current) return draftId.current ;
        const response = await axios.post(route("products.createDraft"), basicInfoForm );
        draftId.current = response.data.id
        return draftId.current;
    }

    const destroyDraftProduct = async (id : string) => {
        if(!id) return ;
        const response = await axios.delete(route(`products.destroy` , id))
    }

    const saveDraftProduct = (payload : any , onError : (errors : any) => void , id? : string) => {
        try{
            router.put(route('products.updateDraftOnSave'), {...payload , draft_id : id}, {      
                onError: (errors) => onError(errors),
                onSuccess: () => console.log('Success'),
            })

        }
        catch(error : any) {
            throw new Error(error)
        }
    }

    const publishDraftProduct = async (id : string , payload : any , onError : (errors : any) => void) => {
           if(!id) return ;
           try {
                router.patch(route('products.publish' , id), payload , {
                   onError : (errors) => onError(errors),
                }
            )
           }catch(err : any) {
              throw new Error(err)
           }
    }
    
    const updateDraftProduct = (payload : any , onError : (errors : any) => void , id : string) => {
          try {
            router.put(route('product.update' , id ) , payload , {
                 preserveScroll: true, 
                onError : (errors) =>  onError(errors) ,
                onSuccess: () => console.log('Success'),

            }) ;
          }catch(err : any){
             throw new Error(err)
          }
    }

    return {
    createDraft , 
    publishDraftProduct ,
    destroyDraftProduct , 
    saveDraftProduct  , 
    updateDraftProduct
    }
}