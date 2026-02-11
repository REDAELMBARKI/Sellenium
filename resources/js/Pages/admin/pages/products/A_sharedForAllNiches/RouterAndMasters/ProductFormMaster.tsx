import React, { FormEventHandler, useEffect } from 'react';
import { useProductDataCtx } from '@/contextHooks/product/useProductDataCtx';
import FashionBasicInfoForm from './ProductCrEdForm';
import PerfumesBasicInfoForm from '../../perfumesNiche/forms/PerfumesBasicInfoForm';
import { Button } from '@/components/ui/button';
import { useProductUICtx } from '@/contextHooks/product/useProductUICtx';
import { useForm } from '@inertiajs/react' 
import { route } from 'ziggy-js';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import { ProductDataGlobal } from '@/types/productsTypes';
import { CATEGORY_CONFIG } from '@/data/categoryConfigurations';
import { forEach } from 'lodash';
import adapters from '@/functions/product/adapters';
import { Inertia } from '@inertiajs/inertia'




const ProductFormMaster: React.FC = () => {
   
  
  
  const {state :{ currentTheme}} = useStoreConfigCtx()
  
  const  { productData = {} , modeForm , basicInfoForm } = useProductDataCtx()
  const form = useForm<ProductDataGlobal>(basicInfoForm) // setData 
const {toBackendAttribute}  = adapters()

  const  {setShowToast , setHasUnsavedChanges  } = useProductUICtx()





  const handleSaveAllChanges = () => {
    alert("Changes saved successfully!");
    setHasUnsavedChanges(false);
    setShowToast(false);
  };
  
 function cleanAttributesForBackend(
  attributes: Record<string, any>
  ) {
  const cleaned: Record<string, any> = {}

  Object.entries(attributes).forEach(([key, value]) => {
    // multi-select case
    if (
      Array.isArray(value) &&
      value.length &&
      typeof value[0] === 'object' &&
      'id' in value[0]
    ) {
      cleaned[key] = value.map((v: { id: number }) => v.id)
    } else {
      cleaned[key] = value
    }
  })

  return cleaned
 }
 
 useEffect(() => {
   form.setData(basicInfoForm)
 }, [basicInfoForm]);
  
 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()


   const payload = {
    ...form.data,
    attributes: cleanAttributesForBackend(form.data.attributes),
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
