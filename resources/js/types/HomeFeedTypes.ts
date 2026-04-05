import { Banner } from './bannerTypes';
import { CollectionSection, CollectionSortable, ProductClient } from './homeEditorType';

// ─────────────────────────────────────────────────────────────────────────────
//  PROMO BANNER  — full-width image + headline + CTA
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
//  VIDEO SPLIT  — video one side, text the other
// ─────────────────────────────────────────────────────────────────────────────
export interface VideoSplitBlock {
  id: string;
  videoUrl: string;       // YouTube embed URL or direct .mp4
  videoSide?: 'left' | 'right';
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}

// ─────────────────────────────────────────────────────────────────────────────
//  FULL VIDEO  — cinematic autoplay background, text overlay
// ─────────────────────────────────────────────────────────────────────────────
export interface FullVideoBlock {
  id: string;
  videoUrl: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}

// ─────────────────────────────────────────────────────────────────────────────
//  COUNTDOWN DEAL  — timer + featured product
// ─────────────────────────────────────────────────────────────────────────────
export interface CountdownDealBlock {
  id: string;
  endsAt: string;         // ISO date string  e.g. "2026-04-01T00:00:00Z"
  eyebrow?: string;       // e.g. "Flash Sale"
  title: string;
  product: ProductClient;
}

// ─────────────────────────────────────────────────────────────────────────────
//  UGC WALL  — customer photo grid
// ─────────────────────────────────────────────────────────────────────────────
export interface UGCPhoto {
  id: string;
  image: string;
  username: string;
  productName?: string;
  href?: string;
}
export interface UGCWallBlock {
  id: string;
  title?: string;
  subtitle?: string;
  photos: UGCPhoto[];
}

// ─────────────────────────────────────────────────────────────────────────────
//  BRAND SPOTLIGHT  — featured brand, big image
// ─────────────────────────────────────────────────────────────────────────────
export interface BrandSpotlightBlock {
  id: string;
  brandName: string;
  logo?: string;
  image: string;
  tagline?: string;
  cta?: { label: string; href: string };
}

// ─────────────────────────────────────────────────────────────────────────────
//  QUIZ CTA  — "find your perfect product" interactive prompt
// ─────────────────────────────────────────────────────────────────────────────
export interface QuizCTABlock {
  id: string;
  title: string;
  subtitle?: string;
  cta: { label: string; href: string };
  image?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SOCIAL PROOF STRIP  — stats + quote
// ─────────────────────────────────────────────────────────────────────────────
export interface SocialProofBlock {
  id: string;
  stats: { value: string; label: string }[];  // e.g. [{ value: "50k+", label: "Happy Customers" }]
  quote?: { text: string; author: string };
}

// ─────────────────────────────────────────────────────────────────────────────
//  LOOKBOOK GRID  — editorial lifestyle photo grid
// ─────────────────────────────────────────────────────────────────────────────
export interface LookbookItem {
  id: string;
  image: string;
  label?: string;
  href?: string;
}
export interface LookbookGridBlock {
  id: string;
  title?: string;
  items: LookbookItem[];  // 3–6 items
}

// ─────────────────────────────────────────────────────────────────────────────
//  AD SLOT  — third-party or internal campaign
// ─────────────────────────────────────────────────────────────────────────────
export interface AdSlotBlock {
  id: string;
  image: string;
  href: string;
  alt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  FEED ITEM  — the discriminated union the backend returns
// ─────────────────────────────────────────────────────────────────────────────
export type FeedItem =
  | {id : number , order : number  ,  sortable_type: 'collection'; sortable: CollectionSortable      }
  | {id : number , order : number  ,  sortable_type: 'banner';    sortable: Banner     }
  | {id : number , order : number  ,  sortable_type: 'video_split';     sortable: VideoSplitBlock      }
  | {id : number , order : number  ,  sortable_type: 'full_video';      sortable: FullVideoBlock       }
  | {id : number , order : number  ,  sortable_type: 'countdown_deal';  sortable: CountdownDealBlock   }
  | {id : number , order : number  ,  sortable_type: 'ugc_wall';        sortable: UGCWallBlock         }
  | {id : number , order : number  ,  sortable_type: 'brand_spotlight'; sortable: BrandSpotlightBlock  }
  | {id : number , order : number  ,  sortable_type: 'quiz_cta';        sortable: QuizCTABlock         }
  | {id : number , order : number  ,  sortable_type: 'social_proof';    sortable: SocialProofBlock     }
  | {id : number , order : number  ,  sortable_type: 'lookbook_grid';   sortable: LookbookGridBlock    }
  | {id : number , order : number  ,  sortable_type: 'ad_slot';         sortable: AdSlotBlock          };