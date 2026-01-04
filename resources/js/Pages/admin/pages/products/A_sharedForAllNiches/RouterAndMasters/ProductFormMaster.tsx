import React, { FormEventHandler } from 'react';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import FashionBasicInfoForm from './ProductCrEdForm';
import PerfumesBasicInfoForm from '../../perfumesNiche/forms/PerfumesBasicInfoForm';
import { Button } from '@/components/ui/button';
import { useProductUICtx } from '@/contextHooks/sharedhooks/useProductUICtx';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import ProductCrEdForm from './ProductCrEdForm';
import { Save } from 'lucide-react';
import { RightSectionComponent } from '../components/editAndCreate/RightSideSection/rightsectioncomponent';
import { ProductDataGlobal } from '@/types/productsTypes';





const ProductFormMaster: React.FC = () => {
   
  
  
  const {state :{currentCategory , currentTheme}} = useStoreConfigCtx()
  
  const  { productData = {} , modeForm , basicInfoForm } = useProductDataCtx()
  const form = useForm<ProductDataGlobal>(basicInfoForm) // setData 

  const  {setShowToast , setHasUnsavedChanges  } = useProductUICtx()
  const handleSaveAllChanges = () => {
    alert("Changes saved successfully!");
    setHasUnsavedChanges(false);
    setShowToast(false);
  };
  
  
  
  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault();
    form.setData(basicInfoForm)
    form.post(route('products.store'))
  }

 
 
  return ( 
  <form action={"products/create"} method='post' onSubmit={(e) => handleSubmit(e)}> 
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
