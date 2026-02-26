import { Category , Cover , Video } from "../inventoryTypes";
import { Variant } from "./productVariantType";


export interface ProductBase { 
  category_niche_id?: number;
  id?: string | null;
  name: string;
  brand: string;
  sub_categories: Category[];
  description: string;
  rating_average?: number;
  tags: string[] ;
  stock : number | null ;
  compare_price?: number | null;
  price: number | null;
  isFeatured?: boolean;
  isFreeShipping : boolean ;
  releaseDate?: string;
  madeCountry : string
  thumbnail:  Cover | null ;
  video: Video[] ,
  covers : Cover[] , 
  inventory: InventoryAttributes | null;
  shipping: ShippingAttributes | null;
  meta: MetaAttributes | null;
  vendor: VendorAttributes | null;
  faqs: { question: string; answer: string }[];
  // 
  variants: Variant[];
  product_attributes : any[]

  // settings
  badge_text: string | null;
  allow_backorder: boolean;
  show_countdown: boolean;
  show_reviews: boolean;
  show_related_products: boolean;
  show_social_share: boolean;
}

interface DimensionType {
  height?: number 
  width?: number 
  length?: number
}
interface InventoryAttributes {
  quantity?: number;
  sku?: string;
  backorderOptions?: string;
}

interface ShippingAttributes {
  weight?: number;
  dimensions?: DimensionType;
  shippingClass?: string;
}

interface MetaAttributes {
  metaTitle?: string;
  metaDescription?: string;
}

interface VendorAttributes {
  vendorName?: string;
  vendorSku?: string;
  vendorNotes?: string;
}

