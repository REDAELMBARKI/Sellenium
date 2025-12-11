
import { useState } from 'react';
import { ModeForm, ProductDataContext } from '@/context/sharedProductContext/ProductDataContext';
import { FashionProduct, FashionVariant, Gender, PerfumesProduct, ProductBackendProps, ProductBasicInfoData, ProductDataGlobal, ProductVariant } from '@/types/productsTypes';
import { useNicheCtx } from '@/contextHooks/useNicheCtx';
import { Product } from '@/types/dashboardTypes';
import { NicheItem } from '@/context/NicheContext';
import {  Color, NicheOptions } from '@/types/inventoryTypes';
import { EmptyInitialProductDataMap, getEditedData } from '@/data/initialProductData';








const ProductDataProvider = ({children , product , nicheOptions , tagSuggestions : tagSuggestionsSource }:ProductBackendProps) => {
      
  //   const productSource: PerfumesProduct = {
  // niche: "perfumes",
  // id: "1",
  // name: "Oud Mystique",
  // brand: "Maison Elixir",
  // price: "129.99",
  // compareAtPrice: "149.99",
  // costPrice: "65.00",
  // category: ["Luxury Perfume"],
  // video : "/uploads/products/perfumes/oud-mystique-thumb.jpg" , 

  // description: "A warm and captivating unisex fragrance blending oud, amber, and sweet floral notes.",
  // rating_average: 4.7,
  // thumbnail: "/uploads/products/perfumes/oud-mystique-thumb.jpg",
  // tags: [
  //   { id: "3", name: "Oud" , category : "as" },
  //   { id: "7", name: "Luxury" , category : "as" },
  //   { id: "11", name: "Unisex" , category : "as" },
  // ],
  // isFeatured: true,
  // sku: "OU-12345",
  // stockQuantity: 25,
  // releaseDate: "2025-01-10",
  // visible: true,

  // concentration: "EDP",
  // quantity: 25,
  // fragranceFamily: "oriental",
  // gender: ["male", "female"],

  // topNotes: ["Saffron", "Rose", "Bergamot"],
  // middleNotes: ["Oud Wood", "Amber", "Geranium"],
  // baseNotes: ["Vanilla", "Patchouli", "Musk"],

  // covers: [
  //   {id:1 , path : "/uploads/products/perfumes/oud-mystique-1.jpg"},
  //   {id:2 , path :"/uploads/products/perfumes/oud-mystique-2.jpg"},
  // ],
  // longevity: "long-lasting",
  // sillage: "strong",

  // volumes: [
  //   { volume: 50, price: 129.99 },
  //   { volume: 100, price: 179.99 },
  // ],
  // };

  const productSource : FashionProduct  = {
  niche: "fashion",
  id: "fash123",
  name: "Urban Street Jacket",
  brand: "TrendCo",
  price: "129.99",
  compareAtPrice: "159.99",
  costPrice: "80.00",
  category: ["Outerwear", "Jackets", "Streetwear"],
  description: "A versatile street jacket made from premium materials, perfect for urban adventures.",
  rating_average: 4.5,
  thumbnail: "https://via.placeholder.com/150",
  video: "https://www.w3schools.com/html/mov_bbb.mp4",
  covers: [
    {id : 1 ,  path: "https://via.placeholder.com/200x200?text=Cover+1" },
    {id : 2 ,  path: "https://via.placeholder.com/200x200?text=Cover+2" }
  ],
  tags: [
    { id: "t1", name: "New Arrival" },
    { id: "t2", name: "Bestseller" },
  ],
  isFeatured: true,
  sku: "TSHIRT-001",
  stockQuantity: 50,
  releaseDate: "2025-10-01",

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

  variants:  [
    {
      id: "v1",
      niche: "fashion",
      quantity: 100,
      attributes:{
        color: { name: "Red", hex: "#FF0000" } as Color,
        sizes: [{id : 1 ,  name : "S"}, {id : 2 , name : "M"}, {id : 3 , name : "L"}],
        covers: [
          {id:1 , path: "/images/perpel.jpg" },
          {id : 2 ,  path: "https://via.placeholder.com/150/FF0000?text=Red+Jacket" },
        ],
      }
    },
    {
      id: "v2",
      niche: "fashion",
      quantity: 100,
      attributes:{
         color: { name: "Blue", hex: "#0000FF" } as Color,
        sizes: [{id : 1 ,  name : "S"}, {id : 2 , name : "M"}, {id : 3 , name : "L"}],
        covers: [
          {id:1 ,  path: "https://via.placeholder.com/150/000000?text=Black+Jacket" },
          {id:2 ,  path: "https://via.placeholder.com/150/000000?text=Black+Side" },
        ],
      }
    },
    
  ],
};

    const {currentNiche} = useNicheCtx()
   
    
  const getInitialData = (niche: NicheItem, mode: ModeForm, product?: ProductDataGlobal) => {
      if (mode === "create") return EmptyInitialProductDataMap[niche];
      if (mode === "edit" && product) return getEditedData(product, niche);
      throw new Error("Invalid state");
      };
      const modeForm : ModeForm = productSource ? "edit" : "create" ; 

     const initialData = getInitialData(currentNiche, modeForm, productSource) as ProductDataGlobal;

    const [productData ,   setProductData] = useState<ProductDataGlobal | undefined>(() => productSource)
    const [basicInfoForm , setBasicInfoForm] = useState<ProductDataGlobal>(() => initialData);

    // const inventoryOptions : FashionOptions  = inventoryOptions ;  
    const [nicheOptionsState, setNicheOptionsState] = useState<NicheOptions>(nicheOptions);

    console.log('nicheOptionsState in ProductDataProvider', product);
    const [tagSuggestionsState, setTagSuggestionsState] = useState(tagSuggestionsSource);

    const [variantForm ,  setVariantForm] = useState<ProductVariant | null>(); 
    const [variantToDelete ,  setVariantToDelete] = useState<number | null>()
    

    

     
    
   



    return (
    <ProductDataContext.Provider value={{
        modeForm , 
        variantToDelete ,  setVariantToDelete , 
        variantForm ,  setVariantForm , 
        productData ,   setProductData , 
        basicInfoForm , setBasicInfoForm , 
        nicheOptionsState, setNicheOptionsState ,
        tagSuggestionsState, setTagSuggestionsState
    }}>
        {children}
    </ProductDataContext.Provider>
    )
}


export default ProductDataProvider ; 