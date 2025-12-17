import React from 'react';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import FashionBasicInfoForm from '../../fashionNiche/forms/FashionBasicInfoForm';
import PerfumesBasicInfoForm from '../../perfumesNiche/forms/PerfumesBasicInfoForm';
import { Button } from '@/components/ui/button';
import { useProductUICtx } from '@/contextHooks/sharedhooks/useProductUICtx';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { NicheItem } from '@/types/StoreConfigTypes';





const BasicInfoFormMaster: React.FC = () => {
   
   const {post} = useForm()

  const {state :{currentNiche}} = useStoreConfigCtx()

  const  { productData = {} , modeForm , basicInfoForm } = useProductDataCtx()
  const  {setShowToast , setHasUnsavedChanges  } = useProductUICtx()
  const handleSaveAllChanges = () => {
      console.log("Saving all changes:", productData);
      alert("Changes saved successfully!");
      setHasUnsavedChanges(false);
      setShowToast(false);
  };



  const handleSubmit = (e : Event) => {
      e.preventDefault();
      console.log('clicked submit basic info form master');
    //   post(route('/products'),basicInfoForm);
  }

 
 
  const formsMap : Record<NicheItem  , React.FC<any>> =  {
          "fashion" : FashionBasicInfoForm,
          "perfumes" : PerfumesBasicInfoForm ,
          "electronics" : FashionBasicInfoForm ,
  }
  // const PropsMap : Record<NicheItem , any> = {
  //      "fashion" : {} 
  //       "perfumes" : {}
  //       "electronics" : {}
  // }

  const Form = formsMap[currentNiche]
  // const props = PropsMap[currentNiche]


  return ( <form action={"products/create"} method='post' onSubmit={handleSubmit}> 
   
   <Form />
   {/* save product */}
   <div className="flex justify-center">
      <Button 
          type="submit"
          variant="outline"
      >
          {modeForm === "create" ? "create  Product" : "Save Product Changes"}
      </Button>
    </div>

  </form>
  
 );  
};

export default BasicInfoFormMaster;
