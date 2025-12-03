
import { useState } from 'react';
import { EditProductDataContext } from './../../context/editProductContext/editProductDataContext';
import { InventoryOptions,  } from '@/types/inventoryTypes';
import { Tag } from '@/types/tagsTypes';
import {ProductBackendProps, ProductBasicInfoData, ProductDataGlobal, Variant } from '@/types/productsTypes';





 




const ProductDataProvider = ({children , product , inventoryOptions , tagSuggestions }:ProductBackendProps) => {
        // backend data
        const [productData, setProductData] = useState<ProductDataGlobal>(product);

        const [inventoryOptionsState, setInventoryOptionsState] =
            useState<InventoryOptions>(inventoryOptions);
        const [tagSuggestionsState, setTagSuggestionsState] =
            useState<Tag[]>(tagSuggestions);

        return (
        <EditProductDataContext.Provider value={{ productData, setProductData , inventoryOptionsState, setInventoryOptionsState , 
            tagSuggestionsState, setTagSuggestionsState , 
        }}>
         {children}
        </EditProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 