export interface BannerMedia {
  id: number;
  url: string;
  media_type: string;
  collection: string;
}

export interface Banner {
  id: number;
  key: string;
  slug: string;
  order: number;
  direction: 'ltr' | 'rtl';
  name: string;
  subname: string;
  is_active: boolean;
  main_media_id: number | null;
  secondary_media_id: number | null;
  mainMedia: BannerMedia | null;
  secondaryMedia: BannerMedia | null;
}