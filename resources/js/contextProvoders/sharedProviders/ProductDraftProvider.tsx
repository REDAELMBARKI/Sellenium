import { ProductDraftContext } from "@/context/ProductDraftContext";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import axios from "axios";
import { useRef } from "react";

interface ProductDraftProviderProps {
  children: React.ReactNode;
}

export const ProductDraftProvider: React.FC<ProductDraftProviderProps> = ({
  children,
}) => {
  const {basicInfoForm , setBasicInfoForm} = useProductDataCtx()
  const draftId = useRef<string | null>(basicInfoForm.id ?? null);

  const saveDraft = async () => {
        if(draftId.current) return draftId.current ;
        
        try {
          const response = await axios.post('/products', {...basicInfoForm , is_draft: true } );
          draftId.current = response.data.id 
          setBasicInfoForm({...basicInfoForm , id : draftId.current})
          return response.data.id ;
        } catch (err: any) {
          console.error('Draft save failed:', err.response?.data || err.message);
          return null
        }
  }

  const unsaveDraftCleanup = async () => {
    if(!draftId.current) return ;
    try{
        const response = await axios.delete(`/products/${draftId.current}`)
        draftId.current = null ;
        if(response.status === 200){
          // setShowToast({ show: true, message: 'Draft discarded.', type: 'info' })
        }
    } catch (err: any) {
         console.error('Draft deletion failed:', err.response?.data || err.message);
    }
  }
  
  return (
    <ProductDraftContext.Provider
      value={{
       unsaveDraftCleanup ,
       saveDraft ,
       draftId : draftId.current,
      }}
    >
      {children}
    </ProductDraftContext.Provider>
  );
};