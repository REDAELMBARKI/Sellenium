
import { useRef, useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/sharedProductContext/ProductDataContext';
import {  Category, Cover } from '@/types/inventoryTypes';
import { getEditedData, getEmptyInitialProductData } from '@/data/initialProductData';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { FashionProduct, ProductBackendProps, ProductDataGlobal } from '@/types/productsTypes';








const ProductDataProvider = ({children , product , options : backendOptions }:ProductBackendProps) => {

  // const productSource : FashionProduct  = {
  // category: {id:"3" , name : "fashion"},
  // id: "fash123",
  // name: "Urban Street Jacket",
  // brand: "TrendCo",
  // subCategory: [{id:"1" , name:"Outerwear"}, {id:"2" , name: "Jackets"}, {id:"3" , name: "Streetwear"}],
  // description: "A versatile street jacket made from premium materials, perfect for urban adventures.",
  // rating_average: 4.5,
  // price : 12 , 
  // oldPrice : 15 , 
  // thumbnail: {path:"/images/red.jpg" , id:"23"},
  // video:{path: "/videos/illusion.mp4" , id:"32"},
  // covers: [
  //   {id : "1" ,  path: "/images/red.jpg" },
  //   {id : "2" ,  path: "/images/perpel.jpg" }
  // ],
  // tags: [
  //  "New Arrival"  , "Bestseller"
  // ],
  // isFeatured: true,
  // releaseDate: "2025-10-01",
  // isFreeShipping : true , 
  // madeCountry: "italy",
  

  // inventory : {
  // quantity: 20,
  // sku: "SKU-123"
  // } , 
   
  // shipping : {
  //   weight: 1.5,
  //   dimensions: {
  //     height: 10,
  //     width: 20,
  //     length: 30
  //   },
  //   shippingClass : 'express'
  // } ,
  // meta: {
  //   metaTitle: "meta title" , 
  //   metaDescription: "meta description"
  // } ,
  // vendor: {
  //   vendorName: "vendor Name" , 
  //   vendorSku: "vendor sku" , 
  //   vendorNotes: "vendor notes",
  // } ,

  // attributes : {
  //     materials: [
  //       { id: "1", name: "Cotton" },
  //       { id: "2", name: "Polyester" },
  //     ],
  //     fits: [
  //       { id: "1", name: "Slim Fit" },
  //       { id: "2", name: "Regular Fit" },
  //     ],
  //    gender: [
  //       { id: "1", name: "male" },
  //       { id: "2", name: "female" },
  //     ],
  //     styles: [
  //       { id: "1", name: "casual" },
  //       { id: "2", name: "streetwear" },
  //       { id: "3", name: "oversize" },
  //     ],
  //     season: [
  //       { id: "1", name: "autumn" },
  //       { id: "2", name: "winter" },
  //     ],
  // } , 

  // variants:  [
  //   {
  //     id: "v1",
  //     category : 'fashion' ,
  //     price : 100 , 
  //     stockQuantity: 100,
  //     option:{
  //       color: { name: "Red", hex: "#FF0000" } as Color,
  //       size: {id : 1 ,  name : "S"},
  //       covers: [
  //         {id:"1" , path: "/images/perpel.jpg" },
  //         {id : "2" ,  path: "https://via.placeholder.com/150/FF0000?text=Red+Jacket" },
  //       ],
       
  //     } , 
      
  //   },
  //   {
  //     id: "v2",
  //     category : 'fashion' ,
  //     price : 100 , 
  //     stockQuantity: 100,
  //     option:{
  //        color: { name: "Blue", hex: "#0000FF" } as Color,
  //        size: {id : 2 , name : "M"},
  //        covers: [
  //         {id:"1" ,  path: "https://via.placeholder.com/150/000000?text=Black+Jacket" },
  //         {id:"2" ,  path: "https://via.placeholder.com/150/000000?text=Black+Side" },
  //       ],
  //     } , 
     
  //   },
    
  // ],
  // };
   
  const productSource = undefined 


  const {state : {currentCategory : category} } = useStoreConfigCtx() 

    
  const getInitialData = (category: Category, mode: ModeForm, product?: ProductDataGlobal) => {
      if (mode === "create") return getEmptyInitialProductData(category);
      if (mode === "edit" && product) return getEditedData(product, category);
      throw new Error("Invalid state");
      };
      
      const modeForm : ModeForm = productSource ? "edit" : "create" ; 

     const initialData = getInitialData(category, modeForm, productSource) ;

    const [productData ,   setProductData] = useState<ProductDataGlobal | undefined>(() => productSource)
    const [basicInfoForm , setBasicInfoForm] = useState<ProductDataGlobal>(() => initialData);
    
    const draftId = useRef<string | undefined>(basicInfoForm.id ?? undefined);
    
    const [options] = useState(backendOptions);

    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        productData ,   setProductData , 
        basicInfoForm , setBasicInfoForm , 
        options , 
        draftId
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 