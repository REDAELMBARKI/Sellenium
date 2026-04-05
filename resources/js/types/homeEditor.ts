import { Banner } from "./bannerTypes";

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



export type Product = {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
};

export type CollectionSortable = {
  id: number;
  name: string;
  key: string;
  slug: string;
  is_active: boolean;
  layout_config: { displayLimit: number; gap: number; paddingInline: number };
  card_config: {
    aspectRatio: string;
    borderRadius: number;
    showPrice: boolean;
    showBadge: boolean;
    textAlign: 'left' | 'center';
    hoverEffect: 'none' | 'zoom';
  };
  products: Product[];
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
