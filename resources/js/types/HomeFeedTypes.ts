import { ProductClient } from '@/types/clientSideTypes';

// ─────────────────────────────────────────────────────────────────────────────
//  PRODUCT SECTION
// ─────────────────────────────────────────────────────────────────────────────
export interface ProductSection {
  key: string;
  name: string;
  emoji?: string;
  products: ProductClient[];
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROMO BANNER  — full-width image + headline + CTA
// ─────────────────────────────────────────────────────────────────────────────
export interface PromoBannerBlock {
  id: string;
  image: string;
  /** overlay text alignment: content sits left, center, or right over the image */
  align?: 'left' | 'center' | 'right';
  eyebrow?: string;       // small label above title  e.g. "Limited Time"
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
}

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
  | { type: 'product_section'; data: ProductSection      }
  | { type: 'promo_banner';    data: PromoBannerBlock     }
  | { type: 'video_split';     data: VideoSplitBlock      }
  | { type: 'full_video';      data: FullVideoBlock       }
  | { type: 'countdown_deal';  data: CountdownDealBlock   }
  | { type: 'ugc_wall';        data: UGCWallBlock         }
  | { type: 'brand_spotlight'; data: BrandSpotlightBlock  }
  | { type: 'quiz_cta';        data: QuizCTABlock         }
  | { type: 'social_proof';    data: SocialProofBlock     }
  | { type: 'lookbook_grid';   data: LookbookGridBlock    }
  | { type: 'ad_slot';         data: AdSlotBlock          };