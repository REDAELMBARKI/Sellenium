import { Category, CategoryCode, Color, Country, Cover, Fit, Gender, Material, Season, Style } from "@/types/inventoryTypes";
import { ProductBase } from "@/types/products/baseProductTypes";
import { Tag } from "@/types/tagsTypes";
import { video } from "framer-motion/client";


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
  price : null, 
  compare_price : null , 
  stock : null ,
  madeCountry :  '' , 
  releaseDate : '' ,
  thumbnail: null as Cover  | null,
  video: [],
  tags: [] as string[],
  covers: [] as Cover[],
  isFreeShipping : false ,
  isFeatured: false,
  inventory: null,
  shipping: null,
  meta: null,
  vendor: null,
  variants : [] , 
  product_attributes : [] ,
  faqs : [] ,
  badge_text : '' ,
  show_countdown : true ,
  show_related_products : true ,
  show_reviews : true ,
  show_social_share : true ,
  allow_backorder : false ,
  };
 
  return baseProductData ; 
}


export const getEditedData = (
  product: ProductBase,
  category?: Category
) => {
  const baseData : ProductBase = {
    id: product.id ?? undefined,
    name: product.name ?? "",
    brand: product.brand ?? "",
    sub_categories: product.sub_categories   ?? [],
    description: product.description ?? "",
    price : product.price ?? null , 
    compare_price : product.price ?? null ,
    stock : product.stock ?? null , 
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
    variants : product.variants ?? [] , 
    product_attributes : product.product_attributes ?? [] ,
    faqs : product.faqs ?? [] ,
    badge_text : product.badge_text ?? '' ,
    show_countdown : product.show_countdown ?? true ,
    show_related_products : product.show_related_products ?? true ,
    show_reviews : product.show_reviews ?? true,
    show_social_share : product.show_social_share ?? true ,
    allow_backorder : product.allow_backorder ?? false,
  };
  return baseData ;
};
