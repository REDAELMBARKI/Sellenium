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
        const response = await axios.post('/products', {...basicInfoForm , is_draft: true } );
        if(!response.data.id)  throw new Error("no draft id ")
        draftId.current = response.data.id
        return draftId.current;
  }

  const unsaveDraftCleanup = async () => {
    if(!draftId.current) return ;
    const response = await axios.delete(`/products/${draftId.current}`)
    if(!response.data.status) throw new Error('failed to delete the draft ')
    draftId.current = null ;
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