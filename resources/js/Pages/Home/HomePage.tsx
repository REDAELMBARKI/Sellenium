import React from 'react';
import Layout from '../../Layouts/Layout';
import HeroSlider from './Partials/HeroSlider';
import PromoBanners from './Partials/PromoBanners';
import CategorySlider from './Partials/CategorySlider';
import ProductsSection from './Partials/ProductsSection';
import FeatureStrip from './Partials/FeatureStrip';
import NewsletterSection from './Partials/NewsletterSection';
import { ProductClient } from '@/types/clientSideTypes';

interface HomePageProps {
  /**
   * Optional: products from server/backend.
   * If omitted, ProductsSection renders its own fake data.
   */
  products?: ProductClient[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <Layout currentPage="home">
      {/* 1. Full-screen hero with accordion-panel slider */}
      <HeroSlider />

      {/* 3. Editorial banner grid (1 large + 4 tiles) */}
      <PromoBanners />

      {/* 4. Horizontal category scroll */}
      <CategorySlider />

      {/* 5. Product grid with filter tabs + featured editorial card */}
      <ProductsSection products={products} />

      {/* 6. Trust / feature strip */}
      <FeatureStrip />

      {/* 7. Newsletter */}
      <NewsletterSection />
    </Layout>
  );
};

export default HomePage;