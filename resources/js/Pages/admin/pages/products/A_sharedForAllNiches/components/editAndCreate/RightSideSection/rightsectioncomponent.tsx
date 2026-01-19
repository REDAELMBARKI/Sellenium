import {
  FolderTree,
  Package,
  Truck,
  Search,
  Users,
  Globe,
  Tag,
} from 'lucide-react';
import { SectionWrapper } from './sectionwrapper';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import { HoverInfoLabel } from './HoverInfoLabel';
import { ThemedInput, ThemedSelect, ThemedTextarea } from './ThemedInput';
import { Category } from '@/types/inventoryTypes';
import { SUBCATEGORIES } from '@/data/listOfSubCategories';
import MultiSelectDropdownForObject from '@/components/ui/MultiSelectDropdownForObject';
import CustomSelectForObject from '@/components/ui/CustomSelectForObject';
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import CustomSelectForObjectNative from '@/components/ui/CustomSelectForObjectNative';
import TagSection from '@/components/TagSection';
import { v4 } from 'uuid';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import CustomSelectNative from '@/components/ui/CustomSelectNative';
import adapters from '@/functions/product/adapters';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { route } from 'ziggy-js';
countries.registerLocale(enLocale);
const countryList = Object.entries(countries.getNames("en")).map(([code, name]) => ({
  code,
  name,
}));

// year
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i); // last 50 years
 

