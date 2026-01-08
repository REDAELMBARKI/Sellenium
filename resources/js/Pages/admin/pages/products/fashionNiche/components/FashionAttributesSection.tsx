import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import MultiSelectDropdownForObject, { AllowedObjectsType } from "@/components/ui/MultiSelectDropdownForObject";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import adapters from "@/functions/adapters";
import selectAdapters from "@/functions/adapters";

import {  Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";
import { FashionAttributes } from "@/types/products/fashionTypes";
import { label } from "framer-motion/client";



const FashionAttributesSection = () => {
  const { basicInfoForm, setBasicInfoForm , options } = useProductDataCtx();
  const {state :{currentTheme}} = useStoreConfigCtx()

  const attributes = basicInfoForm?.attributes as FashionAttributes ; 
  const {toSelectOptionAdapter  , toSetterAdapter} = adapters()

  
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
        options={options.materials.map(toSelectOptionAdapter) ?? []} 
        selectedValues={attributes.materials.map(m => ({label : m.name , value : m.id})) || []}
        onChange={(selected : AllowedObjectsType[]) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               materials: selected.map(toSetterAdapter) as Material[]
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
        options={options.fits.map(toSelectOptionAdapter)?? []} 
        selectedValues={attributes.fits.map(toSelectOptionAdapter) || []}
        onChange={(selected : AllowedObjectsType[]) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               fits: selected.map(toSetterAdapter)  as Fit[]
             }
        })}
      />


      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        choose Styles
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}


      <MultiSelectDropdownForObject
        label="Styles"
        options={options.styles.map(toSelectOptionAdapter) ?? []} 
        selectedValues={attributes.styles.map(toSelectOptionAdapter) || []}
        onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               styles :  selected.map(item => toSetterAdapter(item))  as Style[]
             }
        })}
      />


      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
       Choose Seasons
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}


      <MultiSelectDropdownForObject
        label="Season"
        options={options.seasons.map(toSelectOptionAdapter) ?? []} 
        selectedValues={attributes.season.map(toSelectOptionAdapter) || []}
        onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes ) as FashionAttributes, 
               season :  selected.map(item => toSetterAdapter(item))  as Season[]
             }
        })}
      />


      {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        Gender 
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}
      <MultiSelectDropdownForObject
        label="Gender"
        options={options.genders.map(toSelectOptionAdapter) ?? []} 
        selectedValues={attributes.gender.map(toSelectOptionAdapter) || []}
        onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...(basicInfoForm.attributes) as FashionAttributes , 
               gender:  selected.map(item => toSetterAdapter(item)) as Gender[]
             }
        })}
      />

     
    </div>
  );
};


export default FashionAttributesSection ; 