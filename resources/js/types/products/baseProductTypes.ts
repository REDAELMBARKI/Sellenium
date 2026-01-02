import { Cover } from "../inventoryTypes";
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
  tags: Tag[];
  price: number;
  oldPrice?: number;
  isFeatured?: boolean;
  isFreeShipping : boolean ;
  releaseDate?: string;
  thumbnail: Cover | ImagePreviewItem  | null ;
  video : Cover | ImagePreviewItem | null ;
  covers : (Cover | ImagePreviewItem)[] , 


  inventory?: InventoryAttributes;
  shipping?: ShippingAttributes;
  meta?: MetaAttributes;
  vendor?: VendorAttributes;
}


interface InventoryAttributes {
  quantity?: string;
  sku?: string;
  backorderOptions?: string;
}

interface ShippingAttributes {
  weight?: string;
  dimensions?: string;
  shippingClass?: string;
}

interface MetaAttributes {
  metaTitle?: string;
  metaDescription?: string;
  tags?: string;
}

interface VendorAttributes {
  vendorName?: string;
  vendorSku?: string;
  vendorNotes?: string;
}

