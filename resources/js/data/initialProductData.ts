import { Category, Color, Country, Cover, Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";
import { ImagePreviewItem } from "@/types/mediaTypes";
import { ProductBase } from "@/types/products/baseProductTypes";
import { CategoryCode } from "@/types/products/categories";
import { ProductDataGlobal } from "@/types/productsTypes";
import { Tag } from "@/types/tagsTypes";
import { video } from "framer-motion/client";
import { CATEGORY_CONFIG } from "./categoryConfigurations";
import { ProductVariant } from "@/types/products/productVariantType";


export const getEmptyInitialProductData = (category : Category) => { // for create new product
   // Base attributes shared by all niches
const baseProductData : ProductBase = {
  category , 
  id: undefined,
  name: "",
  brand: "", 
  subCategory: [] as Category[],
  description: "",
  rating_average: undefined,
  price : 0, 
  oldPrice : 0 , 
  madeCountry :  '' , 
  thumbnail: null as Cover  | null,
  video: null as Cover |null,
  tags: [] as string[],
  covers: [] as Cover[],
  isFreeShipping : false ,
  isFeatured: false,
};
 
  const variants = []  as ProductVariant[]
 
 const productAttributesDefaults = CATEGORY_CONFIG[category.name as CategoryCode].attributes ?? null
 return {
     ...baseProductData , 
     variants , 
     attributes: { ...productAttributesDefaults }
 }
        
}


export const getEditedData = (
  product: ProductDataGlobal,
  category: Category
) => {
  const baseData : ProductBase = {
    id: product.id ?? undefined,
    name: product.name ?? "",
    brand: product.brand ?? "",
    subCategory: product.subCategory   ?? [],
    description: product.description ?? "",
    price : product.price ?? 0 , 
    oldPrice : product.price ?? 0 , 
    madeCountry : product.madeCountry ?? '' , 
    thumbnail: product.thumbnail ?? null,
    video: product.video ?? null,
    covers: product.covers ?? [],
    tags: product.tags ?? [],
    isFreeShipping : product.isFreeShipping , 
    isFeatured: product.isFeatured ?? false,
    category : product.category,
  };

  const variants = product.variants ?? [] as ProductVariant[]

  const productAttributesDefaults = CATEGORY_CONFIG[category.name as CategoryCode]?.attributes ?? null;

  return {
    ...baseData,
    ...product,          // overides the fields 
    variants ,
    attributes: { ...productAttributesDefaults }, // provide coorect  fields for each category
  };
};
