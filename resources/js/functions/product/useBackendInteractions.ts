import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { route } from "ziggy-js";

export const useBackendInteraction = () => {

    const destroyDraftProduct = async (id : string) => {
        if(!id) return ;
        try{
            const response = await axios.delete(route(`product.destroy` , {product : id}))

        }catch(err)
        {
            throw err ; 
        }
    }

    const save = async (url : "draft.save.leave"|"draft.save.submit" , payload : any  , onError : (errors : any) => void , id? : string) => {
        try{

            const res = await axios.put(route(url , {product : id }), {...payload}) ;
            if(res.status == 200) {
            }
        }
        catch(error : any) {
            onError(error);
            throw new Error(error)
        }
    }

    const publishDraftProduct = async (id : string , payload : any , onError : (errors : any) => void) => {
           if(!id) return ;
           try {
                router.patch(route('product.publish' , {product : id}), payload , {
                   onError : (errors) => onError(errors),
                }
            )
           }catch(err : any) {
              throw new Error(err)
           }
    }
    


    return {
    publishDraftProduct ,
    destroyDraftProduct , 
    save , 
    }
}