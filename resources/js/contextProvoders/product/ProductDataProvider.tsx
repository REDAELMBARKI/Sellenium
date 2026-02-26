
import { useEffect, useRef, useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/product/ProductDataContext';
import {  Category, Cover } from '@/types/inventoryTypes';
import { getEditedData, getEmptyInitialProductData } from '@/data/initialProductData';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import {  ProductBackendProps } from '@/types/productsTypes';
import { CategoriesList } from './../../Pages/admin/pages/categories/CategoriesList';
import { ProductBase } from '@/types/products/baseProductTypes';
import { useForm } from 'react-hook-form';








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
    const {register , handleSubmit , setValue , getValues ,formState : {isDirty , isValid }} = useForm({
        defaultValues :  () => initialData , 
        mode : 'onChange'
    })
    const draftId = useRef<string | undefined>(product?.id ?? undefined);
    const [options] = useState(backendOptions);

    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        categoryList , setCategoryList , 
        category , setCategory  , 
        productData ,   setProductData ,
        register , handleSubmit , setValue , getValues , 
        isDirty , isValid,
        options , 
        draftId
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 