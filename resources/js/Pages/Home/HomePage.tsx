import React from 'react';
import Layout from '../../Layouts/Layout';
import HeroSlider from './Partials/HeroSlider';
import PromoBanners from './Partials/PromoBanners';
import FeatureStrip from './Partials/FeatureStrip';
import NewsletterSection from './Partials/NewsletterSection';
import PromoStrip from './Partials/PromoStrip';
import CategoryBanners from './Partials/CategoryBanners';
import CollectionRenderer, { ScrollRow } from '../admin/pages/store/RuleBasedCollections/Partials/CollectionRenderer';
import {
  FeedItem,
  VideoSplitBlock,
  FullVideoBlock,
  CountdownDealBlock,
  UGCWallBlock,
  BrandSpotlightBlock,
  QuizCTABlock,
  SocialProofBlock,
  LookbookGridBlock,
  AdSlotBlock ,
  
} from '@/types/HomeFeedTypes' ;
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import BannerRenderer from '../admin/pages/store/Banner/Partials/BannerRenderer';


// ─────────────────────────────────────────────────────────────────────────────
//  FAKE FEED  — swap with real API response from backend
//  Backend returns FeedItem[] — ordered, typed, ready to render
// ─────────────────────────────────────────────────────────────────────────────
const FAKE_PRODUCTS = {
  galaxyS25:    { id: 1,  name: 'Samsung Galaxy S25',  brand: 'Samsung',      price: 799,   originalPrice: 999,  image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400',    category: 'Electronics', rating: 4.7, reviews: 312, badge: 'new' },
  iphone16pro:  { id: 2,  name: 'iPhone 16 Pro',        brand: 'Apple',        price: 1099,  originalPrice: 1199, image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.9, reviews: 540, badge: 'new' },
  macbookM3:    { id: 3,  name: 'MacBook Air M3',       brand: 'Apple',        price: 1099,  originalPrice: 1299, image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.9, reviews: 410, badge: 'new' },
  pointelleTop: { id: 4,  name: 'Pointelle Knit Top',   brand: 'Mango',        price: 29.99, originalPrice: 49,   image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.6, reviews: 33,  badge: 'new' },
  floralDress:  { id: 5,  name: 'Floral Midi Dress',    brand: 'ASOS',         price: 39.99, originalPrice: 65,   image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.7, reviews: 44,  badge: 'new' },
  vitaminC:     { id: 6,  name: 'Vitamin C Serum',      brand: 'The Ordinary', price: 12.99, originalPrice: 18,   image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty',      rating: 4.8, reviews: 502, badge: 'new' },
  dellXPS:      { id: 7,  name: 'Dell XPS 15',          brand: 'Dell',         price: 1399,  originalPrice: 1799, image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',            category: 'Electronics', rating: 4.7, reviews: 205 },
  leatherTote:  { id: 8,  name: 'Leather Tote Bag',     brand: 'Coach',        price: 199,   originalPrice: 320,  image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Accessories', rating: 4.8, reviews: 95,  badge: 'sale' },
  cottonShirt:  { id: 9,  name: 'Stretch Cotton Shirt', brand: 'COS',          price: 52.66, originalPrice: 111,  image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.4, reviews: 11 },
  oneplus13:    { id: 10, name: 'OnePlus 13',            brand: 'OnePlus',      price: 549,   originalPrice: 699,  image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.6, reviews: 120, badge: 'hot' },
  satinDress:   { id: 11, name: 'Satin Wrap Dress',     brand: 'Reformation',  price: 89,    originalPrice: 130,  image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.8, reviews: 67,  badge: 'hot' },
  retinol:      { id: 12, name: 'Retinol Night Cream',  brand: 'RoC',          price: 24.5,  originalPrice: 35,   image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty',      rating: 4.6, reviews: 189 },
  pixel9:       { id: 13, name: 'Google Pixel 9',       brand: 'Google',       price: 649,   originalPrice: 799,  image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.5, reviews: 198 },
  xiaomi15:     { id: 14, name: 'Xiaomi 15 Ultra',      brand: 'Xiaomi',       price: 499,   originalPrice: 699,  image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.4, reviews: 87 },
  thinkpad:     { id: 15, name: 'Lenovo ThinkPad X1',   brand: 'Lenovo',       price: 999,   originalPrice: 1299, image: 'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.6, reviews: 178 },
  rogZephyrus:  { id: 16, name: 'ASUS ROG Zephyrus',    brand: 'ASUS',         price: 1599,  originalPrice: 1999, image: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.8, reviews: 290, badge: 'hot' },
  ruffleShirt:  { id: 17, name: 'Esprit Ruffle Shirt',  brand: 'Esprit',       price: 16.64, originalPrice: 23,   image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Fashion',     rating: 4.5, reviews: 12,  badge: 'new' },
  printedBlouse:{ id: 18, name: 'Metallic Printed Blouse', brand: 'Zara',      price: 34.75, originalPrice: 55,   image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.3, reviews: 9 },
  linenBlazer:  { id: 19, name: 'Linen Cropped Blazer', brand: 'H&M',          price: 44.5,  originalPrice: 69,   image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.5, reviews: 21 },
  lipstickSet:  { id: 22, name: 'Matte Lipstick Set',   brand: 'MAC',          price: 18,    originalPrice: 22,   image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty',      rating: 4.7, reviews: 340, badge: 'new' },
  fentyFoundation: { id: 23, name: 'Foundation SPF 30', brand: 'Fenty Beauty', price: 38,   originalPrice: 48,   image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty',      rating: 4.9, reviews: 780, badge: 'hot' },
};

const FAKE_FEED: FeedItem[] = [
  // ── 1. Collection ──────────────────────────────────────────────────────────
  {
    type: 'collection',
    data: {
      id: 1,
      name: 'New Arrivals',
      slug: 'new-arrivals',
      key: 'collections.new_arrivals',
      is_active: true,
      order: 1,
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
    type: 'banner',
    data: {
      id: 1,
      key: 'spring_sale_2026',
      name: 'Spring Sale',
      slug: 'spring-sale-2026',
      is_active: true,
      order: 1,
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
          main_media: { id: 1, url: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1400', media_type: 'image' },
        },
      ],
    },
  },

  // ── 3. Banner (Collections Discount — inset style, rtl) ───────────────────
  {
    type: 'banner',
    data: {
      id: 2,
      key: 'collections_discount',
      name: 'Collections Discount',
      slug: 'collections-discount',
      is_active: true,
      order: 2,
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
          main_media: { id: 2, url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1400', media_type: 'image' },
        },
      ],
    },
  },

  // ── 4. Collection (Best Deals) ────────────────────────────────────────────
  {
    type: 'collection',
    data: {
      id: 2,
      name: 'Best Deals',
      slug: 'best-deals',
      key: 'collections.best_deals',
      is_active: true,
      order: 2,
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
    type: 'promotion',
    data: {
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
    type: 'collection',
    data: {
      id: 3,
      name: 'Smartphones',
      slug: 'smartphones',
      key: 'collections.smartphones',
      is_active: true,
      order: 3,
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
    type: 'video_split',
    data: {
      id: 'brand-story',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoSide: 'left',
      eyebrow: 'Our Story',
      title: 'Crafted with purpose, delivered with care.',
      subtitle: 'We partner with the best brands worldwide to bring you quality products at unbeatable prices.',
      cta: { label: 'Learn More', href: '/about' },
    },
  },

  // ── 8. Collection (Laptops) ───────────────────────────────────────────────
  {
    type: 'collection',
    data: {
      id: 4,
      name: 'Laptops',
      slug: 'laptops',
      key: 'collections.laptops',
      is_active: true,
      order: 4,
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
    type: 'banner',
    data: {
      id: 3,
      key: 'apple_spotlight',
      name: 'Apple Spotlight',
      slug: 'apple-spotlight',
      is_active: true,
      order: 3,
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
          main_media: { id: 3, url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1400', media_type: 'image' },
        },
      ],
    },
  },

  // ── 10. Collection (Women's Tops) ─────────────────────────────────────────
  {
    type: 'collection',
    data: {
      id: 5,
      name: "Women's Tops",
      slug: 'womens-tops',
      key: 'collections.womens_tops',
      is_active: true,
      order: 5,
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

  // ── 11. Promotion (Free Shipping) ─────────────────────────────────────────
  {
    type: 'promotion',
    data: {
      id: 2,
      name: 'Free Shipping on Orders Over $50',
      type: 'free_shipping',
      value: 0,
      minimum_order_amount: 50,
      minimum_items: null,
      max_uses: null,
      times_used: 4210,
      valid_from: '2026-01-01T00:00:00Z',
      valid_until: '2026-12-31T23:59:59Z',
      applicable_product_ids: null,
      applicable_category_ids: null,
      applicable_sub_category_ids: null,
      is_active: true,
      priority: 0,
    },
  },

  // ── 12. Collection (Beauty) ───────────────────────────────────────────────
  {
    type: 'collection',
    data: {
      id: 6,
      name: 'Beauty',
      slug: 'beauty',
      key: 'collections.beauty',
      is_active: true,
      order: 6,
      layout_config: { displayLimit: 4, gap: 0, paddingInline: 0 },
      card_config: { aspectRatio: '1/1', borderRadius: 0, showPrice: true, showBadge: true, textAlign: 'left', hoverEffect: 'zoom' },
      rules: [{ field: 'category_id', operator: '=', value: 'Beauty' }],
      products: [
        FAKE_PRODUCTS.vitaminC,
        FAKE_PRODUCTS.retinol,
        FAKE_PRODUCTS.lipstickSet,
        FAKE_PRODUCTS.fentyFoundation,
      ],
    },
  },

  // ── 13. UGC wall ─────────────────────────────────────────────────────────
  {
    type: 'ugc_wall',
    data: {
      id: 'ugc-1',
      title: 'Loved by our community',
      subtitle: 'Real customers, real style.',
      photos: [
        { id: 'u1', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400', username: '@sara.styles' },
        { id: 'u2', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', username: '@techguy99' },
        { id: 'u3', image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',   username: '@mina.looks' },
        { id: 'u4', image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400', username: '@fashionweekly' },
        { id: 'u5', image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400', username: '@daily.fits' },
        { id: 'u6', image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400', username: '@clean.wardrobe' },
      ],
    },
  },

  // ── 14. Promotion (Fixed — Fashion) ──────────────────────────────────────
  {
    type: 'promotion',
    data: {
      id: 3,
      name: '$15 Off Fashion Orders',
      type: 'fixed',
      value: 15,
      minimum_order_amount: 75,
      minimum_items: 2,
      max_uses: 200,
      times_used: 58,
      valid_from: '2026-04-01T00:00:00Z',
      valid_until: '2026-04-30T23:59:59Z',
      applicable_product_ids: null,
      applicable_category_ids: ['Fashion'],
      applicable_sub_category_ids: null,
      is_active: true,
      priority: 1,
    },
  },

  // ── 15. Lookbook grid ────────────────────────────────────────────────────
  {
    type: 'lookbook_grid',
    data: {
      id: 'lookbook-spring',
      title: 'Spring Lookbook',
      items: [
        { id: 'l1', image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=600',  label: 'Street Style', href: '/lookbook/street' },
        { id: 'l2', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',  label: 'Casual Edit',  href: '/lookbook/casual' },
        { id: 'l3', image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600',  label: 'Work Wear',    href: '/lookbook/work' },
        { id: 'l4', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',  label: 'Evening',      href: '/lookbook/evening' },
      ],
    },
  },

  // ── 16. Social proof ──────────────────────────────────────────────────────
  {
    type: 'social_proof',
    data: {
      id: 'social-proof-1',
      stats: [
        { value: '50k+',   label: 'Happy Customers' },
        { value: '1,200+', label: 'Brands' },
        { value: '4.8★',   label: 'Average Rating' },
        { value: '24h',    label: 'Delivery' },
      ],
      quote: {
        text: 'Best online shopping experience I have ever had. Fast delivery and amazing quality.',
        author: 'Sarah M., Verified Buyer',
      },
    },
  },

  // ── 17. Quiz CTA ──────────────────────────────────────────────────────────
  {
    type: 'quiz_cta',
    data: {
      id: 'quiz-1',
      title: 'Not sure what to buy?',
      subtitle: "Take our 30-second quiz and we'll find the perfect product for you.",
      cta: { label: 'Start the Quiz', href: '/quiz' },
      image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  },
];


const VideoSplitRenderer: React.FC<{ data: VideoSplitBlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const videoEl = (
    <div style={{ flex: 1, minHeight: 340, borderRadius: theme.borderRadius, overflow: 'hidden' }}>
      <iframe src={data.videoUrl} style={{ width: '100%', height: '100%', minHeight: 340, border: 'none', display: 'block' }} allow="autoplay; encrypted-media" allowFullScreen title={data.title} />
    </div>
  );
  const textEl = (
    <div style={{ flex: 1, padding: '2rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {data.eyebrow && <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 8 }}>{data.eyebrow}</p>}
      <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2rem', fontWeight: 600, color: theme.text, lineHeight: 1.25, marginBottom: 14 }}>{data.title}</h2>
      {data.subtitle && <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.7, marginBottom: 24 }}>{data.subtitle}</p>}
      {data.cta && <a href={data.cta.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', border: `1px solid ${theme.accent}`, color: theme.accent, borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 500, textDecoration: 'none', width: 'fit-content' }}>{data.cta.label} →</a>}
    </div>
  );
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: '3rem', paddingInline: '5vw', alignItems: 'stretch' }}>
      {data.videoSide === 'left' ? <>{videoEl}{textEl}</> : <>{textEl}{videoEl}</>}
    </div>
  );
};

const CountdownDealRenderer: React.FC<{ data: CountdownDealBlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const [timeLeft, setTimeLeft] = React.useState({ h: 0, m: 0, s: 0 });
  React.useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(data.endsAt).getTime() - Date.now());
      setTimeLeft({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [data.endsAt]);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius, padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
        <img src={data.product.image} alt={data.product.name} style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: theme.borderRadius, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 220 }}>
          {data.eyebrow && <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 6 }}>{data.eyebrow}</p>}
          <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem', fontWeight: 600, color: theme.text, marginBottom: 8 }}>{data.title}</h3>
          <p style={{ fontSize: '1.1rem', color: theme.priceText, fontWeight: 500, marginBottom: 4 }}>
            <span style={{ textDecoration: 'line-through', color: theme.priceStrike, marginRight: 8, fontWeight: 400, fontSize: '0.9rem' }}>${data.product.originalPrice}</span>
            ${data.product.price}
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

const UGCWallRenderer: React.FC<{ data: UGCWallBlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      {(data.title || data.subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {data.title && <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.8rem', fontWeight: 600, color: theme.text, marginBottom: 6 }}>{data.title}</h2>}
          {data.subtitle && <p style={{ fontSize: 13, color: theme.textMuted }}>{data.subtitle}</p>}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {data.photos.map(photo => (
          <div key={photo.id} style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', borderRadius: theme.borderRadius, cursor: 'pointer' }}>
            <img src={photo.image} alt={photo.username} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', padding: '12px 10px 8px', fontSize: 11, color: '#fff' }}>{photo.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const BrandSpotlightRenderer: React.FC<{ data: BrandSpotlightBlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ position: 'relative', marginBottom: '3rem', height: 320, overflow: 'hidden' }}>
      <img src={data.image} alt={data.brandName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 4vw' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: 10 }}>{data.brandName}</h2>
        {data.tagline && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 500, marginBottom: 24 }}>{data.tagline}</p>}
        {data.cta && <a href={data.cta.href} style={{ padding: '10px 28px', border: '1px solid #fff', color: '#fff', borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 500, textDecoration: 'none', letterSpacing: '0.08em' }}>{data.cta.label}</a>}
      </div>
    </div>
  );
};

const QuizCTARenderer: React.FC<{ data: QuizCTABlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      <div style={{ background: theme.bgSecondary, border: `1px solid ${theme.border}`, borderRadius: theme.borderRadius, padding: '2.5rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.8rem', fontWeight: 600, color: theme.text, marginBottom: 10 }}>{data.title}</h2>
          {data.subtitle && <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.6, marginBottom: 20 }}>{data.subtitle}</p>}
          <a href={data.cta.href} style={{ display: 'inline-block', padding: '11px 28px', background: theme.primary, color: '#fff', borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.08em' }}>{data.cta.label}</a>
        </div>
        {data.image && <img src={data.image} alt="quiz" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: theme.borderRadius, flexShrink: 0 }} />}
      </div>
    </div>
  );
};

const SocialProofRenderer: React.FC<{ data: SocialProofBlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: '2rem 0', borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
        {data.stats.map(stat => (
          <div key={stat.label} style={{ textAlign: 'center', flex: '1 0 100px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: theme.accent }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
        {data.quote && (
          <div style={{ flex: '2 0 280px', padding: '1rem 1.5rem', borderLeft: `3px solid ${theme.accent}` }}>
            <p style={{ fontSize: 14, color: theme.text, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 }}>"{data.quote.text}"</p>
            <p style={{ fontSize: 11, color: theme.textMuted }}>{data.quote.author}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LookbookGridRenderer: React.FC<{ data: LookbookGridBlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  return (
    <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
      {data.title && <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.6rem', fontWeight: 600, color: theme.text, marginBottom: '1.2rem' }}>{data.title}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {data.items.map(item => (
          <a key={item.id} href={item.href ?? '#'} style={{ position: 'relative', display: 'block', aspectRatio: '4/5', overflow: 'hidden', borderRadius: theme.borderRadius, textDecoration: 'none' }}>
            <img src={item.image} alt={item.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }} />
            {item.label && <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 12, padding: '5px 12px', borderRadius: 4 }}>{item.label}</div>}
          </a>
        ))}
      </div>
    </div>
  );
};

const AdSlotRenderer: React.FC<{ data: AdSlotBlock }> = ({ data }) => (
  <div style={{ marginBottom: '3rem', paddingInline: '5vw' }}>
    <a href={data.href} style={{ display: 'block', borderRadius: 8, overflow: 'hidden' }}>
      <img src={data.image} alt={data.alt ?? 'Advertisement'} style={{ width: '100%', maxHeight: 160, objectFit: 'cover', display: 'block' }} />
    </a>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  renderBlock  — the single switch that maps type → component
// ─────────────────────────────────────────────────────────────────────────────
const renderBlock = (item: FeedItem, onViewAll: (key: string) => void) => {
  switch (item.type) {
    case 'collection': return <CollectionRenderer key={item.data.key}  section={item.data} onViewAll={onViewAll} />;
    case 'banner':    return <BannerRenderer   isEditor={false} key={item.data.id}   banner={item.data} />;
    // case 'video_split':     return <VideoSplitRenderer    key={item.data.id} data={item.data} />;
    // case 'countdown_deal':  return <CountdownDealRenderer key={item.data.id} data={item.data} />;
    // case 'ugc_wall':        return <UGCWallRenderer       key={item.data.id} data={item.data} />;
    // case 'brand_spotlight': return <BrandSpotlightRenderer key={item.data.id} data={item.data} />;
    // case 'quiz_cta':        return <QuizCTARenderer       key={item.data.id} data={item.data} />;
    // case 'social_proof':    return <SocialProofRenderer   key={item.data.id} data={item.data} />;
    // case 'lookbook_grid':   return <LookbookGridRenderer  key={item.data.id} data={item.data} />;
    // case 'ad_slot':         return <AdSlotRenderer        key={item.data.id} data={item.data} />;
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