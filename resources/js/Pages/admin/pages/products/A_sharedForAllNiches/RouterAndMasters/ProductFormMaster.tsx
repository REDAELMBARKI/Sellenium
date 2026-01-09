import React, { FormEventHandler, useEffect, useRef, useState } from 'react';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import FashionBasicInfoForm from './ProductCrEdForm';
import PerfumesBasicInfoForm from '../../perfumesNiche/forms/PerfumesBasicInfoForm';
import { Button } from '@/components/ui/button';
import { useProductUICtx } from '@/contextHooks/sharedhooks/useProductUICtx';
import { useForm } from '@inertiajs/react' 
import { route } from 'ziggy-js';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import { ProductDataGlobal } from '@/types/productsTypes';
import adapters from '@/functions/adapters';
import { Inertia } from '@inertiajs/inertia'
import { toBackendDataCleaners } from '@/functions/toBackendDataCleaners';
import { isFormWorthSavingAsDraft } from '@/functions/souldSaveDraft';
import { DeleteConfirmationModal } from '@/components/ui/DeleteConfirmationModal';

import { router } from '@inertiajs/react';
import WarningModal from '@/components/ui/WarningModal';

const ProductFormMaster: React.FC = () => {
   
  
  
  const {state :{currentCategory , currentTheme}} = useStoreConfigCtx()
  const  { productData = {} , modeForm , basicInfoForm } = useProductDataCtx()
  const form = useForm<ProductDataGlobal>(basicInfoForm) // setData 
  const [isDirty , setIsDirty] = useState<boolean>(isFormWorthSavingAsDraft(basicInfoForm)) ; 
  const [showLeaveDraftModal , setShowLeaveDraftModal] = useState(false) ; 
  const [pendingDestination , setPendingDestination] = useState<any | null>(null) ; 
  const hasEverBeenDirty = useRef<boolean>(true) ;
  const  {setShowToast , setHasUnsavedChanges  } = useProductUICtx()

  const {
    cleanAttributesForBackend , 
    cleanObjectToIids
  } = toBackendDataCleaners()


  const handleSaveAllChanges = () => {
    alert("Changes saved successfully!");
    setHasUnsavedChanges(false);
    setShowToast(false);
  };
  

  //form is dirty checkers
 
  useEffect(() => {
     const remove =  router.on('before' , (event)=> {
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
   if(isDirty) hasEverBeenDirty.current = true ;
 }, [isDirty]);
 // end is dirty form checkers 

 useEffect(() => {
   form.setData(basicInfoForm)
 }, [basicInfoForm]);


 
 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()


   const payload = {
    ...form.data,
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

 
  
  return ( 
  <form  onSubmit={handleSubmit}> 
   
   {/* edit and create form  */}
   <div className='flex'>
    <WarningModal title='save as draft ' isOpen={showLeaveDraftModal} onDeny={() => setShowLeaveDraftModal(false)} onConfirm={() => {
      if(pendingDestination) Inertia.visit(pendingDestination)
        
    }} />
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
