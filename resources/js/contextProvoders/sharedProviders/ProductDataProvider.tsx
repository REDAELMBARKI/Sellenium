
import { useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/sharedProductContext/ProductDataContext';
import { FashionVariant, Gender, PerfumesProduct, ProductBackendProps, ProductBasicInfoData, ProductDataGlobal, ProductVariant } from '@/types/productsTypes';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';
import { Product } from '@/types/dashboardTypes';
import { NicheItem } from '@/context/NicheContext';
import { FashionOptions, Material } from '@/types/inventoryTypes';
import { EmptyInitialProductDataMap, getEditedData } from '@/data/initialProductData';








const ProductDataProvider = ({children ,product , inventoryOptions , tagSuggestions : tagSuggestionsSource }:ProductBackendProps) => {
    
    const productSource: PerfumesProduct = {
  niche: "perfumes",
  id: "1",
  name: "Oud Mystique",
  brand: "Maison Elixir",
  price: "129.99",
  compareAtPrice: "149.99",
  costPrice: "65.00",
  category: ["Luxury Perfume"],
  description: "A warm and captivating unisex fragrance blending oud, amber, and sweet floral notes.",
  rating_average: 4.7,
  thumbnail: "/uploads/products/perfumes/oud-mystique-thumb.jpg",
  tags: [
    { id: 3, name: "Oud" },
    { id: 7, name: "Luxury" },
    { id: 11, name: "Unisex" },
  ],
  isFeatured: true,
  sku: "OU-12345",
  stockQuantity: 25,
  releaseDate: "2025-01-10",
  visible: true,

  concentration: "EDP",
  quantity: 25,
  fragranceFamily: "oriental",
  gender: ["male", "female"],

  topNotes: ["Saffron", "Rose", "Bergamot"],
  middleNotes: ["Oud Wood", "Amber", "Geranium"],
  baseNotes: ["Vanilla", "Patchouli", "Musk"],

  covers: [
    "/uploads/products/perfumes/oud-mystique-1.jpg",
    "/uploads/products/perfumes/oud-mystique-2.jpg",
  ],
  longevity: "long-lasting",
  sillage: "strong",

  volumes: [
    { volume: 50, price: 129.99 },
    { volume: 100, price: 179.99 },
  ],
};

    const {currentNiche} = useNicheCtx()
    const modeForm : ModeForm = productSource ? "edit" : "create" ; 

    const getInitialData = (niche: NicheItem, mode: ModeForm, product?: ProductDataGlobal) => {
    if (mode === "create") return EmptyInitialProductDataMap[niche];
    if (mode === "edit" && product) return getEditedData(product, niche);
    throw new Error("Invalid state");
    };

    const initialData = getInitialData(currentNiche, modeForm, productSource) as ProductDataGlobal;
        

    
    const initialVariants : ProductVariant[]  = (modeForm === "edit" && productSource?.niche === "fashion") ? productSource.variants  ?? [] : [] as ProductVariant[]

    const [productData ,   setProductData] = useState<ProductDataGlobal | undefined>(() => productSource)
    const [basicInfoForm , setBasicInfoForm] = useState<ProductDataGlobal>(() => initialData);

    // const inventoryOptions : FashionOptions  = inventoryOptions ;  
    const [inventoryOptionsState, setInventoryOptionsState] = useState(inventoryOptions);
    const [tagSuggestionsState, setTagSuggestionsState] = useState(tagSuggestionsSource);
  


    const [variants , setVariants] = useState<ProductVariant[]>(() => initialVariants);
    const [variantForm ,  setVariantForm] = useState<ProductVariant | null>(); 
    const [variantToDelete ,  setVariantToDelete] = useState<number | null>()
    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        variants , setVariants , 
        variantToDelete ,  setVariantToDelete , 
        variantForm ,  setVariantForm , 
        productData ,   setProductData , 
        basicInfoForm , setBasicInfoForm , 
        inventoryOptionsState, setInventoryOptionsState ,
        tagSuggestionsState, setTagSuggestionsState
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 