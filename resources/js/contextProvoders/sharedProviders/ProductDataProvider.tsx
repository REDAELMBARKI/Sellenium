
import { useState } from 'react';
import { ProductDataContext } from '@/context/sharedProductContext/ProductDataContext';
import { ElectronicsVariant, FashionVariant, ParfumeVariant, ProductBackendProps, ProductDataGlobal } from '@/types/productsTypes';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';










const ProductDataProvider = ({children ,product , inventoryOptions , tagSuggestions }:ProductBackendProps) => {
     const {currentNiche} = useNicheCtx()
      const initialData: ProductDataGlobal = product ?? {
        id: undefined,
        name: "",
        brand: "",
        price: "",
        compareAtPrice: "",
        costPrice: "",
        category: [],
        gender: [],
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

    const [productData, setProductData] = useState<ProductDataGlobal>(() => initialData);
   const [inventoryOptionsState, setInventoryOptionsState] = useState(inventoryOptions);
    const [tagSuggestionsState, setTagSuggestionsState] = useState(tagSuggestions);

    return (
    <ProductDataContext.Provider value={{
        productData, setProductData , 
        inventoryOptionsState, setInventoryOptionsState ,
        tagSuggestionsState, setTagSuggestionsState
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 