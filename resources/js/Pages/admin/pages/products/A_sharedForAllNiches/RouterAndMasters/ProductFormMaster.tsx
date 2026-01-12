import React, {  useEffect, useRef, useState } from 'react';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import { Button } from '@/components/ui/button';
import { useProductUICtx } from '@/contextHooks/sharedhooks/useProductUICtx';
import { useForm , router } from '@inertiajs/react' 
import { route } from 'ziggy-js';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import { ProductDataGlobal } from '@/types/productsTypes';
import { Inertia } from '@inertiajs/inertia'
import { toBackendDataCleaners } from '@/functions/toBackendDataCleaners';
import { isFormWorthSavingAsDraft } from '@/functions/souldSaveDraft';

import WarningModal from '@/components/ui/WarningModal';
import axios from 'axios';
import { useProductDraft } from '@/contextHooks/sharedhooks/useProductDraft';
import { productFilesUploaderCleaner } from '@/functions/productFilesUploaderCleaner';

const ProductFormMaster: React.FC = () => {
   
  
  
  const {state :{currentCategory , currentTheme}} = useStoreConfigCtx()
  const  { productData = {} , modeForm , basicInfoForm , setBasicInfoForm } = useProductDataCtx()
  const form = useForm<ProductDataGlobal>(basicInfoForm) // setData 
  const [isDirty , setIsDirty] = useState<boolean>(isFormWorthSavingAsDraft(basicInfoForm)) ; 
  const [showLeaveDraftModal , setShowLeaveDraftModal] = useState(false) ; 
  const [pendingDestination , setPendingDestination] = useState<any | null>(null) ; 
  const hasEverBeenDirty = useRef<boolean>(true) ;
  const allowNextVisit = useRef(false)
  const  {setShowToast , setHasUnsavedChanges  } = useProductUICtx()
  const { saveDraft , unsaveDraftCleanup , draftId } = useProductDraft() ;
  const  {coversPreview , thumbnailPreview} = useProductDataCtx() ; 
  const {cleanProductTempMedia} = productFilesUploaderCleaner() ;
  const {
    cleanAttributesForBackend , 
    cleanObjectToIids
  } = toBackendDataCleaners()



  //form is dirty checkers
  useEffect(() => {
     const remove =  router.on('before' , (event)=> { 
        if(allowNextVisit.current) {
          allowNextVisit.current = false ;
          return ;
        } ;

        if(!hasEverBeenDirty.current) return ;
        event.preventDefault()

        setPendingDestination(event.detail.visit.url)
        setShowLeaveDraftModal(true)
     })


     return () => remove()
  }, []);

 useEffect(() => { 
    if(hasEverBeenDirty.current) return;
    setIsDirty(isFormWorthSavingAsDraft(basicInfoForm))
 }, [basicInfoForm]);

 useEffect(() => {
   if(hasEverBeenDirty.current) return;
   if(!isDirty) return ;

  const save = async () => {
    try {
      await saveDraft();
      hasEverBeenDirty.current = true;
    } catch (err) {
      console.error('Draft save failed in effect:', err);
    }
  };

  save();
 }, [isDirty]);
 // end is dirty form checkers 


 useEffect(() => {
   form.setData(basicInfoForm)
 }, [basicInfoForm]);

 


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      ...form.data,
      covers : cleanObjectToIids(coversPreview) ,
      thumbnail : cleanObjectToIids(thumbnailPreview || {}),
      category : cleanObjectToIids(form.data.category) , 
      attributes: cleanAttributesForBackend(form.data.attributes),
      subCategory : cleanObjectToIids(form.data.subCategory)
    }

    // 2️⃣ Send payload directly
    Inertia.post(route('products.store'), payload as any, {
      onError: (errors) => form.setError(errors),
      onSuccess: () => console.log('Success'),
    })

  }
  
  const proceedToPendingDestination = () => {
    if (!pendingDestination) return
    allowNextVisit.current = true
    router.visit(pendingDestination)
  }
  
  const handleConfirmLeaveWithDraft = () => {
    saveDraft()
    proceedToPendingDestination()
  }

  const handleDenyLeaveWithDraft =  async (draftId : string) => {
    if(!draftId) return ;
    try{
      await unsaveDraftCleanup() ;
      await cleanProductTempMedia(draftId)
    }catch(err : any){
       throw err 
    }
    finally{
      setShowLeaveDraftModal(false)
      proceedToPendingDestination()
    }

  }

  return ( 
  <form  onSubmit={handleSubmit}> 
   
   {/* edit and create form  */}
   <div className='flex'>
     <WarningModal
      title='Unsaved changes' 
      description='You have unsaved changes. If you leave this page, your draft will be lost.' 
      confirmText='Save draft & leave'
       denyText='Discard Changes'

        isOpen={showLeaveDraftModal} 
       onDeny={() => handleDenyLeaveWithDraft(draftId!)} 
       onClose={() => setShowLeaveDraftModal(false)}
       onConfirm={() => handleConfirmLeaveWithDraft()} />
    <ProductCrEdForm />
    <RightSectionComponent />

   </div>
   {/* save product */}
   <div
      className="
        sticky bottom-0 z-30
        flex justify-center
        px-6 py-4
        border-t
        backdrop-blur
      "
      style={{
        background: currentTheme.bgSecondary,
        borderColor: currentTheme.border,
      }}
    >
  <Button
    type="submit"
    className="
      min-w-[220px]
      text-sm font-semibold
      rounded-lg
      shadow-lg
      transition
      hover:opacity-90
      active:scale-[0.98]
    "
    style={{
      background: currentTheme.primary,
      color: currentTheme.textInverse,
    }}
  >
    <Save />
    {modeForm === "create" ? "Create Product" : "Update Product"}
  </Button>
   </div>


  </form>
  
 );  
};

export default ProductFormMaster;
