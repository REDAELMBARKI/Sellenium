
import { useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/sharedProductContext/ProductDataContext';
import { FashionVariant, Gender, ProductBackendProps, ProductBasicInfoData, ProductDataGlobal, ProductVariant } from '@/types/productsTypes';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';
import { Product } from '@/types/dashboardTypes';
import { NicheItem } from '@/context/NicheContext';
import { FashionOptions, Material } from '@/types/inventoryTypes';








const ProductDataProvider = ({children ,product : productSource , inventoryOptions , tagSuggestions : tagSuggestionsSource }:ProductBackendProps) => {
     const {currentNiche} = useNicheCtx()
     const modeForm : ModeForm = productSource ? "edit" : "create" ; 

      let initialData: ProductDataGlobal;

    switch (currentNiche) {
    case "fashion":
        initialData = {
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [],
        description: "",
        rating_average: undefined,
        thumbnail: "",
        tags: [],
        isFeatured: false,
        niche: "fashion",
        gender: [] as Gender[],
        materials: [] as Material[],
        variants: [] as FashionVariant[],
        };
        break;

    case "perfumes":
        initialData = {
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [],
        description: "",
        rating_average: undefined,
        thumbnail: "",
        tags: [],
        isFeatured: false,
        niche: "perfumes",
        concentration: "EDT",
        fragranceFamily: "fresh",
        topNotes: [],
        middleNotes: [],
        baseNotes: [],
        volumes: [],
        quantity: 0,
        covers: [],
        gender: [] as Gender[],
        };
        break;

    case "electronics":
        initialData = {
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [],
        description: "",
        rating_average: undefined,
        thumbnail: "",
        tags: [],
        isFeatured: false,
        niche: "electronics",
        quantity: 0,
        colors: [],
        };
        break;

    default:
        throw new Error("Unknown niche");
    }

    
    const initialVariants : ProductVariant[]  = (modeForm === "edit" && productSource?.niche === "fashion") ? productSource.variants  ?? [] : [] as ProductVariant[]

    const [productData ,   setProductData] = useState<ProductDataGlobal | undefined>(() => productSource)
    const [basicInfoForm , setBasicInfoForm] = useState<ProductBasicInfoData>(() => initialData );

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