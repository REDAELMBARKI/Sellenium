import React from 'react';
import Layout from '../../Layouts/Layout';
import HeroSlider from './Partials/HeroSlider';
import PromoBanners from './Partials/PromoBanners';
import FeatureStrip from './Partials/FeatureStrip';
import NewsletterSection from './Partials/NewsletterSection';
import PromoStrip from './Partials/PromoStrip';
import CategoryBanners from './Partials/CategoryBanners';
import CollectionRenderer from '../admin/pages/store/RuleBasedCollections/Partials/CollectionRenderer';

import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import BannerRenderer from '../admin/pages/store/Banner/Partials/BannerRenderer';
import { AdSlotBlock, BrandSpotlightBlock, CountdownDealBlock, FeedItem, LookbookGridBlock, QuizCTABlock, SocialProofBlock, UGCWallBlock, VideoSplitBlock } from '@/types/HomeFeedTypes';
import { ProductClient } from '@/types/homeEditorType';


// ─────────────────────────────────────────────────────────────────────────────
//  FAKE FEED  — swap with real API response from backend
//  Backend returns FeedItem[] — ordered, sortable_typed, ready to render
const FAKE_PRODUCTS: Record<string, ProductClient> = {
  galaxyS25:       { id: 1,  name: 'Samsung Galaxy S25',     brand: 'Samsung',      price: 799,   compare_price: 999,  thumbnail: { id: 1,  url: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400',            alt: 'Samsung Galaxy S25'     }, category: { id: 1, name: 'Electronics' }, rating_average: 4.7, reviews: 312, badge: 'new' },
  iphone16pro:     { id: 2,  name: 'iPhone 16 Pro',           brand: 'Apple',        price: 1099,  compare_price: 1199, thumbnail: { id: 2,  url: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',           alt: 'iPhone 16 Pro'          }, category: { id: 1, name: 'Electronics' }, rating_average: 4.9, reviews: 540, badge: 'new' },
  macbookM3:       { id: 3,  name: 'MacBook Air M3',          brand: 'Apple',        price: 1099,  compare_price: 1299, thumbnail: { id: 3,  url: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=400',           alt: 'MacBook Air M3'         }, category: { id: 1, name: 'Electronics' }, rating_average: 4.9, reviews: 410, badge: 'new' },
  pointelleTop:    { id: 4,  name: 'Pointelle Knit Top',      brand: 'Mango',        price: 29.99, compare_price: 49,   thumbnail: { id: 4,  url: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Pointelle Knit Top'     }, category: { id: 2, name: 'Fashion' },     rating_average: 4.6, reviews: 33,  badge: 'new' },
  floralDress:     { id: 5,  name: 'Floral Midi Dress',       brand: 'ASOS',         price: 39.99, compare_price: 65,   thumbnail: { id: 5,  url: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Floral Midi Dress'      }, category: { id: 2, name: 'Fashion' },     rating_average: 4.7, reviews: 44,  badge: 'new' },
  vitaminC:        { id: 6,  name: 'Vitamin C Serum',         brand: 'The Ordinary', price: 12.99, compare_price: 18,   thumbnail: { id: 6,  url: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Vitamin C Serum'        }, category: { id: 3, name: 'Beauty' },      rating_average: 4.8, reviews: 502, badge: 'new' },
  dellXPS:         { id: 7,  name: 'Dell XPS 15',             brand: 'Dell',         price: 1399,  compare_price: 1799, thumbnail: { id: 7,  url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',                    alt: 'Dell XPS 15'            }, category: { id: 1, name: 'Electronics' }, rating_average: 4.7, reviews: 205, badge: 'new' },
  leatherTote:     { id: 8,  name: 'Leather Tote Bag',        brand: 'Coach',        price: 199,   compare_price: 320,  thumbnail: { id: 8,  url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Leather Tote Bag'       }, category: { id: 4, name: 'Accessories' }, rating_average: 4.8, reviews: 95,  badge: 'sale' },
  cottonShirt:     { id: 9,  name: 'Stretch Cotton Shirt',    brand: 'COS',          price: 52.66, compare_price: 111,  thumbnail: { id: 9,  url: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Stretch Cotton Shirt'   }, category: { id: 2, name: 'Fashion' },     rating_average: 4.4, reviews: 11,  badge: 'new' },
  oneplus13:       { id: 10, name: 'OnePlus 13',              brand: 'OnePlus',      price: 549,   compare_price: 699,  thumbnail: { id: 10, url: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'OnePlus 13'             }, category: { id: 1, name: 'Electronics' }, rating_average: 4.6, reviews: 120, badge: 'hot' },
  satinDress:      { id: 11, name: 'Satin Wrap Dress',        brand: 'Reformation',  price: 89,    compare_price: 130,  thumbnail: { id: 11, url: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Satin Wrap Dress'       }, category: { id: 2, name: 'Fashion' },     rating_average: 4.8, reviews: 67,  badge: 'hot' },
  retinol:         { id: 12, name: 'Retinol Night Cream',     brand: 'RoC',          price: 24.5,  compare_price: 35,   thumbnail: { id: 12, url: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Retinol Night Cream'    }, category: { id: 3, name: 'Beauty' },      rating_average: 4.6, reviews: 189, badge: 'new' },
  pixel9:          { id: 13, name: 'Google Pixel 9',          brand: 'Google',       price: 649,   compare_price: 799,  thumbnail: { id: 13, url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Google Pixel 9'         }, category: { id: 1, name: 'Electronics' }, rating_average: 4.5, reviews: 198, badge: 'new' },
  xiaomi15:        { id: 14, name: 'Xiaomi 15 Ultra',         brand: 'Xiaomi',       price: 499,   compare_price: 699,  thumbnail: { id: 14, url: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',           alt: 'Xiaomi 15 Ultra'        }, category: { id: 1, name: 'Electronics' }, rating_average: 4.4, reviews: 87,  badge: 'new' },
  thinkpad:        { id: 15, name: 'Lenovo ThinkPad X1',      brand: 'Lenovo',       price: 999,   compare_price: 1299, thumbnail: { id: 15, url: 'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=400',           alt: 'Lenovo ThinkPad X1'     }, category: { id: 1, name: 'Electronics' }, rating_average: 4.6, reviews: 178, badge: 'new' },
  rogZephyrus:     { id: 16, name: 'ASUS ROG Zephyrus',       brand: 'ASUS',         price: 1599,  compare_price: 1999, thumbnail: { id: 16, url: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'ASUS ROG Zephyrus'      }, category: { id: 1, name: 'Electronics' }, rating_average: 4.8, reviews: 290, badge: 'hot' },
  ruffleShirt:     { id: 17, name: 'Esprit Ruffle Shirt',     brand: 'Esprit',       price: 16.64, compare_price: 23,   thumbnail: { id: 17, url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',           alt: 'Esprit Ruffle Shirt'    }, category: { id: 2, name: 'Fashion' },     rating_average: 4.5, reviews: 12,  badge: 'new' },
  printedBlouse:   { id: 18, name: 'Metallic Printed Blouse', brand: 'Zara',         price: 34.75, compare_price: 55,   thumbnail: { id: 18, url: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Metallic Printed Blouse'}, category: { id: 2, name: 'Fashion' },     rating_average: 4.3, reviews: 9,   badge: 'new' },
  linenBlazer:     { id: 19, name: 'Linen Cropped Blazer',    brand: 'H&M',          price: 44.5,  compare_price: 69,   thumbnail: { id: 19, url: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Linen Cropped Blazer'   }, category: { id: 2, name: 'Fashion' },     rating_average: 4.5, reviews: 21,  badge: 'new' },
  lipstickSet:     { id: 22, name: 'Matte Lipstick Set',      brand: 'MAC',          price: 18,    compare_price: 22,   thumbnail: { id: 22, url: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Matte Lipstick Set'     }, category: { id: 3, name: 'Beauty' },      rating_average: 4.7, reviews: 340, badge: 'new' },
  fentyFoundation: { id: 23, name: 'Foundation SPF 30',       brand: 'Fenty Beauty', price: 38,    compare_price: 48,   thumbnail: { id: 23, url: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400',         alt: 'Foundation SPF 30'      }, category: { id: 3, name: 'Beauty' },      rating_average: 4.9, reviews: 780, badge: 'hot' },
};

const FAKE_FEED: FeedItem[] = [
  // ── 1. Collection ──────────────────────────────────────────────────────────
  {
    id : 1 ,
    sortable_type: 'collection',
    order: 1,
    sortable: {
      id: 1,
      name: 'New Arrivals',
      slug: 'new-arrivals',
      key: 'collections.new_arrivals',
      is_active: true,
      layout_config: { displayLimit: 6, gap: 0, paddingInline: 0 },
      card_config: { aspectRatio: '3/4', borderRadius: 0, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
      rules: [{ field: 'badge', operator: '=', value: 'new' }],
      products: [
        FAKE_PRODUCTS.galaxyS25,
        FAKE_PRODUCTS.iphone16pro,
        FAKE_PRODUCTS.macbookM3,
        FAKE_PRODUCTS.pointelleTop,
        FAKE_PRODUCTS.floralDress,
        FAKE_PRODUCTS.vitaminC,
      ],
    },
  },

  // ── 2. Banner (Spring Sale) ────────────────────────────────────────────────
  {
    id : 2 ,
    order: 2,
    sortable_type: 'banner',
    sortable: {
      id: 1,
      key: 'spring_sale_2026',
      name: 'Spring Sale',
      slug: 'spring-sale-2026',
      is_active: true,
      direction: 'ltr',
      aspect_ratio: '21:9',
      border_radius: '0px',
      bg_color: '#0d0d0d',
      slots: [
        {
          slot_key: 'left',
          is_visible: true,
          width: '55',
          bg_color: '#0d0d0d',
          elements: {
            eyebrow:   { text: 'Limited Time',                              color: '#d4a853', visible: true },
            title:     { text: 'Spring Sale — Up to 50% Off',              color: '#efefed', visible: true },
            paragraph: { text: 'Fresh styles for the new season. Shop before it ends.', color: '#888885', visible: true },
            button:    { text: 'Shop Now', bg_color: '#d4a853', text_color: '#0d0d0d' , link : '/' , visible: true },
          },
        },
        {
          slot_key: 'middle',
          is_visible: false,
          width: '0',
          bg_color: '#0d0d0d',
        },
        {
          slot_key: 'right',
          is_visible: true,
          width: '45',
          bg_color: '#0d0d0d',
          main_media: { id: 1, url: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1400', media_sortable_type: 'image' },
        },
      ],
    },
  },

  // ── 3. Banner (Collections Discount — inset style, rtl) ───────────────────
  {
    id : 3 ,
    order: 3,
    sortable_type: 'banner',
    sortable: {
      id: 2,
      key: 'collections_discount',
      name: 'Collections Discount',
      slug: 'collections-discount',
      is_active: true,
      direction: 'rtl',
      aspect_ratio: '21:9',
      border_radius: '12px',
      bg_color: '#0a0a10',
      slots: [
        {
          slot_key: 'left',
          is_visible: true,
          width: '50',
          bg_color: '#0a0a10',
          elements: {
            eyebrow:   { text: 'Collections Discount',           color: '#a094cc', visible: true },
            title:     { text: 'Up to 40% off our collections', color: '#efefed', visible: true },
            paragraph: { text: '',                               color: '#888885', visible: false },
            button:    { text: 'Shop Now', bg_color: '#a094cc', link : '/' , text_color: '#0a0a10', visible: true },
          },
        },
        {
          slot_key: 'middle',
          is_visible: false,
          width: '0',
          bg_color: '#0a0a10',
        },
        {
          slot_key: 'right',
          is_visible: true,
          width: '50',
          bg_color: '#0a0a10',
          main_media: { id: 2, url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1400', media_sortable_type: 'image' },
        },
      ],
    },
  },

  // ── 4. Collection (Best Deals) ────────────────────────────────────────────
  {
    id : 4 ,
    
    order: 4,
    sortable_type: 'collection',
    sortable: {
      id: 2,
      name: 'Best Deals',
      slug: 'best-deals',
      key: 'collections.best_deals',
      is_active: true,
      layout_config: { displayLimit: 6, gap: 0, paddingInline: 0 },
      card_config: { aspectRatio: '1/1', borderRadius: 0, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'none' },
      rules: [{ field: 'discount', operator: '>=', value: '25' }],
      products: [
        FAKE_PRODUCTS.dellXPS,
        FAKE_PRODUCTS.leatherTote,
        FAKE_PRODUCTS.cottonShirt,
        FAKE_PRODUCTS.oneplus13,
        FAKE_PRODUCTS.satinDress,
        FAKE_PRODUCTS.retinol,
      ],
    },
  },

  // ── 5. Promotion (Flash — percentage) ─────────────────────────────────────
  {
    id : 5 ,
    sortable_type: 'promotion',
    order : 5 ,
    sortable: {
      id: 1,
      name: 'Flash Sale — 30% Off Electronics',
      value: 30,
      minimum_order_amount: 100,
      minimum_items: null,
      max_uses: 500,
      times_used: 123,
      valid_from: '2026-04-01T00:00:00Z',
      valid_until: '2026-04-07T23:59:59Z',
      applicable_product_ids: null,
      applicable_category_ids: ['Electronics'],
      applicable_sub_category_ids: null,
      is_active: true,
      priority: 2,
    },
  },

  // ── 6. Collection (Smartphones) ───────────────────────────────────────────
  { 

    id:6,
    order: 6,
    sortable_type: 'collection',
    sortable: {
      id: 3,
      name: 'Smartphones',
      slug: 'smartphones',
      key: 'collections.smartphones',
      is_active: true,
      layout_config: { displayLimit: 5, gap: 16, paddingInline: 0 },
      card_config: { aspectRatio: '1/1', borderRadius: 8, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
      rules: [{ field: 'category_id', operator: '=', value: 'Electronics' }],
      products: [
        FAKE_PRODUCTS.galaxyS25,
        FAKE_PRODUCTS.iphone16pro,
        FAKE_PRODUCTS.pixel9,
        FAKE_PRODUCTS.oneplus13,
        FAKE_PRODUCTS.xiaomi15,
      ],
    },
  },

  // ── 7. Video split ────────────────────────────────────────────────────────
  {
    id:7,
    sortable_type: 'video_split',
    order: 7,

    sortable: { 

      id: 'brand-story',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoSide: 'left',
      order: 7,
      eyebrow: 'Our Story',
      title: 'Crafted with purpose, delivered with care.',
      subtitle: 'We partner with the best brands worldwide to bring you quality products at unbeatable prices.',
      cta: { label: 'Learn More', href: '/about' },
    },
  },

  // ── 8. Collection (Laptops) ───────────────────────────────────────────────
  { 

    id:8 ,
    sortable_type: 'collection',
    order: 8,
    sortable: {
      id: 4,
      name: 'Laptops',
      slug: 'laptops',
      key: 'collections.laptops',
      is_active: true,
      layout_config: { displayLimit: 4, gap: 0, paddingInline: 0 },
      card_config: { aspectRatio: '1/1', borderRadius: 0, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'none' },
      rules: [{ field: 'category_id', operator: '=', value: 'Electronics' }],
      products: [
        FAKE_PRODUCTS.macbookM3,
        FAKE_PRODUCTS.dellXPS,
        FAKE_PRODUCTS.thinkpad,
        FAKE_PRODUCTS.rogZephyrus,
      ],
    },
  },

  // ── 9. Banner (Brand Spotlight — Apple) ───────────────────────────────────
  {
    id:9 ,
    sortable_type: 'banner',
    order: 9,
    sortable: {
      id: 3,
      key: 'apple_spotlight',
      name: 'Apple Spotlight',
      slug: 'apple-spotlight',
      is_active: true,
      direction: 'ltr',
      aspect_ratio: '21:9',
      border_radius: '0px',
      bg_color: '#0a0a0a',
      slots: [
        {
          slot_key: 'left',
          is_visible: true,
          width: '40',
          bg_color: '#0a0a0a',
          elements: {
            eyebrow:   { text: 'Brand Spotlight',                              color: '#888885', visible: true },
            title:     { text: 'Think Different.',                             color: '#efefed', visible: true },
            paragraph: { text: 'Shop the full Apple ecosystem.',               color: '#888885', visible: true },
            button:    { text: 'Shop Apple', bg_color: '#efefed',link : '/'  , text_color: '#0a0a0a', visible: true },
          },
        },
        {
          slot_key: 'middle',
          is_visible: false,
          width: '0',
          bg_color: '#0a0a0a',
        },
        {
          slot_key: 'right',
          is_visible: true,
          width: '60',
          bg_color: '#0a0a0a',
          main_media: { id: 3, url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1400', media_sortable_type: 'image' },
        },
      ],
    },
  },

  // ── 10. Collection (Women's Tops) ─────────────────────────────────────────
  {
    id:10 ,
    order: 10,
    sortable_type: 'collection',
    sortable: {
      id: 5,
      name: "Women's Tops",
      slug: 'womens-tops',
      key: 'collections.womens_tops',
      is_active: true,
      layout_config: { displayLimit: 5, gap: 24, paddingInline: 0 },
      card_config: { aspectRatio: '3/4', borderRadius: 12, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
      rules: [{ field: 'category_id', operator: '=', value: 'Fashion' }],
      products: [
        FAKE_PRODUCTS.ruffleShirt,
        FAKE_PRODUCTS.cottonShirt,
        FAKE_PRODUCTS.printedBlouse,
        FAKE_PRODUCTS.pointelleTop,
        FAKE_PRODUCTS.linenBlazer,
      ],
    },
  },

 
];


const VideoSplitRenderer: React.FC<{ sortable: VideoSplitBlock }> = ({ sortable }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const videoEl = (
    <div style={{ flex: 1, minHeight: 340, borderRadius: theme.borderRadius, overflow: 'hidden' }}>
      <iframe src={sortable.videoUrl} style={{ width: '100%', height: '100%', minHeight: 340, border: 'none', display: 'block' }} allow="autoplay; encrypted-media" allowFullScreen title={sortable.title} />
    </div>
  );
  const textEl = (
    <div style={{ flex: 1, padding: '2rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {sortable.eyebrow && <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 8 }}>{sortable.eyebrow}</p>}
      <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2rem', fontWeight: 600, color: theme.text, lineHeight: 1.25, marginBottom: 14 }}>{sortable.title}</h2>
      {sortable.subtitle && <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.7, marginBottom: 24 }}>{sortable.subtitle}</p>}
      {sortable.cta && <a href={sortable.cta.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 500, textDecoration: 'none', width: 'fit-content' }}>{sortable.cta.label} →</a>}
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: '3rem', paddingInline: '5vw', alignItems: 'stretch' }}>
      {sortable.videoSide === 'left' ? <>{videoEl}{textEl}</> : <>{textEl}{videoEl}</>}
    </div>
  );
};

const CountdownDealRenderer: React.FC<{ sortable: CountdownDealBlock }> = ({ sortable }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const [timeLeft, setTimeLeft] = React.useState({ h: 0, m: 0, s: 0 });
  React.useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(sortable.endsAt).getTime() - Date.now());
      setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [sortable.endsAt]);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius, padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
        <img src={sortable.product.image} alt={sortable.product.name} style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: theme.borderRadius, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 220 }}>
          {sortable.eyebrow && <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 6 }}>{sortable.eyebrow}</p>}
          <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem', fontWeight: 600, color: theme.text, marginBottom: 8 }}>{sortable.title}</h3>
          <p style={{ fontSize: '1.1rem', color: theme.priceText, fontWeight: 500, marginBottom: 4 }}>
            <span style={{ textDecoration: 'line-through', color: theme.priceStrike, marginRight: 8, fontWeight: 400, fontSize: '0.9rem' }}>${sortable.product.originalPrice}</span>
            ${sortable.product.price}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {[{ v: pad(timeLeft.h), l: 'HRS' }, { v: pad(timeLeft.m), l: 'MIN' }, { v: pad(timeLeft.s), l: 'SEC' }].map(({ v, l }) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: theme.text, lineHeight: 1, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '8px 14px', minWidth: 60 }}>{v}</div>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: theme.textMuted, marginTop: 4 }}>{l}</div>
            </div>
          ))}
          <a href="#" style={{ display: 'inline-block', padding: '12px 28px', background: theme.accent, color: '#fff', borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.08em', marginLeft: 8 }}>Grab Deal</a>
        </div>
      </div>
    </div>
  );
};

const UGCWallRenderer: React.FC<{ sortable: UGCWallBlock }> = ({ sortable }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      {(sortable.title || sortable.subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {sortable.title && <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.8rem', fontWeight: 600, color: theme.text, marginBottom: 6 }}>{sortable.title}</h2>}
          {sortable.subtitle && <p style={{ fontSize: 13, color: theme.textMuted }}>{sortable.subtitle}</p>}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {sortable.photos.map(photo => (
          <div key={photo.id} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: theme.borderRadius, cursor: 'pointer' }}>
            <img src={photo.image} alt={photo.username} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '12px 10px 8px', fontSize: 11, color: '#fff' }}>{photo.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BrandSpotlightRenderer: React.FC<{ sortable: BrandSpotlightBlock }> = ({ sortable }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ position: 'relative', marginBottom: '3rem', height: 320, overflow: 'hidden' }}>
      <img src={sortable.image} alt={sortable.brandName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 4vw' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>{sortable.brandName}</h2>
        {sortable.tagline && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 500, marginBottom: 24 }}>{sortable.tagline}</p>}
        {sortable.cta && <a href={sortable.cta.href} style={{ padding: '10px 28px', border: '1px solid #fff', color: '#fff', borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.08em' }}>{sortable.cta.label}</a>}
      </div>
    </div>
  );
};

const QuizCTARenderer: React.FC<{ sortable: QuizCTABlock }> = ({ sortable }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius, padding: '2.5rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.8rem', fontWeight: 600, color: theme.text, marginBottom: 10 }}>{sortable.title}</h2>
          {sortable.subtitle && <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, marginBottom: 20 }}>{sortable.subtitle}</p>}
          <a href={sortable.cta.href} style={{ display: 'inline-block', padding: '11px 28px', background: theme.primary, color: '#fff', borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.08em' }}>{sortable.cta.label}</a>
        </div>
        {sortable.image && <img src={sortable.image} alt="quiz" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: theme.borderRadius, flexShrink: 0 }} />}
      </div>
    </div>
  );
};

const SocialProofRenderer: React.FC<{ sortable: SocialProofBlock }> = ({ sortable }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: '2rem 0', borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
        {sortable.stats.map(stat => (
          <div key={stat.label} style={{ textAlign: 'center', flex: '1 0 100px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: theme.accent }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
        {sortable.quote && (
          <div style={{ flex: '2 0 280px', padding: '1rem 1.5rem', borderLeft: `3px solid ${theme.accent}` }}>
            <p style={{ fontSize: 14, color: theme.text, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 }}>"{sortable.quote.text}"</p>
            <p style={{ fontSize: 11, color: theme.textMuted }}>{sortable.quote.author}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LookbookGridRenderer: React.FC<{ sortable: LookbookGridBlock }> = ({ sortable }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      {sortable.title && <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem', fontWeight: 600, color: theme.text, marginBottom: '1.2rem' }}>{sortable.title}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {sortable.items.map(item => (
          <a key={item.id} href={item.href ?? '#'} style={{ position: 'relative', display: 'block', aspectRatio: '4/5', overflow: 'hidden', borderRadius: theme.borderRadius, textDecoration: 'none' }}>
            <img src={item.image} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }} />
            {item.label && <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 12, padding: '5px 12px', borderRadius: 4 }}>{item.label}</div>}
          </a>
        ))}
      </div>
    </div>
  );
};

const AdSlotRenderer: React.FC<{ sortable: AdSlotBlock }> = ({ sortable }) => (
  <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
    <a href={sortable.href} style={{ display: 'block', borderRadius: 8, overflow: 'hidden' }}>
      <img src={sortable.image} alt={sortable.alt ?? 'Advertisement'} style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} />
    </a>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  renderBlock  — the single switch that maps sortable_type → component
// ─────────────────────────────────────────────────────────────────────────────
const renderBlock = (item: FeedItem, onViewAll: (key: string) => void) => {
  switch (item.sortable_type) {
    case 'collection': return <CollectionRenderer key={item.sortable.id}  section={item} onViewAll={onViewAll} />;
    case 'banner':    return <BannerRenderer   isEditor={false} key={item.sortable.id}   banner={item.sortable} />;
    // case 'video_split':     return <VideoSplitRenderer    key={item.sortable.id} sortable={item.sortable} />;
    // case 'countdown_deal':  return <CountdownDealRenderer key={item.sortable.id} sortable={item.sortable} />;
    // case 'ugc_wall':        return <UGCWallRenderer       key={item.sortable.id} sortable={item.sortable} />;
    // case 'brand_spotlight': return <BrandSpotlightRenderer key={item.sortable.id} sortable={item.sortable} />;
    // case 'quiz_cta':        return <QuizCTARenderer       key={item.sortable.id} sortable={item.sortable} />;
    // case 'social_proof':    return <SocialProofRenderer   key={item.sortable.id} sortable={item.sortable} />;
    // case 'lookbook_grid':   return <LookbookGridRenderer  key={item.sortable.id} sortable={item.sortable} />;
    // case 'ad_slot':         return <AdSlotRenderer        key={item.sortable.id} sortable={item.sortable} />;
    case 'full_video':      return null; 
    default:                return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
interface HomePageProps {
  /** Feed from backend — if omitted, uses FAKE_FEED */
  feed?: FeedItem[];
  onViewAll?: (sectionKey: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ feed = FAKE_FEED, onViewAll }) => {
  const handleViewAll = (key: string) => {
    onViewAll?.(key);
    // TODO: wire to router e.g. router.push(`/shop/${key}`)
  };

  return (
    <Layout currentPage="home">
      {/* ── Fixed chrome — always here ── */}
      {/* <HeroSlider /> */}
      {/* <PromoStrip /> */}
      {/* <CategoryBanners /> */}

      {/* ── Dynamic feed — backend controls everything below ── */}
      <section style={{ paddingBlock: '3rem' }}>
        {feed.map(item => renderBlock(item, handleViewAll))}
      </section>

      {/* ── Fixed chrome — always last ── */}
      {/* <FeatureStrip /> */}
      {/* <NewsletterSection /> */}

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </Layout>
  );
};

export default HomePage;