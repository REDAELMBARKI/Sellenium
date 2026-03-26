import React from 'react';
import Layout from '../../Layouts/Layout';
import HeroSlider from './Partials/HeroSlider';
import PromoBanners from './Partials/PromoBanners';
import FeatureStrip from './Partials/FeatureStrip';
import NewsletterSection from './Partials/NewsletterSection';
import PromoStrip from './Partials/PromoStrip';
import CategoryBanners from './Partials/CategoryBanners';
import { ScrollRow } from './Partials/ScrollRow';
import {
  FeedItem,
  PromoBannerBlock,
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


// ─────────────────────────────────────────────────────────────────────────────
//  FAKE FEED  — swap with real API response from backend
//  Backend returns FeedItem[] — ordered, typed, ready to render
// ─────────────────────────────────────────────────────────────────────────────
const FAKE_FEED: FeedItem[] = [
  // ── 1. Product section ───────────────────────────────────────────────────
  {
    type: 'product_section',
    data: {
      key: 'new-arrivals',
      name: 'New Arrivals',
      emoji: '✨',
      products: [
        { id: 1,  name: 'Samsung Galaxy S25', brand: 'Samsung',      price: 799,   originalPrice: 999,  image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400',    category: 'Electronics', rating: 4.7, reviews: 312, badge: 'new' },
        { id: 2,  name: 'iPhone 16 Pro',       brand: 'Apple',        price: 1099,  originalPrice: 1199, image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.9, reviews: 540, badge: 'new' },
        { id: 3,  name: 'MacBook Air M3',      brand: 'Apple',        price: 1099,  originalPrice: 1299, image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.9, reviews: 410, badge: 'new' },
        { id: 4,  name: 'Pointelle Knit Top',  brand: 'Mango',        price: 29.99, originalPrice: 49,   image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.6, reviews: 33,  badge: 'new' },
        { id: 5,  name: 'Floral Midi Dress',   brand: 'ASOS',         price: 39.99, originalPrice: 65,   image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.7, reviews: 44,  badge: 'new' },
        { id: 6,  name: 'Vitamin C Serum',     brand: 'The Ordinary', price: 12.99, originalPrice: 18,   image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty',      rating: 4.8, reviews: 502, badge: 'new' },
      ],
    },
  },

  // ── 2. Promo banner ──────────────────────────────────────────────────────
  {
    type: 'promo_banner',
    data: {
      id: 'spring-sale',
      image: 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1400',
      align: 'right',
      eyebrow: 'Limited Time',
      title: 'Spring Sale — Up to 50% Off',
      subtitle: 'Fresh styles for the new season. Shop before it ends.',
      cta: { label: 'Shop Now', href: '/sale' },
    },
  },

  // ── 2b. Inset promo banner ───────────────────────────────────────────────
  {
    type: 'inset_promo',
    data: {
      id: 'collections-discount',
      image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1400',
      eyebrow: 'Collections Discount',
      title: 'Up to 40% off our collections',
      cta: { label: 'Shop Now', href: '/collections' },
    },
  },

  // ── 3. Product section ───────────────────────────────────────────────────
  {
    type: 'product_section',
    data: {
      key: 'best-deals',
      name: 'Best Deals',
      emoji: '🔥',
      products: [
        { id: 7,  name: 'Dell XPS 15',          brand: 'Dell',        price: 1399,  originalPrice: 1799, image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',           category: 'Electronics', rating: 4.7, reviews: 205 },
        { id: 8,  name: 'Leather Tote Bag',     brand: 'Coach',       price: 199,   originalPrice: 320,  image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Accessories', rating: 4.8, reviews: 95,  badge: 'sale' },
        { id: 9,  name: 'Stretch Cotton Shirt', brand: 'COS',         price: 52.66, originalPrice: 111,  image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.4, reviews: 11 },
        { id: 10, name: 'OnePlus 13',           brand: 'OnePlus',     price: 549,   originalPrice: 699,  image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.6, reviews: 120, badge: 'hot' },
        { id: 11, name: 'Satin Wrap Dress',     brand: 'Reformation', price: 89,    originalPrice: 130,  image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion',     rating: 4.8, reviews: 67,  badge: 'hot' },
        { id: 12, name: 'Retinol Night Cream',  brand: 'RoC',         price: 24.5,  originalPrice: 35,   image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty',      rating: 4.6, reviews: 189 },
      ],
    },
  },

  // ── 4. Countdown deal ────────────────────────────────────────────────────
  {
    type: 'countdown_deal',
    data: {
      id: 'flash-deal-1',
      endsAt: '2026-04-01T00:00:00Z',
      eyebrow: 'Flash Sale',
      title: "Today's Deal of the Day",
      product: { id: 2, name: 'iPhone 16 Pro', brand: 'Apple', price: 899, originalPrice: 1199, image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.9, reviews: 540, badge: 'sale' },
    },
  },

  // ── 5. Product section ───────────────────────────────────────────────────
  {
    type: 'product_section',
    data: {
      key: 'smartphones',
      name: 'Smartphones',
      emoji: '📱',
      products: [
        { id: 1,  name: 'Samsung Galaxy S25', brand: 'Samsung', price: 799,  originalPrice: 999,  image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400',    category: 'Electronics', rating: 4.7, reviews: 312, badge: 'new' },
        { id: 2,  name: 'iPhone 16 Pro',      brand: 'Apple',   price: 1099, originalPrice: 1199, image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.9, reviews: 540, badge: 'new' },
        { id: 13, name: 'Google Pixel 9',     brand: 'Google',  price: 649,  originalPrice: 799,  image: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.5, reviews: 198 },
        { id: 10, name: 'OnePlus 13',         brand: 'OnePlus', price: 549,  originalPrice: 699,  image: 'https://images.pexels.com/photos/5750001/pexels-photo-5750001.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.6, reviews: 120, badge: 'hot' },
        { id: 14, name: 'Xiaomi 15 Ultra',    brand: 'Xiaomi',  price: 499,  originalPrice: 699,  image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',  category: 'Electronics', rating: 4.4, reviews: 87 },
      ],
    },
  },

  // ── 6. Video split ───────────────────────────────────────────────────────
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

  // ── 7. Product section ───────────────────────────────────────────────────
  {
    type: 'product_section',
    data: {
      key: 'laptops',
      name: 'Laptops',
      emoji: '💻',
      products: [
        { id: 3,  name: 'MacBook Air M3',     brand: 'Apple',  price: 1099, originalPrice: 1299, image: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Electronics', rating: 4.9, reviews: 410, badge: 'new' },
        { id: 7,  name: 'Dell XPS 15',        brand: 'Dell',   price: 1399, originalPrice: 1799, image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400',           category: 'Electronics', rating: 4.7, reviews: 205 },
        { id: 15, name: 'Lenovo ThinkPad X1', brand: 'Lenovo', price: 999,  originalPrice: 1299, image: 'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=400',  category: 'Electronics', rating: 4.6, reviews: 178 },
        { id: 16, name: 'ASUS ROG Zephyrus',  brand: 'ASUS',   price: 1599, originalPrice: 1999, image: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Electronics', rating: 4.8, reviews: 290, badge: 'hot' },
      ],
    },
  },

  // ── 8. Brand spotlight ───────────────────────────────────────────────────
  {
    type: 'brand_spotlight',
    data: {
      id: 'apple-spotlight',
      brandName: 'Apple',
      image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1400',
      tagline: 'Think Different. Shop the full Apple ecosystem.',
      cta: { label: 'Shop Apple', href: '/brand/apple' },
    },
  },

  // ── 9. Product section ───────────────────────────────────────────────────
  {
    type: 'product_section',
    data: {
      key: 'womens-tops',
      name: "Women's Tops",
      emoji: '👗',
      products: [
        { id: 17, name: 'Esprit Ruffle Shirt',     brand: 'Esprit', price: 16.64, originalPrice: 23,  image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',   category: 'Fashion', rating: 4.5, reviews: 12, badge: 'new' },
        { id: 9,  name: 'Stretch Cotton Shirt',    brand: 'COS',    price: 52.66, originalPrice: 111, image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion', rating: 4.4, reviews: 11 },
        { id: 18, name: 'Metallic Printed Blouse', brand: 'Zara',   price: 34.75, originalPrice: 55,  image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion', rating: 4.3, reviews: 9 },
        { id: 4,  name: 'Pointelle Knit Top',      brand: 'Mango',  price: 29.99, originalPrice: 49,  image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion', rating: 4.6, reviews: 33, badge: 'new' },
        { id: 19, name: 'Linen Cropped Blazer',    brand: 'H&M',    price: 44.5,  originalPrice: 69,  image: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Fashion', rating: 4.5, reviews: 21 },
      ],
    },
  },

  // ── 10. Social proof strip ───────────────────────────────────────────────
  {
    type: 'social_proof',
    data: {
      id: 'social-proof-1',
      stats: [
        { value: '50k+',  label: 'Happy Customers' },
        { value: '1,200+', label: 'Brands' },
        { value: '4.8★',  label: 'Average Rating' },
        { value: '24h',   label: 'Delivery' },
      ],
      quote: {
        text: 'Best online shopping experience I have ever had. Fast delivery and amazing quality.',
        author: 'Sarah M., Verified Buyer',
      },
    },
  },

  // ── 11. Product section ──────────────────────────────────────────────────
  {
    type: 'product_section',
    data: {
      key: 'beauty',
      name: 'Beauty',
      emoji: '💄',
      products: [
        { id: 20, name: 'Vitamin C Serum 30ml',   brand: 'The Ordinary', price: 12.99, originalPrice: 18, image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty', rating: 4.8, reviews: 502, badge: 'new' },
        { id: 21, name: 'Retinol Night Cream',    brand: 'RoC',          price: 24.5,  originalPrice: 35, image: 'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty', rating: 4.6, reviews: 189 },
        { id: 22, name: 'Matte Lipstick Set',     brand: 'MAC',          price: 18,    originalPrice: 22, image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty', rating: 4.7, reviews: 340, badge: 'new' },
        { id: 23, name: 'Foundation SPF 30',      brand: 'Fenty Beauty', price: 38,    originalPrice: 48, image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=400', category: 'Beauty', rating: 4.9, reviews: 780, badge: 'hot' },
      ],
    },
  },

  // ── 12. UGC wall ─────────────────────────────────────────────────────────
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

  // ── 13. Lookbook grid ────────────────────────────────────────────────────
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

  // ── 14. Quiz CTA ─────────────────────────────────────────────────────────
  {
    type: 'quiz_cta',
    data: {
      id: 'quiz-1',
      title: "Not sure what to buy?",
      subtitle: 'Take our 30-second quiz and we\'ll find the perfect product for you.',
      cta: { label: 'Start the Quiz', href: '/quiz' },
      image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  },

  // ── 15. Ad slot ──────────────────────────────────────────────────────────
  {
    type: 'ad_slot',
    data: {
      id: 'ad-1',
      image: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1400',
      href: '/campaign/summer',
      alt: 'Summer Campaign',
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  PLACEHOLDER BLOCK RENDERERS
//  Each of these will be replaced with its own real component file later.
//  For now they render a clearly labeled placeholder so you can see the layout.
// ─────────────────────────────────────────────────────────────────────────────
const PromoBannerRenderer: React.FC<{ data: PromoBannerBlock }> = ({ data }) => {
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  return (
    <div style={{ position: 'relative', width: '100%', height: 380, overflow: 'hidden', marginBottom: '3rem' }}>
      <img src={data.image} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.1))', display: 'flex', alignItems: 'center', justifyContent: alignMap[data.align ?? 'left'], padding: '0 8vw' }}>
        <div style={{ maxWidth: 480, textAlign: data.align === 'center' ? 'center' : 'left' }}>
          {data.eyebrow && <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: theme.accent, marginBottom: 8 }}>{data.eyebrow}</p>}
          <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '2.4rem', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 12 }}>{data.title}</h2>
          {data.subtitle && <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 24, lineHeight: 1.6 }}>{data.subtitle}</p>}
          {data.cta && <a href={data.cta.href} style={{ display: 'inline-block', padding: '11px 28px', background: theme.accent, color: '#fff', borderRadius: theme.borderRadius, fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>{data.cta.label}</a>}
        </div>
      </div>
    </div>
  );
};

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
    case 'product_section': return <ScrollRow             key={item.data.key}  section={item.data} onViewAll={onViewAll} />;
    case 'promo_banner':    return <PromoBannerRenderer    key={item.data.id}   data={item.data} />;
    case 'video_split':     return <VideoSplitRenderer    key={item.data.id} data={item.data} />;
    case 'countdown_deal':  return <CountdownDealRenderer key={item.data.id} data={item.data} />;
    case 'ugc_wall':        return <UGCWallRenderer       key={item.data.id} data={item.data} />;
    case 'brand_spotlight': return <BrandSpotlightRenderer key={item.data.id} data={item.data} />;
    case 'quiz_cta':        return <QuizCTARenderer       key={item.data.id} data={item.data} />;
    case 'social_proof':    return <SocialProofRenderer   key={item.data.id} data={item.data} />;
    case 'lookbook_grid':   return <LookbookGridRenderer  key={item.data.id} data={item.data} />;
    case 'ad_slot':         return <AdSlotRenderer        key={item.data.id} data={item.data} />;
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
      <HeroSlider />
      <PromoStrip />
      <CategoryBanners />

      {/* ── Dynamic feed — backend controls everything below ── */}
      <section style={{ paddingBlock: '3rem' }}>
        {feed.map(item => renderBlock(item, handleViewAll))}
      </section>

      {/* ── Fixed chrome — always last ── */}
      <FeatureStrip />
      <NewsletterSection />

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </Layout>
  );
};

export default HomePage;