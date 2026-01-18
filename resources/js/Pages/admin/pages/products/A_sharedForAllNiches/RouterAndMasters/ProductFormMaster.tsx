import React, {  useEffect, useRef, useState } from 'react';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import { Button } from '@/components/ui/button';
import { useForm , router } from '@inertiajs/react' 
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import { ProductDataGlobal } from '@/types/productsTypes';
import { toBackendDataCleaners } from '@/functions/product/toBackendDataCleaners';
import { isFormWorthSavingAsDraft } from '@/functions/product/souldSaveDraft';

import WarningModal from '@/components/ui/WarningModal';
import { productFilesUploaderCleaner } from '@/functions/product/productFilesUploaderCleaner';
import { useBackendInteraction } from '@/functions/product/useBackendInteractions';

const ProductFormMaster: React.FC = () => {
   
  
  
  const {state :{currentCategory , currentTheme}} = useStoreConfigCtx()
  const  {draftId , modeForm , basicInfoForm  } = useProductDataCtx()
  const form = useForm<ProductDataGlobal>(basicInfoForm) // setData 
  const [isDirty , setIsDirty] = useState<boolean>(isFormWorthSavingAsDraft(basicInfoForm)) ; 
  const [showLeaveDraftModal , setShowLeaveDraftModal] = useState(false) ; 
  const [pendingDestination , setPendingDestination] = useState<any | null>(null) ; 


  console.log(basicInfoForm)
  const hasEverBeenDirty = useRef<boolean>(false) ;
  const allowNextVisit = useRef(false)
  const {cleanProductTempMediaOnDistroy} = productFilesUploaderCleaner() ;
  const {
    cleanAttributesForBackend , 
    cleanObjectToIids
  } = toBackendDataCleaners()
  const {createDraft , destroyDraftProduct , saveDraftProduct } = useBackendInteraction()


  //form is dirty checkers
  useEffect(() => {
    const remove =  router.on('before' , (event)=> { 
      //  Ignore form submits
        if (event.detail.visit.method !== 'get') {
          return;
        }


        if(allowNextVisit.current) {
          allowNextVisit.current = false ;
          return ;
        };

        
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
   if(draftId.current) return ;
   if(hasEverBeenDirty.current) return;
   if(!isDirty) return ;

  const create = async () => {
    try {
      await createDraft();
      hasEverBeenDirty.current = true;
    } catch (err) {
      console.error('Draft save failed in effect:', err);
    }
  };

  create();
 }, [isDirty]);
 // end is dirty form checkers 


 useEffect(() => {
   form.setData(basicInfoForm)
 }, [basicInfoForm]);


  const prepareProductSubmitPayload = () => {
     const {thumbnail , covers , video , ...data} = form.data 
      return {
      ...data,
      category : cleanObjectToIids(form.data.category) , 
      attributes: cleanAttributesForBackend(form.data.attributes),
      subCategory : cleanObjectToIids(form.data.subCategory)
    }
  }
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const payload = prepareProductSubmitPayload()
    console.log(payload)

    try{
        // here draft id might be null if i click save if no draft created yet here i know i should make the button disabled but who can i even make this safer so if not exist should i create a draft fist then save the id or i make the id optional so if not draft id create a draft 
        await saveDraftProduct(payload , (errors) => form.setError(errors) , draftId.current ); 
        // show success taost 
    }catch(err : any){
       throw err ; // show taost 
    }
  }
  
  const proceedToPendingDestination = () => {
    if (!pendingDestination) return
    allowNextVisit.current = true
    router.visit(pendingDestination)
  }
  
  const handleConfirmLeaveWithDraft =  async () => {
    const payload =  prepareProductSubmitPayload();
    try{
       await saveDraftProduct(payload , (errors) => form.setError(errors) , draftId.current );
    }catch(err : any){
        throw err.message
    }
    proceedToPendingDestination()
  }

  const handleDenyLeaveWithDraft =  async (draftId : string) => {
    if(!draftId) return ;
    try{
      await destroyDraftProduct(draftId) ;
      await cleanProductTempMediaOnDistroy(draftId)
    }catch(err : any){
       throw err.message
    }
    finally{
      setShowLeaveDraftModal(false)
      proceedToPendingDestination()
    }

  }

  return ( 
  <> 
   
   {/* edit and create form  */}
   <div className='flex'>
      <WarningModal
      title='Unsaved changes' 
      description='You have unsaved changes. If you leave this page, your draft will be lost.' 
      confirmText='Save draft & leave'
       denyText='Discard Changes'

        isOpen={showLeaveDraftModal} 
       onDeny={() => handleDenyLeaveWithDraft(draftId.current!)} 
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
    type="button"
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
    onClick={handleSubmit}
  >
    <Save />
    {modeForm === "create" ? "Create Product" : "Update Product"}
  </Button>
   </div>


  </>
  
 );  
};

export default ProductFormMaster;
