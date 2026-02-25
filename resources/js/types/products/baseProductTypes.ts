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
  price: number;
  oldPrice?: number;
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

  // 
  variants: Variant[];
  
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

