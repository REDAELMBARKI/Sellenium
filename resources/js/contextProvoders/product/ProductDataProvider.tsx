
import { useEffect, useRef, useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/product/ProductDataContext';
import {  Category, Cover } from '@/types/inventoryTypes';
import { getEditedData, getEmptyInitialProductData } from '@/data/initialProductData';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import {  ProductBackendProps } from '@/types/productsTypes';
import { CategoriesList } from './../../Pages/admin/pages/categories/CategoriesList';
import { ProductBase } from '@/types/products/ProductTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/shemas/productSchema';








const ProductDataProvider = ({children , data : {product , options  } }:ProductBackendProps) => {
    const getInitialData = (mode: ModeForm, product?: ProductBase ,category?: Category ) => {
      if (mode === "create") return getEmptyInitialProductData();
      if (mode === "edit" && product) return getEditedData(product);
      throw new Error("Invalid state");
      };
      
    const modeForm : ModeForm = product ? "edit" : "create" ; 
   
    const initialData = getInitialData(modeForm, product);
    const [nicheCategory , setNicheCategory] = useState<Category[]>() ; 
    const draftId = useRef<string | undefined>(product?.id ?? null);
    const { register, handleSubmit, getValues, control, formState  , setError, watch, setValue } = useForm<ProductBase>({
        defaultValues: initialData, 
        resolver: zodResolver(productSchema), 
        mode: "onChange"
    })

    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        nicheCategory , setNicheCategory , 
        setValue , getValues , 
        register , handleSubmit , watch , 
        control , formState , setError , 
        options , 
        draftId
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 