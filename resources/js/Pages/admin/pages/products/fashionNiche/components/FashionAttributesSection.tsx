import CustomSelectForObject from "@/components/ui/CustomSelectForObject";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import MultiSelectDropdownForObject, { AllowedObjectsType } from "@/components/ui/MultiSelectDropdownForObject";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

import { Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";
import { FashionAttributes } from "@/types/products/fashionTypes";
import { FashionVariant } from "@/types/products/productVariantType";
import { Select } from '@/components/ui/select';



const FashionAttributesSection = () => {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {state :{currentTheme}} = useStoreConfigCtx()


  const attributes = basicInfoForm?.attributes as FashionAttributes ; 

  return (
    <div className="space-y-4 p-4 border rounded-lg" style={{ backgroundColor: currentTheme.card }}>
      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        Choose Materials 
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}
      
      <MultiSelectDropdownForObject
        label="Materials" 
        options={[]} 
        selectedValues={attributes.materials.map(m => ({label : m.name , value : m.id})) || []}
        onChange={(selected : AllowedObjectsType[]) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               materials: selected.map(s => ({id : s.value , name : s.label}))
             }
        })}
      />



      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        choose Fits
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}

      <MultiSelectDropdownForObject
        label="Fits"
        options={[]} 
        selectedValues={attributes.fits.map(f => ({label : f.name , value : f.id})) || []}
        onChange={(selected : AllowedObjectsType[]) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               fits: selected.map(s => ({id : s.value , name : s.label}))
             }
        })}
      />


      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        choose Styles
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}


      <MultiSelectDropdown
        label="Styles"
        options={[]} 
        selectedValues={attributes.styles || []}
        onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               styles : selected  as Style[]
             }
        })}
      />


      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
       Choose Seasons
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}


      <MultiSelectDropdown
        label="Season"
        options={[]} 
        selectedValues={attributes.season || []}
        onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes ) as FashionAttributes, 
               season : selected  as Season[]
             }
        })}
      />


      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        Gender 
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}
      <MultiSelectDropdown
        label="Gender"
        options={[]} 
        selectedValues={attributes.gender || []}
        onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               gender: selected as Gender[]
             }
        })}
      />

     
    </div>
  );
};


export default FashionAttributesSection ; 