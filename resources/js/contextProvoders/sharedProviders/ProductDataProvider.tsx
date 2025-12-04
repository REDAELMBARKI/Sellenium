
import { useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/sharedProductContext/ProductDataContext';
import { ElectronicsVariant, FashionAttributes, FashionVariant, ParfumeVariant, ProductBackendProps, ProductBasicInfoData, ProductDataGlobal, ProductVariant } from '@/types/productsTypes';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';
import { Product } from '@/types/dashboardTypes';
import { NicheItem } from '@/context/NicheContext';








const ProductDataProvider = ({children ,product : productSource , inventoryOptions , tagSuggestions : tagSuggestionsSource }:ProductBackendProps) => {
     const {currentNiche} = useNicheCtx()
      const initialData: ProductDataGlobal = productSource ?? {
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [] as string[],
        gender: [] as string[],
        description: "",
        rating_average: undefined,
        thumbnail: "",
        tags: [],
        isFeatured: false,
        niche: currentNiche ?? "fashion",         
        // optional niche fields
        fashionFields: undefined,
        parfumesFields: undefined,
        electronicsFields: undefined,
        // variants
        fashionVariants: [] as FashionVariant[] ,
        parfumesVariants: [] as ParfumeVariant[],
        electronicsVariants: [] as ElectronicsVariant[]
    };
    
    const {fashionVariants = null , electronicsVariants = null , parfumesVariants = null } = productSource || {} ;

    const variantsMap : Record<NicheItem , ProductVariant[] | null> =  {
       "fashion" : fashionVariants , 
       "electronics" : electronicsVariants , 
       "parfumes" : parfumesVariants
    }
    const nicheVariants = variantsMap[currentNiche]
    
    const initialVariants : ProductVariant[]  = productSource ? nicheVariants ?? [] : [] as ProductVariant[]

    const modeForm : ModeForm = productSource ? "edit" : "create" ; 
    const [productData ,   setProductData] = useState<ProductDataGlobal | undefined>(() => productSource)
    const [basicInfoForm , setBasicInfoForm] = useState<ProductBasicInfoData>(() => initialData);
    const [inventoryOptionsState, setInventoryOptionsState] = useState(inventoryOptions);
    const [tagSuggestionsState, setTagSuggestionsState] = useState(tagSuggestionsSource);


    const [variants , setVariants] = useState<ProductVariant[]>(() => initialVariants);
    const [variantForm ,  setVariantForm] = useState<ProductVariant>(); 
    return (
    <ProductDataContext.Provider value={{ 
        modeForm , 
        //  variantForm ,  setVariantForm , 
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