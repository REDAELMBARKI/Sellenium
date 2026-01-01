import CustomSelectForObject from "@/components/ui/CustomSelectForObject";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

import { Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);
const countryList = Object.entries(countries.getNames("en")).map(([code, name]) => ({
  code,
  name,
}));


const FashionAttributesSection = () => {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {state :{currentTheme}} = useStoreConfigCtx()


  if (!basicInfoForm || basicInfoForm.category !== 'fashion') return null;

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
        selectedValues={basicInfoForm?.attributes.materials || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...basicInfoForm.attributes , 
               materials: v  as Material[]
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
        selectedValues={basicInfoForm?.attributes.fits || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...basicInfoForm.attributes , 
               fits: v  as Fit[]
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
        selectedValues={basicInfoForm?.attributes.styles || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...basicInfoForm.attributes , 
               styles : v  as Style[]
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
        selectedValues={basicInfoForm?.attributes.season || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...basicInfoForm.attributes , 
               season : v  as Season[]
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
        selectedValues={basicInfoForm?.attributes.gender || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, 
             attributes : {
               ...basicInfoForm.attributes , 
               gender: v  as Gender[]
             }
        })}
      />


     {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        Choose Made Country 
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}
      <CustomSelectForObject
        label="select a countries of Origin"

        value={basicInfoForm?.attributes.madeCountry ? { label: basicInfoForm.attributes.madeCountry.name , value: basicInfoForm.attributes.madeCountry.code}  : null}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, 
                attributes : {
                   ...basicInfoForm.attributes , 
                   madeCountry : {code : v.value , name : v.label} 
                }
        })}
        options={countryList.map(c => ({ label: c.name , value: c.code }))}
      />
    </div>
  );
};


export default FashionAttributesSection ; 