import { Banner } from "./bannerTypes";
import { ProductSchemaType } from '@/shemas/productSchema';
import { Category, Cover } from "./inventoryTypes";

export type MediaObject = {
  id: number;
  url: string;
  alt?: string;
};

export type BannerSlotElements = {
  eyebrow?:   { text: string; color: string; visible: boolean };
  title?:     { text: string; color: string; visible: boolean };
  paragraph?: { text: string; color: string; visible: boolean };
  button?:    { text: string; bg_color: string; text_color: string; visible: boolean };
};

export type BannerSlot = {
  slot_key: 'left' | 'middle' | 'right';
  width: string;
  is_visible: boolean;
  bg_color?: string;
  main_media?: MediaObject;
  secondary_media?: MediaObject;
  elements?: BannerSlotElements;
};



export type ProductClient =  Pick<ProductSchemaType  , 'id' | "rating_average" | 'brand' | 'name' | 'compare_price' | 'price'  > & {category : Category , reviews : number , badge : string , thumbnail : Cover }

export type CollectionSortable = {
  id: number;
  name: string;
  icon: string;
  key: string;
  slug: string;
  is_active: boolean;
  layout_config: {titlePosition : "left" | "center" | "right" , CollectionPosition : "left" | "center" | "right" , displayLimit: number; gap: number; paddingInline: number , headerSpacing : number };
  card_config: {
    aspectRatio: string;
    borderRadius: number;
    showPrice: boolean;
    showBadge: boolean;
    textAlign: 'left' | 'center';
    hoverEffect: 'none' | 'zoom';
  };
  products: ProductClient[];
};

export type BannerSection = {
  id: number;
  order: number;
  sortable_type: 'banner';
  sortable: Banner;
};

export type CollectionSection = {
  id: number;
  order: number;
  sortable_type: 'collection';
  sortable: CollectionSortable;
};

export type Section = BannerSection | CollectionSection;
