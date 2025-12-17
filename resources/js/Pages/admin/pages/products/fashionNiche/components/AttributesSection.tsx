import CustomSelectForObject from "@/components/ui/CustomSelectForObject";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import MultiSelectDropdownForObject from "@/components/ui/MultiSelectDropdownForObject";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

import { Fit, Material, Season, Style } from "@/types/inventoryTypes";
import { Gender } from "@/types/productsTypes";

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);
const countryList = Object.entries(countries.getNames("en")).map(([code, name]) => ({
  code,
  name,
}));


const AttributesSection = () => {
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const {state :{currentTheme}} = useStoreConfigCtx()


  if (!basicInfoForm || basicInfoForm.niche !== 'fashion') return null;

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
        selectedValues={basicInfoForm?.materials || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, materials: v  as Material[]})}
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
        selectedValues={basicInfoForm?.fits || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, fits: v as Fit[]})}
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
        selectedValues={basicInfoForm?.styles || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, styles: v as Style[]})}
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
        selectedValues={basicInfoForm?.season || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, season: v  as Season[]})}
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
        selectedValues={basicInfoForm?.gender || []}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, gender: v as Gender[] })}
      />


     {/*section title */}
      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
        Choose Made Country 
      </label>
      <div className="h-1 w-12 rounded-full mb-6" style={{ background: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accentHover})` }}></div>
      {/*end section title */}
      <CustomSelectForObject
        label="select a countries of Origin"

        value={basicInfoForm?.madeCountry ? { label: basicInfoForm.madeCountry.name , value: basicInfoForm.madeCountry.code}  : null}
        onChange={(v) => setBasicInfoForm({ ...basicInfoForm, madeCountry : {code : v.value , name : v.label} })}
        options={countryList.map(c => ({ label: c.name , value: c.code }))}
      />
    </div>
  );
};


export default AttributesSection ; 