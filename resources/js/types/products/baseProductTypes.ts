import { Country, Cover } from "../inventoryTypes";
import { ImagePreviewItem } from "../mediaTypes";
import { Tag } from "../tagsTypes";
import { CategoryCode } from "./categories";

export interface ProductBase { 
  category: CategoryCode;
  id?: string | null;
  name: string;
  brand: string;
  subCategory: {id: string , name : string}[];
  description: string;
  rating_average?: number;
  tags: (Tag | string)[] ;
  price: number;
  oldPrice?: number;
  isFeatured?: boolean;
  isFreeShipping : boolean ;
  releaseDate?: string;
  madeCountry : string
  thumbnail: Cover | ImagePreviewItem  | null ;
  video : Cover | ImagePreviewItem | null ;
  covers : (Cover | ImagePreviewItem)[] , 


  inventory?: InventoryAttributes;
  shipping?: ShippingAttributes;
  meta?: MetaAttributes;
  vendor?: VendorAttributes;
}

interface DimensionType {
  height : string 
  width : string 
  length : string
}
interface InventoryAttributes {
  quantity?: string;
  sku?: string;
  backorderOptions?: string;
}

interface ShippingAttributes {
  weight?: string;
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

