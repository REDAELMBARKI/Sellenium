import { Category , Cover , Video } from "../inventoryTypes";
import { Variant } from "./productVariantType";


export interface ProductBase { 
  category_niche_id?: number;
  id?: string | null;
  name: string;
  brand: string;
  //single product specific nnullable 
  stock : number | null ;
  sku : string |null,
  compare_price?: number | null;
  price: number | null;
  //single product specific nnullable  end

  sub_categories: Category[];
  description: string;
  rating_average?: number;
  tags: string[] ;
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
  related_products : number[] ,
  // settings
  badge_text: string | null;
  allow_backorder: boolean;
  show_countdown: boolean;
  show_reviews: boolean;
  show_related_products: boolean;
  show_social_share: boolean;
  promotion_ids: number[],
  coupon_ids: number[],
}

interface DimensionType {
  height?: number 
  width?: number 
  length?: number
}
interface InventoryAttributes {
  backorderOptions?: string;
  trackInventory?: boolean;
  lowStockThreshold?: number | null;
  stockStatus?: string;
  weight?: number | null;
  weightUnit?: string;
  dimensions?: { length?: number | null; width?: number | null; height?: number | null; unit?: string };
  warehouseLocation?: string;
  fulfillmentType?: string;
}

interface ShippingAttributes {
  shippingClass: 'standard' | 'express' | 'pickup'  // delivery speed
  handlingTime: number                               // days to prepare
  shippingCostOverride: number | null                // override global shipping price for this product
  isReturnable: boolean                             
  returnWindow: number                               // e.g. 7 / 14 / 30 days
  returnPolicy: 'free_return' | 'customer_pays'     

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