export function RightSectionComponent() {
  const { basicInfoForm, setBasicInfoForm , category} = useProductDataCtx();
  const {state : {currentTheme}} = useStoreConfigCtx() 
  const [subCategories , setSubCategories] = useState<Category[]>([])
  useEffect(() => {
     if(!category) return ;
     setBasicInfoForm(prev => ({...prev , subCategories : []})) ; 
     const getSubCategories = async () => {
        try{
          const res = await axios.get(route('get.subCategories') , {
            params : {
                'parent_id' : category.id
            }
          })
          setSubCategories(res.data)
        }catch(err:any){
           throw err ;
        }
     }
    getSubCategories();
  }, [category]);
  
  const {toSelectOptionAdapter , toSetterAdapter} = adapters()
  return (
    <div className="w-full lg:w-[35%] space-y-6 py-8 pr-4">
      <SectionWrapper title="Subcategories" icon={FolderTree}>
        <div>
          <HoverInfoLabel
            htmlFor="subcategory"
            label="Category"
            tooltip="Select the subcategory this product belongs to"
          />
          <MultiSelectDropdownForObject
            label="Select categories"
            options={subCategories.map(c => ({label : c.name , value : c.id}))}
            selectedValues={basicInfoForm?.subCategories.map(c => toSelectOptionAdapter(c)) ?? []}
            onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, subCategories: selected.map( item =>toSetterAdapter(item)) as Category[] })}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper  title="Tags / Keywords" icon={Tag} >
        <div>

          <HoverInfoLabel 
            htmlFor="tags / keywords"
            label="tags / keywords"
            tooltip="Add Tags And Keywords for this product this would helps to show related products"
          />
           {/* tags */}
          <div>
                 
                  <TagSection
                    tags={basicInfoForm.tags ?? []} 
                  />
            </div>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Made Country & Release Date" icon={Globe}>
        <HoverInfoLabel 
            htmlFor="country of origin "
            label="country of origin "
            tooltip="made origin coutry of the product (optional)"
        />


      <CustomSelectNative
        placeholder="Select country of origin"
        value={basicInfoForm?.madeCountry ?? ""}
        onChange={(v) =>
          setBasicInfoForm({
            ...basicInfoForm,
            madeCountry: v.toString(),
          })
        }
        options={countryList.map((c) => ({ label: c.name, value: c.code }))}
      />

       <HoverInfoLabel 
            htmlFor="Release Date"
            label="Release Date"
            tooltip="add a release year for this product (optional)"
        />

        <CustomSelectNative 
         placeholder='select release year'
         options={years.map(y => ({label : y , value : y}))}
         value={basicInfoForm.releaseDate ?? ''}
         onChange={(value) => setBasicInfoForm({...basicInfoForm , 
          releaseDate : value.toString()
         })}
        /> 
      
    </SectionWrapper>


      <SectionWrapper title="Inventory / Stock" icon={Package}>
        <div>
          <HoverInfoLabel
            htmlFor="quantity"
            label="Quantity"
            tooltip="How many units are currently in stock"
          />
          <ThemedInput
            type="number"
            id="quantity"
            value={basicInfoForm?.inventory?.quantity || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              inventory: {...prev.inventory, quantity: Number(e.target.value)}
            }))}
            placeholder="0"
          />
        </div>

        <div>
          <HoverInfoLabel
            htmlFor="sku"
            label="SKU"
            tooltip="Unique code to track your product and variants"
          />
          <ThemedInput
            type="text"
            id="sku"
            value={basicInfoForm.inventory?.sku || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              inventory: {...prev.inventory, sku: e.target.value}
            }))}
            placeholder="PROD-001"
          />
        </div>

        <div>
          <HoverInfoLabel
            htmlFor="backorderOptions"
            label="Backorder Options"
            tooltip="Allow customers to buy even when out of stock"
          />
          <ThemedSelect
            id="backorderOptions"
            value={basicInfoForm.inventory?.backorderOptions || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              inventory: {...prev.inventory, backorderOptions: e.target.value}
            }))}
          >
            <option value="">Do not allow</option>
            <option value="notify">Allow, but notify customer</option>
            <option value="allow">Allow</option>
          </ThemedSelect>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Shipping" icon={Truck}>
        <div>
          <HoverInfoLabel
            label="Dimensions"
            tooltip="Enter dimensions for shipping calculations"
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="height" className="block text-xs text-gray-500 mb-1">Height</label>
              <ThemedInput
                type="number"
                id="height"
                value={basicInfoForm.shipping?.dimensions?.height || ''}
                onChange={(e) => setBasicInfoForm(prev => ({
                  ...prev,
                  shipping: {...prev.shipping, height: Number(e.target.value)}
                }))}
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-xs text-gray-500 mb-1">Width</label>
              <ThemedInput
                type="number"
                id="width"
                value={basicInfoForm.shipping?.dimensions?.width || ''}
                onChange={(e) => setBasicInfoForm(prev => ({
                  ...prev,
                  shipping: {...prev.shipping, width: Number(e.target.value)}
                }))}
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="length" className="block text-xs text-gray-500 mb-1">Length</label>
              <ThemedInput
                type="number"
                id="length"
                value={basicInfoForm.shipping?.dimensions?.length || ''}
                onChange={(e) => setBasicInfoForm(prev => ({
                  ...prev,
                  shipping: {...prev.shipping, length: e.target.value}
                }))}
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div>
          <HoverInfoLabel
            htmlFor="weight"
            label="Weight"
            tooltip="Used to calculate shipping rates"
          />
          <div className="flex gap-2">
            <ThemedInput
              type="number"
              id="weight"
              value={basicInfoForm.shipping?.weight || ''}
              onChange={(e) => setBasicInfoForm(prev => ({
                ...prev,
                shipping: {...prev.shipping, weight: Number(e.target.value)}
              }))}
              placeholder="0.0"
              step="0.01"
              className="flex-1"
            />
            <span className="px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
              kg
            </span>
          </div>
        </div>

        <div>
          <HoverInfoLabel
            htmlFor="shippingClass"
            label="Shipping Class"
            tooltip="Categorize product for shipping rules"
          />
          <ThemedSelect
            id="shippingClass"
            value={basicInfoForm.shipping?.shippingClass || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              shipping: {...prev.shipping, shippingClass: e.target.value}
            }))}
          >
            <option value="">Standard</option>
            <option value="express">Express</option>
            <option value="freight">Freight</option>
            <option value="fragile">Fragile</option>
          </ThemedSelect>
        </div>
      </SectionWrapper>

      <SectionWrapper title="SEO / Marketing" icon={Search}>
        <div>
          <HoverInfoLabel
            htmlFor="metaTitle"
            label="Meta Title"
            tooltip="Title used in search engines"
          />
          <ThemedInput
            type="text"
            id="metaTitle"
            value={basicInfoForm.meta?.metaTitle || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              meta: {...prev.meta, metaTitle: e.target.value}
            }))}
            placeholder="Product Name - Brand"
            maxLength={60}
          />
        </div>

        <div>
          <HoverInfoLabel
            htmlFor="metaDescription"
            label="Meta Description"
            tooltip="Short summary shown in search results"
          />
          <ThemedTextarea
            id="metaDescription"
            value={basicInfoForm.meta?.metaDescription || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              meta: {...prev.meta, metaDescription: e.target.value}
            }))}
            placeholder="Brief product description for search results..."
            rows={3}
            maxLength={160}
          />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Vendor / Supplier Info" icon={Users}>
        <div>
          <HoverInfoLabel
            htmlFor="vendorName"
            label="Vendor Name"
            tooltip="Supplier or vendor of this product"
          />
          <ThemedInput
            type="text"
            id="vendorName"
            value={basicInfoForm.vendor?.vendorName || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              vendor: {...prev.vendor, vendorName: e.target.value}
            }))}
            placeholder="Supplier Co."
          />
        </div>

        <div>
          <HoverInfoLabel
            htmlFor="vendorSku"
            label="Vendor SKU / Code"
            tooltip="Vendor's internal code for this product"
          />
          <ThemedInput
            type="text"
            id="vendorSku"
            value={basicInfoForm.vendor?.vendorSku || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              vendor: {...prev.vendor, vendorSku: e.target.value}
            }))}
            placeholder="V-SKU-001"
          />
        </div>

        <div>
          <HoverInfoLabel
            htmlFor="vendorNotes"
            label="Optional Notes"
            tooltip="Additional notes about this vendor or product"
          />
          <ThemedTextarea
            id="vendorNotes"
            value={basicInfoForm.vendor?.vendorNotes || ''}
            onChange={(e) => setBasicInfoForm(prev => ({
              ...prev,
              vendor: {...prev.vendor, vendorNotes: e.target.value}
            }))}
            placeholder="Additional vendor information..."
            rows={3}
          />
        </div>
      </SectionWrapper>
    </div>
  );
}
