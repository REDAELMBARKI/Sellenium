import {
  FolderTree,
  Package,
  Truck,
  Search,
  Users,
  Settings
} from 'lucide-react';

import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { SectionWrapper } from './sectionwrapper';
import { ThemedInput, ThemedLabel, ThemedSelect, ThemedTextarea } from './ThemedInput';
import { NoteUser } from './noteuser';
import { useProductDataCtx } from '@/contextHooks/sharedhooks/useProductDataCtx';
import CustomSelect from '@/components/ui/CustomSelect';
import { CATEGORIES } from '@/data/listOfCategories';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import { Category } from '@/types/inventoryTypes';
import MultiSelectDropdownForObject from '@/components/ui/MultiSelectDropdownForObject';


export function RightSectionComponent() {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();
  const {basicInfoForm , setBasicInfoForm} = useProductDataCtx()
  return (
    <div className="w-full lg:w-[35%] space-y-8 py-8 pr-4">
      <SectionWrapper title="Subcategories" icon={FolderTree}>
        {/* Category */}
                  <div>
                    <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                      Category
                    </label>
                    <MultiSelectDropdownForObject
                      label="Product Type"
                      options={Array.isArray(basicInfoForm.subCategory) ? basicInfoForm.subCategory : []}
                      selectedValues={Array.isArray(basicInfoForm.subCategory) ? basicInfoForm.subCategory : []}
                      onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, subCategory: selected as Category[] })}
                    />
                  </div>
      </SectionWrapper>

      <SectionWrapper title="Inventory / Stock" icon={Package}>
        <div>
          <ThemedLabel htmlFor="quantity">Quantity</ThemedLabel>
          <ThemedInput
            type="number"
            id="quantity"
            value={basicInfoForm?.inventory?.quantity || ''}
             onChange={(e) => setBasicInfoForm(prev => ({...prev , inventory : 
              {...prev.inventory  , quantity : e.target.value }

            }))}
            placeholder="0"
          />
          <NoteUser text="How many units are currently in stock" />
        </div>

        <div>
          <ThemedLabel htmlFor="sku">SKU</ThemedLabel>
          <ThemedInput
            type="text"
            id="sku"
            value={basicInfoForm.inventory?.sku || ''}
             onChange={(e) => setBasicInfoForm(prev => ({...prev , inventory : 
              {...prev.inventory  , sku : e.target.value }

            }))}
            placeholder="PROD-001"
          />
          <NoteUser text="Unique code to track your product and variants" />
        </div>

        <div>
          <ThemedLabel htmlFor="backorderOptions">Backorder Options</ThemedLabel>
          <ThemedSelect
            id="backorderOptions"
            value={basicInfoForm.inventory?.backorderOptions || ''}
            onChange={(e) => setBasicInfoForm(prev => ({...prev , inventory : 
              {...prev.inventory  , backorderOptions : e.target.value }

            }))}
          >
            <option value="">Do not allow</option>
            <option value="notify">Allow, but notify customer</option>
            <option value="allow">Allow</option>
          </ThemedSelect>
          <NoteUser text="Allow customers to buy even when out of stock" />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Shipping" icon={Truck}>
        <div>
          <ThemedLabel htmlFor="weight">Weight</ThemedLabel>
          <div className="flex gap-2">
            <ThemedInput
              type="number"
              id="weight"
              value={basicInfoForm.shipping?.weight || ''}
              onChange={(e) => setBasicInfoForm(prev => ({...prev , shipping : 
              {...prev.shipping  , weight : e.target.value }

            }))}
              placeholder="0.0"
              step="0.01"
              className="flex-1"
            />
            <span
              className="px-3 py-2 text-sm"
              style={{
                backgroundColor: currentTheme.bgSecondary,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: currentTheme.borderRadius,
                color: currentTheme.textSecondary,
              }}
            >
              kg
            </span>
          </div>
          <NoteUser text="Used to calculate shipping rates" />
        </div>

        <div>
          <ThemedLabel htmlFor="dimensions">Dimensions</ThemedLabel>
          <ThemedInput
            type="text"
            id="dimensions"
            value={basicInfoForm.shipping?.dimensions || ''}
            onChange={(e) => setBasicInfoForm(prev => ({...prev , shipping : 
              {...prev.shipping  , dimensions : e.target.value }

            }))}
            placeholder="10 × 5 × 3 cm"
          />
          <NoteUser text="Length × Width × Height for packaging" />
        </div>

        <div>
          <ThemedLabel htmlFor="shippingClass">Shipping Class</ThemedLabel>
          <ThemedSelect
            id="shippingClass"
            value={basicInfoForm.shipping?.shippingClass || ''}
             onChange={(e) => setBasicInfoForm(prev => ({...prev , shipping : 
              {...prev.shipping  , shippingClass : e.target.value }

            }))}
          >
            <option value="">Standard</option>
            <option value="express">Express</option>
            <option value="freight">Freight</option>
            <option value="fragile">Fragile</option>
          </ThemedSelect>
          <NoteUser text="Categorize product for shipping rules" />
        </div>
      </SectionWrapper>

      <SectionWrapper title="SEO / Marketing" icon={Search}>
        <div>
          <ThemedLabel htmlFor="metaTitle">Meta Title</ThemedLabel>
          <ThemedInput
            type="text"
            id="metaTitle"
            value={basicInfoForm.meta?.metaTitle || ''}
             onChange={(e) => setBasicInfoForm(prev => ({...prev , meta : 
              {...prev.meta  , metaTitle : e.target.value }

            }))}
            placeholder="Product Name - Brand"
            maxLength={60}
          />
          <NoteUser text="Title used in search engines" />
        </div>

        <div>
          <ThemedLabel htmlFor="metaDescription">Meta Description</ThemedLabel>
          <ThemedTextarea
            id="metaDescription"
            value={basicInfoForm.meta?.metaDescription || ''}
            onChange={(e) => setBasicInfoForm(prev => ({...prev , meta : 
              {...prev.meta  , metaDescription : e.target.value }

            }))}
            placeholder="Brief product description for search results..."
            rows={3}
            maxLength={160}
          />
          <NoteUser text="Short summary shown in search results" />
        </div>

        <div>
          <ThemedLabel htmlFor="tags">Tags / Keywords</ThemedLabel>
           {/* tags */}
          <NoteUser text="Labels to make this product searchable" />
        </div>
      </SectionWrapper>

      <SectionWrapper title="Vendor / Supplier Info" icon={Users}>
        <div>
          <ThemedLabel htmlFor="vendorName">Vendor Name</ThemedLabel>
          <ThemedInput
            type="text"
            id="vendorName"
            value={basicInfoForm.vendor?.vendorName || ''}
            onChange={(e) => setBasicInfoForm(prev => ({...prev , vendor : 
              {...prev.vendor  , vendorName : e.target.value }

            }))}
            placeholder="Supplier Co."
          />
          <NoteUser text="Supplier or vendor of this product" />
        </div>

        <div>
          <ThemedLabel htmlFor="vendorSku">Vendor SKU / Code</ThemedLabel>
          <ThemedInput
            type="text"
            id="vendorSku"
            value={basicInfoForm.vendor?.vendorSku || ''}
            onChange={(e) => setBasicInfoForm(prev => ({...prev , vendor : 
              {...prev.vendor  , vendorSku : e.target.value }

            }))}
            placeholder="V-SKU-001"
          />
          <NoteUser text="Vendor's internal code for this product" />
        </div>

        <div>
          <ThemedLabel htmlFor="vendorNotes">Optional Notes</ThemedLabel>
          <ThemedTextarea
            id="vendorNotes"
            value={basicInfoForm.vendor?.vendorNotes || ''}
            onChange={(e) => setBasicInfoForm(prev => ({...prev , vendor : 
              {...prev.vendor  , vendorNotes : e.target.value }

            }))}
            placeholder="Additional vendor information..."
            rows={3}
          />
          <NoteUser text="Additional notes about this vendor or product" />
        </div>
      </SectionWrapper>

     
    </div>
  );
}
