
import { useEffect, useRef, useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/product/ProductDataContext';
import {  Category, Cover } from '@/types/inventoryTypes';
import { getEditedData, getEmptyInitialProductData } from '@/data/initialProductData';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import {  ProductBackendProps } from '@/types/productsTypes';
import { CategoriesList } from './../../Pages/admin/pages/categories/CategoriesList';
import { ProductBase } from '@/types/products/baseProductTypes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema } from '@/shemas/productCreateform';








const ProductDataProvider = ({children , data : {product , categoryObject , options : backendOptions } }:ProductBackendProps) => {


     useEffect(() => {
        setCategory(categoryObject)
    }, [categoryObject]); 
  
    const getInitialData = (mode: ModeForm, product?: ProductBase ,category?: Category ) => {
      if (mode === "create") return getEmptyInitialProductData(category);
      if (mode === "edit" && product) return getEditedData(product, category);
      throw new Error("Invalid state");
      };
      
    const modeForm : ModeForm = product ? "edit" : "create" ; 
   
    const initialData = getInitialData(modeForm, product , categoryObject);
    const [productData ,   setProductData] = useState<ProductBase | undefined>(() => product)
    const [category , setCategory] = useState(categoryObject) ;
    const [categoryList , setCategoryList] = useState<Category[]>(backendOptions.categories) ; 
    const draftId = useRef<string | undefined>(product?.id ?? null);
    const { register, handleSubmit, getValues, control, formState, watch, setValue } = useForm<ProductBase>({
        defaultValues: initialData,  // ← just pass the object directly
        resolver: zodResolver(productSchema), // ← add this if you have a schema
        mode: "onChange"
        })
    const [options] = useState(backendOptions);

    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        categoryList , setCategoryList , 
        category , setCategory  , 
        productData ,   setProductData , 
        setValue , getValues , 
        register , handleSubmit , watch , 
        control , formState , 
        options , 
        draftId
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 