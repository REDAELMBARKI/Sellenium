
import { useState } from 'react';
import { EditProductDataContext } from './../../context/editProductContext/editProductDataContext';
import { InventoryOptions,  } from '@/types/inventoryTypes';
import { Tag } from '@/types/tagsTypes';
import { EditProductBackendProps, ProductBasicInfoData, ProductDataGlobal, Variant } from '@/types/productsTypes';










const EditProductDataProvider = ({children , product , inventoryOptions , tagSuggestions }:EditProductBackendProps) => {
        // backend data
        const [productData, setProductData] = useState<ProductDataGlobal>(product);
        const [inventoryOptionsState, setInventoryOptionsState] =
            useState<InventoryOptions>(inventoryOptions);
        const [tagSuggestionsState, setTagSuggestionsState] =
            useState<Tag[]>(tagSuggestions);

        const [variants , setVariants] =  useState<Variant[]>([])   
        const [variantForm, setVariantForm] = useState<Variant | null>(null);
        const [variantToDelete, setVariantToDelete] = useState<number | null>(null);
        const [basicInfoForm, setBasicInfoForm] = useState<ProductBasicInfoData>({
                   id: product.id ,
                   name: product.name,
                   brand: product.brand,
                   rating_average : product.rating_average ,
                   price: product.price,
                   description: product.description,
                   category: product.category,
                   gender: product.gender,
                   isFeatured: product.isFeatured,
                   free_shipping: product.free_shipping,
                   thumbnail: product.thumbnail,
                   tags: product.tags,
               });


        return (
        <EditProductDataContext.Provider value={{basicInfoForm, setBasicInfoForm , productData, setProductData , inventoryOptionsState, setInventoryOptionsState , 
            variants , setVariants , 
            variantForm, setVariantForm , 
            tagSuggestionsState, setTagSuggestionsState , 
            variantToDelete, setVariantToDelete
        }}>
         {children}
        </EditProductDataContext.Provider>
    )
}


export default EditProductDataProvider ; 