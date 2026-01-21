import { Category, CategoryCode, Color, Country, Cover, Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";
import { ProductBase } from "@/types/products/baseProductTypes";
import { ProductDataGlobal } from "@/types/productsTypes";
import { Tag } from "@/types/tagsTypes";
import { video } from "framer-motion/client";
import { CATEGORY_CONFIG } from "./categoryConfigurations";
import { ProductVariant } from "@/types/products/productVariantType";


export const getEmptyInitialProductData = (category? : Category) => { // for create new product
   // Base attributes shared by all niches
const baseProductData : ProductBase = {
  category_niche_id : undefined, 
  id: undefined,
  name: "",
  brand: "", 
  sub_categories: [] as Category[],
  description: "",
  rating_average: undefined,
  price : 0, 
  oldPrice : 0 , 
  madeCountry :  '' , 
  releaseDate : '' ,
  thumbnail: null as Cover  | null,
  video: {id : null  , url : null , iframe : null , primary : null},
  tags: [] as string[],
  covers: [] as Cover[],
  isFreeShipping : false ,
  isFeatured: false,
  inventory: null,
  shipping: null,
  meta: null,
  vendor: null,

};
 
  const variants = []  as ProductVariant[]
 
  const productAttributesDefaults = category ?  CATEGORY_CONFIG[category.name as CategoryCode].attributes ?? null : {}
  
  return {
     ...baseProductData , 
     variants , 
     attributes: { ...productAttributesDefaults }
  }
        
}


export const getEditedData = (
  product: ProductDataGlobal,
  category?: Category
) => {
  const baseData : ProductBase = {
    id: product.id ?? undefined,
    name: product.name ?? "",
    brand: product.brand ?? "",
    sub_categories: product.sub_categories   ?? [],
    description: product.description ?? "",
    price : product.price ?? 0 , 
    oldPrice : product.price ?? 0 , 
    madeCountry : product.madeCountry ?? '' , 
    releaseDate : product.releaseDate ,
    thumbnail: product.thumbnail ?? null,
    video: product.video ?? {id : null  , url : null , iframe : null , primary : null},
    covers: product.covers ?? [],
    tags: product.tags ?? [],
    isFreeShipping : product.isFreeShipping , 
    isFeatured: product.isFeatured ?? false,
    category_niche_id : product.category_niche_id,
    inventory: product.inventory,
    shipping: product.shipping,
    meta: product.meta,
    vendor: product.vendor,
  };

  const variants = product.variants ?? [] as ProductVariant[]

  const productAttributesDefaults = category ? CATEGORY_CONFIG[category.name as CategoryCode]?.attributes ?? null : {};

  return {
    ...baseData,
    ...product,          // overides the fields 
    variants ,
    attributes: { ...productAttributesDefaults }, // provide coorect  fields for each category
  };
};
