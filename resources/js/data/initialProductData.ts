import { Color, Country, Cover, Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";
import { ImagePreviewItem } from "@/types/mediaTypes";
import { ProductBase } from "@/types/products/baseProductTypes";
import { CategoryCode } from "@/types/products/categories";
import { ProductDataGlobal } from "@/types/productsTypes";
import { Tag } from "@/types/tagsTypes";
import { video } from "framer-motion/client";
import { CATEGORY_CONFIG } from "./categoryConfigurations";


export const getEmptyInitialProductData = (category : CategoryCode) => { // for create new product
   // Base attributes shared by all niches
const baseProductData : ProductBase = {
  category , 
  id: undefined,
  name: "",
  brand: "", 
  subCategory: [] as { id: string; name: string }[],
  description: "",
  rating_average: undefined,
  price : 0, 
  oldPrice : 0 , 
  thumbnail: null as Cover | ImagePreviewItem | null,
  video: null as Cover | ImagePreviewItem | null,
  tags: [] as Tag[],
  covers: [] as (Cover | ImagePreviewItem)[],
  isFreeShipping : false ,
  isFeatured: false,
};
 
 
 const productAttributesDefault = CATEGORY_CONFIG[category].attributes ?? null
 return {
     ...baseProductData , 
     ...productAttributesDefault
 }
        
}


export const getEditedData = (
  product: ProductDataGlobal,
  category: CategoryCode
) => {
  const baseData : ProductBase = {
    id: product.id ?? "",
    name: product.name ?? "",
    brand: product.brand ?? "",
    subCategory: product.subCategory   ?? [],
    description: product.description ?? "",
    price : product.price ?? 0 , 
    oldPrice : product.price ?? 0 , 
    thumbnail: product.thumbnail ?? null,
    video: product.video ?? null,
    covers: product.covers ?? [],
    tags: product.tags ?? [],
    isFreeShipping : product.isFreeShipping , 
    isFeatured: product.isFeatured ?? false,
    category,
  };

  const productAttributesDefaults = CATEGORY_CONFIG[category]?.attributes ?? null;

  return {
    ...baseData,
    ...productAttributesDefaults, // provide coorect  fields for each category
    ...product,          // overides the fields 
  };
};
