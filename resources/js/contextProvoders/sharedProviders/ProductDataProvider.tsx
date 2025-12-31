
import { useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/sharedProductContext/ProductDataContext';

import { Product } from '@/types/dashboardTypes';

import {  Color, NicheOptions } from '@/types/inventoryTypes';
import { getEditedData, getEmptyInitialProductData } from '@/data/initialProductData';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { CategoryCode } from '@/types/products/categories';
import { FashionProduct } from '@/types/products/fashionTypes';
import { ProductBackendProps, ProductDataGlobal } from '@/types/productsTypes';








const ProductDataProvider = ({children , product , options : backendOptions }:ProductBackendProps) => {

  const productSource : FashionProduct  = {
  category: "fashion",
  id: "fash123",
  name: "Urban Street Jacket",
  brand: "TrendCo",
  subCategory: [{id:"1" , name:"Outerwear"}, {id:"2" , name: "Jackets"}, {id:"3" , name: "Streetwear"}],
  description: "A versatile street jacket made from premium materials, perfect for urban adventures.",
  rating_average: 4.5,
  thumbnail: {path:"/images/red.jpg" , id:"23"},
  video:{path: "/videos/illusion.mp4" , id:"32"},
  covers: [
    {id : "1" ,  path: "/images/red.jpg" },
    {id : "2" ,  path: "/images/perpel.jpg" }
  ],
  tags: [
    { id: "t1", name: "New Arrival" },
    { id: "t2", name: "Bestseller" },
  ],
  isFeatured: true,
  releaseDate: "2025-10-01",
  isFreeShipping : true , 

  attributes : {
      materials: [
        { id: 1, name: "Cotton" },
        { id: 2, name: "Polyester" },
      ],
      fits: [
        { id: 1, name: "Slim Fit" },
        { id: 2, name: "Regular Fit" },
      ],
      gender: ["male", "female"],
      styles: ["casual", "streetwear" , "oversize"],
      season: [
      "automn" , "winter"
      ],
      madeCountry: { code: "IT", name: "Italy" },
  } , 

  variants:  [
    {
      id: "v1",
       productId : '' ,
      price : 100 , 
      stockQuantity: 100,
      options:{
        color: { name: "Red", hex: "#FF0000" } as Color,
        sizes: [{id : 1 ,  name : "S"}, {id : 2 , name : "M"}, {id : 3 , name : "L"}],
        covers: [
          {id:"1" , path: "/images/perpel.jpg" },
          {id : "2" ,  path: "https://via.placeholder.com/150/FF0000?text=Red+Jacket" },
        ],
      }
    },
    {
      id: "v2",
      productId : '' ,
      price : 100 , 
      stockQuantity: 100,
      options:{
         color: { name: "Blue", hex: "#0000FF" } as Color,
         sizes: [{id : 1 ,  name : "S"}, {id : 2 , name : "M"}, {id : 3 , name : "L"}],
         covers: [
          {id:"1" ,  path: "https://via.placeholder.com/150/000000?text=Black+Jacket" },
          {id:"2" ,  path: "https://via.placeholder.com/150/000000?text=Black+Side" },
        ],
      }
    },
    
  ],
};
   
 const category = product?.category ?? "fashion" ; 

    
  const getInitialData = (category: CategoryCode, mode: ModeForm, product?: ProductDataGlobal) => {
      if (mode === "create") return getEmptyInitialProductData(category);
      if (mode === "edit" && product) return getEditedData(product, category);
      throw new Error("Invalid state");
      };
      
      const modeForm : ModeForm = productSource ? "edit" : "create" ; 

     const initialData = getInitialData(category, modeForm, productSource) ;

    const [productData ,   setProductData] = useState<ProductDataGlobal | undefined>(() => productSource)
    const [basicInfoForm , setBasicInfoForm] = useState<ProductDataGlobal>(() => initialData);

    // const inventoryOptions : FashionOptions  = inventoryOptions ;  
    const [nicheCategory, setNicheCategory] = useState<CategoryCode>(category);

    const [options, setOptions] = useState(backendOptions);

    const [variantToDelete ,  setVariantToDelete] = useState<number | null>()
    

    

     
    
   



    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        variantToDelete ,  setVariantToDelete , 
        productData ,   setProductData , 
        basicInfoForm , setBasicInfoForm , 
        nicheCategory, setNicheCategory ,
        options
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 