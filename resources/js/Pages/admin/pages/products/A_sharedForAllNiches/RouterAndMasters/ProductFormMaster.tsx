
import React, { useEffect, useRef, useState } from 'react';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import { Button } from '@/components/ui/button';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { CloudLightning, Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import adapters from '@/functions/product/adapters';
import { Inertia } from '@inertiajs/inertia'
import { route } from 'ziggy-js';
import axios from 'axios';
import { ProductSchemaType } from '@/shemas/productSchema';
import { router } from '@inertiajs/react';
import LeaveModal from '@/components/ui/LeaveModel';
import { useBackendInteraction } from '@/functions/product/useBackendInteractions';
import { toBackendDataCleaners } from '@/functions/product/toBackendDataCleaners';
import { json } from 'zod';

const ProductFormMaster: React.FC = () => {
  const { state: { currentTheme } } = useStoreConfigCtx()
  const { modeForm, draftId, handleSubmit: formHandleSubmit , watch  ,getValues , formState : {isSubmitting ,isDirty  ,errors} } = useProductDataCtx()
  const [showLeaveModal  ,setShowLeaveModal] = useState(false)
  const [pendingVisit , setPendingVisit] = useState<string>('')

  const { cleanAttributesForBackend} = toBackendDataCleaners()
  const {save , destroyDraftProduct} =useBackendInteraction();
  const isLeavingRef = useRef(false);
  useEffect(() => {
    if (draftId.current) return;
    const draftInit = async () => {
      try {
        const res = await axios.post(route('products.storeDraft'));
        draftId.current = res.data.id;
      } catch (error) {
        console.error("Failed to create draft:", error);
      }
    };
   
    draftInit();
  }, []);


  // errors 
  useEffect(() => {
    console.log(errors)
  }, [errors]);

  const onSubmit = (data: ProductSchemaType) => {
    const payload = {
      ...data,
      product_attributes: cleanAttributesForBackend(data.product_attributes),
    }

    Inertia.put(route('product.update', { product: draftId.current }), payload as any, {
      onSuccess: () => console.log('Success'),
      onError: (errors) => console.error(errors),
    })
  }


  useEffect(() => {
  // if(isLeavingRef.current) return ;
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // required for Chrome
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);


  useEffect(() => {
    const unsubscribe = router.on('before', (event) => {
        if(!isLeavingRef.current){
          setShowLeaveModal(true);
          setPendingVisit(event.detail.visit.url.toString()); // save where they were going
          event.preventDefault(); // block navigation
        }
  });

    return () => unsubscribe();
  }, [isDirty]);


  const handleConfirmLeave = () => {
    // delete the draft
    const data = getValues()
    const payload = {
      ...data,
      product_attributes: cleanAttributesForBackend(data.product_attributes),
    }
    // save the proudct 
    save("draft.save.leave" , payload , 
       (errors) => console.log(errors)
      ,
      draftId.current) ; 
    isLeavingRef.current = true ;
    setShowLeaveModal(false);
    router.visit(pendingVisit); 
  };

  const handleCancelLeave = () => {
    // remove the darft
    destroyDraftProduct(draftId.current!)
    isLeavingRef.current = true ;
    setShowLeaveModal(false);
    router.visit(pendingVisit); 
    setPendingVisit(null);
  };


  const handleCancel  = () => {
    setShowLeaveModal(false);
    setPendingVisit(null);
  };


  return (
    <form onSubmit={(e) => {
        e.preventDefault()
        formHandleSubmit(onSubmit)()
    }}>
      {showLeaveModal && 
      <LeaveModal
          theme={currentTheme} 
          onClose={handleCancel} 
          onLeave={handleCancelLeave} 
          onSaveDraft={handleConfirmLeave}
      /> }
      {/* edit and create form */}
      <div className='flex'>
       
        <ProductCrEdForm />
        <RightSectionComponent />
      </div>

      {/* save product */}
      <div
        className="sticky bottom-0 z-30 flex justify-end px-6 py-4 border-t backdrop-blur"
        style={{
          background: currentTheme.bgSecondary,
          borderColor: currentTheme.border,
        }}
      >
        <Button
          type="submit"
          className="min-w-[220px] text-sm font-semibold rounded-lg shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          style={{
            background: currentTheme.primary,
            color: currentTheme.textInverse,
          }}

          disabled={isSubmitting}
        >
          <Save />
            {
                isSubmitting ? "Submitting..." : (modeForm === "create" ? "Create Product" : "Update Product")
            }
        </Button>
      </div>
    </form>
  );
};

export default ProductFormMaster;