import CollapsibleSection from "@/components/CollapsibleSection";
import TagSection from "@/components/TagInput";
import TagInput from "@/components/TagInput";
import CustomSelect from "@/components/ui/CustomSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { currentTheme } from "@/data/currentTheme";
import { Gender, PerfumesProduct } from "@/types/productsTypes";
import { Upload, X, Plus, Video, Droplet, DollarSign, Settings } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import MediaSection from "../../MediaSection";
import { Cover } from "@/types/inventoryTypes";
import BaseSharedForm from "../../BaseSharedForm";
import { Button } from "@/components/ui/button";

const PerfumesBasicInfoForm = () => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [showMedia, setShowMedia] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showVolumes, setShowVolumes] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const metadataRef = useRef<HTMLDivElement | null>(null);
  const volumesRef = useRef<HTMLDivElement | null>(null);
  const advancedRef = useRef<HTMLDivElement | null>(null);
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();


  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [ videoPreview]);

  useEffect(() => {
    if (showMedia && mediaRef.current) {
      mediaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showMedia]);

  useEffect(() => {
    if (showMetadata && metadataRef.current) {
      metadataRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showMetadata]);

  useEffect(() => {
    if (showVolumes && volumesRef.current) {
      volumesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showVolumes]);

  useEffect(() => {
    if (showAdvanced && advancedRef.current) {
      advancedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAdvanced]);



  if (!basicInfoForm) return null;




  const handleToggleSection = (
    sectionName: string,
    currentState: boolean,
    setter: (value: boolean) => void,
    clearData?: () => void
  ) => {
    if (currentState && clearData) {
      const confirmed = window.confirm(
        `Deactivating this section will destroy all data in "${sectionName}". Are you sure?`
      );
      if (confirmed) {
        clearData();
        setter(false);
      }
    } else {
      setter(!currentState);
    }
  };


  return (
    <div className="w-full h-full z-[999] overflow-y-auto" style={{ backgroundColor: currentTheme.bg }}>
      <div className="space-y-8 p-8 rounded-xl bg-white shadow-2xl m-4">

        {/* BASE INFO - Always Visible */}
        <section>
         <BaseSharedForm />
        </section>

        {/* OPTIONAL SECTIONS - Toggleable */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wide mb-4" style={{ color: currentTheme.text }}>
            Optional Sections
          </h2>

          {/* MEDIA Section has its own component its shred between multiple form in other niches */}
          {basicInfoForm.niche === "perfumes" && (

            <CollapsibleSection
                  title="Add Media"
                  icon={Video}
                  isOpen={showMedia}
                  onToggle={(newState) =>
                    handleToggleSection("Add Media", showMedia, setShowMedia, () => {
                      setBasicInfoForm({ ...basicInfoForm, covers: [] as Cover[] , video: "" });
                      setVideoPreview(null);
                    })
                  }
                  ref={mediaRef}
                >
               <MediaSection {...{setBasicInfoForm , basicInfoForm , setVideoPreview  ,videoPreview}} />
            </CollapsibleSection>
          )}

          {/* PERFUME METADATA Section */}
          {basicInfoForm.niche === "perfumes" && (
            <CollapsibleSection
              title="Add Perfume Metadata"
              icon={Droplet}
              isOpen={showMetadata}
              onToggle={(newState) =>
                handleToggleSection("Add Perfume Metadata", showMetadata, setShowMetadata, () => {
                  setBasicInfoForm({
                    ...basicInfoForm,
                    gender: [] as Gender[],
                    concentration: undefined,
                    fragranceFamily: undefined,
                    quantity: 0,
                    topNotes: [],
                    middleNotes: [],
                    baseNotes: [],
                  });
                })
              }
              ref={metadataRef}
            >
              {/* Gender, Concentration, Fragrance Family */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Gender
                  </label>
                  <MultiSelectDropdown
                    label="Gender"
                    options={['male', 'female', 'unisex']}
                    selectedValues={basicInfoForm.gender || []}
                    onChange={(selected) => setBasicInfoForm({ ...basicInfoForm, gender: selected as Gender[] })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Concentration
                  </label>
                  <CustomSelect
                    value={(basicInfoForm as PerfumesProduct).concentration || ''}
                    onChange={(value) => setBasicInfoForm({ ...basicInfoForm, concentration: value as "EDT" | "EDP" | "Parfum" | "Cologne" })}
                    options={[
                      { value: '', label: 'Select Concentration' },
                      { value: 'Cologne', label: 'Cologne' },
                      { value: 'EDT', label: 'EDT (Eau de Toilette)' },
                      { value: 'EDP', label: 'EDP (Eau de Parfum)' },
                      { value: 'Parfum', label: 'Parfum' },
                    ]}
                    placeholder="Select Concentration"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Fragrance Family
                  </label>
                  <CustomSelect
                    value={(basicInfoForm as PerfumesProduct).fragranceFamily || ''}
                    onChange={(value) => setBasicInfoForm({ ...basicInfoForm, fragranceFamily: value as "fresh" | "woody" | "oriental" | "floral" | "aromatic" })}
                    options={[
                      { value: '', label: 'Select Family' },
                      { value: 'fresh', label: 'Fresh' },
                      { value: 'woody', label: 'Woody' },
                      { value: 'oriental', label: 'Oriental' },
                      { value: 'floral', label: 'Floral' },
                      { value: 'aromatic', label: 'Aromatic' },
                    ]}
                    placeholder="Select Family"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                  Quantity (ml)
                </label>
                <input
                  type="number"
                  value={(basicInfoForm as PerfumesProduct).quantity || ''}
                  onChange={(e) => setBasicInfoForm({ ...basicInfoForm, quantity: e.target.value ? parseInt(e.target.value) : 0 })}
                  className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                  style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
                />
              </div>

              {/* Fragrance Notes */}
              <div className="space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wide" style={{ color: currentTheme.text }}>
                  Fragrance Notes
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {["topNotes", "middleNotes", "baseNotes"].map((noteKey) => (
                    <div key={noteKey}>
                      <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                        {noteKey === "topNotes" ? "Top Notes" : noteKey === "middleNotes" ? "Middle Notes" : "Base Notes"}
                      </label>
                      <MultiSelectDropdown
                        label={noteKey === "topNotes" ? "Top Notes" : noteKey === "middleNotes" ? "Middle Notes" : "Base Notes"}
                        options={(basicInfoForm as PerfumesProduct)[noteKey] || []}
                        selectedValues={(basicInfoForm as PerfumesProduct)[noteKey] || []}
                        onChange={(selected) => setBasicInfoForm({
                          ...basicInfoForm,
                          [noteKey]: selected
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>
          )}

          {/* VOLUMES & PRICING Section */}
          {basicInfoForm.niche === "perfumes" && (
            <CollapsibleSection
              title="Add Volumes & Pricing"
              icon={DollarSign}
              isOpen={showVolumes}
              onToggle={(newState) =>
                handleToggleSection("Add Volumes & Pricing", showVolumes, setShowVolumes, () => {
                  setBasicInfoForm({ ...basicInfoForm, volumes: [] });
                })
              }
              ref={volumesRef}
            >
              <div className="space-y-3">
                {(basicInfoForm as PerfumesProduct).volumes?.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ backgroundColor: currentTheme.bg, borderWidth: '2px', borderColor: currentTheme.border }}
                  >
                    <input
                      type="number"
                      placeholder="ml"
                      value={v.volume}
                      onChange={(e) => {
                        const updated = [...(basicInfoForm as PerfumesProduct).volumes];
                        updated[i].volume = parseInt(e.target.value);
                        setBasicInfoForm({ ...basicInfoForm, volumes: updated });
                      }}
                      className="px-4 py-2 rounded-xl shadow-sm w-24 font-medium"
                      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={v.price}
                      onChange={(e) => {
                        const updated = [...(basicInfoForm as PerfumesProduct).volumes];
                        updated[i].price = parseFloat(e.target.value);
                        setBasicInfoForm({ ...basicInfoForm, volumes: updated });
                      }}
                      className="px-4 py-2 rounded-xl shadow-sm flex-1 font-medium"
                      style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
                    />
                    <button
                      onClick={() => {
                        const updated = [...(basicInfoForm as PerfumesProduct).volumes];
                        updated.splice(i, 1);
                        setBasicInfoForm({ ...basicInfoForm, volumes: updated });
                      }}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <Button 
              
                  variant="outline"
                  onClick={() => setBasicInfoForm({
                    ...basicInfoForm,
                    volumes: [...((basicInfoForm as PerfumesProduct).volumes || []), { volume: 0, price: 0 }]
                  })}
                >
                  <Plus className="w-5 h-5" />  Add Volume
                </Button>
              </div>
            </CollapsibleSection>
          )}

          {/* ADVANCED Section */}
          {basicInfoForm.niche === "perfumes" && (
            <CollapsibleSection
              title="Advanced Settings"
              icon={Settings}
              isOpen={showAdvanced}
              onToggle={(newState) =>
                handleToggleSection("Advanced Settings", showAdvanced, setShowAdvanced, () => {
                  setBasicInfoForm({
                    ...basicInfoForm,
                    longevity: '',
                    sillage: '',
                    sku: '',
                    stockQuantity: undefined,
                  });
                })
              }
              ref={advancedRef}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Longevity
                  </label>
                  <CustomSelect
                    value={(basicInfoForm as PerfumesProduct).longevity || ''}
                    onChange={(value) => setBasicInfoForm({ ...basicInfoForm, longevity: value })}
                    options={[
                      { value: '', label: 'Select Longevity' },
                      { value: 'weak', label: 'Weak' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'long-lasting', label: 'Long Lasting' },
                      { value: 'eternal', label: 'Eternal' },
                    ]}
                    placeholder="Select Longevity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Sillage
                  </label>
                  <CustomSelect
                    value={(basicInfoForm as PerfumesProduct).sillage || ''}
                    onChange={(value) => setBasicInfoForm({ ...basicInfoForm, sillage: value })}
                    options={[
                      { value: '', label: 'Select Sillage' },
                      { value: 'intimate', label: 'Intimate' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'strong', label: 'Strong' },
                      { value: 'enormous', label: 'Enormous' },
                    ]}
                    placeholder="Select Sillage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    SKU
                  </label>
                  <input
                    type="text"
                    value={basicInfoForm.sku || ''}
                    onChange={(e) => setBasicInfoForm({ ...basicInfoForm, sku: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                    style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={basicInfoForm.stockQuantity || ''}
                    onChange={(e) => setBasicInfoForm({ ...basicInfoForm, stockQuantity: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                    style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}
                  />
                </div>
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfumesBasicInfoForm;
