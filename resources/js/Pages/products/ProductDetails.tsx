import React, { useState } from "react";
import Reviews from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/Reviews";
import ProductMoreDetailsTabMaster from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/ProductMoreDetailsTabMaster";
import Specs from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/Specs";
import MediaGallery from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/MediaGallery";
import { ProductInfo } from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/ProductInfo";
import ColorSelector from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/ColorSection";
import SizeSelector from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/SizeSelector";
import AddToCart from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/AddToCart";
import Tabs from "../admin/pages/products/A_sharedForAllNiches/components/showProductPage/Tabs";
import { Info, Star, User } from "lucide-react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import Layout from "@/Layouts/Layout";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";


interface Color {
  id: string;
  name: string;
  hex: string;
}

interface Size {
  id: string;
  name: string;
}

interface Media {
  path: string;
  id: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Material {
  id: string;
  name: string;
}

interface Fit {
  id: string;
  name: string;
}

interface Country {
  code: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  compareAtPrice?: string;
  description: string;
  rating_average: number;
  thumbnail: Media;
  covers: Media[];
  video?: { path: string; id: string } | null;
  tags: Tag[];
  category: Category[];
  sku: string;
  stockQuantity: number;
  releaseDate: string;
  colors: Color[];
  sizes: Size[];
  materials?: Material[];
  fits?: Fit[];
  gender?: string[];
  styles?: string[];
  season?: string[];
  madeCountry?: Country;
}

interface ProductDetailProps {
  onStepChange : (action : "next" | "prev") => void 
}

const ProductDetails = ({onStepChange}:ProductDetailProps) => {

  const [selectedMedia, setSelectedMedia] = useState<number>(0);

  const product: Product = {
    id: "f123",
    name: "Casual Denim Jacket",
    brand: "UrbanStyle",
    price: "$99.99",
    compareAtPrice: "$129.99",
    category: [{ id: "1", name: "Jackets" }, { id: "2", name: "Men" }],
    description:
      "A premium denim jacket crafted from sustainable organic cotton blend. Perfect for casual outings, this versatile piece features a timeless design that complements any wardrobe. The classic fit provides comfort and movement, while high-quality stitching ensures durability. Great layering piece for spring and fall seasons.",
    rating_average: 4.5,
    thumbnail: {
      path: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
      id: "123",
    },
    video: null,
    covers: [
      { path: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800", id: "1" },
      { path: "https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=800", id: "2" },
      { path: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800", id: "3" },
      { path: "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&w=800", id: "4" },
    ],
    tags: [{ id: "t1", name: "casual" }, { id: "t2", name: "denim" }, { id: "t3", name: "bestseller" }],
    sku: "DSHIRT-001",
    stockQuantity: 25,
    releaseDate: "2025-01-15",
    materials: [
      { id: "m1", name: "Organic Cotton" },
      { id: "m2", name: "Cotton Blend" },
    ],
    fits: [{ id: "f1", name: "Regular" }],
    gender: ["male", "female"],
    styles: ["casual", "streetwear"],
    season: ["spring", "summer"],
    madeCountry: { code: "c1", name: "USA" },
    colors: [
      { id: "c1", name: "Denim Blue", hex: "#1E90FF" },
      { id: "c2", name: "Black", hex: "#000000" },
      { id: "c3", name: "Charcoal", hex: "#36454F" },
      { id: "c4", name: "Light Blue", hex: "#87CEEB" },
    ],
    sizes: [
      { id: "s1", name: "XS" },
      { id: "s2", name: "S" },
      { id: "s3", name: "M" },
      { id: "s4", name: "L" },
      { id: "s5", name: "XL" },
      { id: "s6", name: "XXL" },
    ],
  };


  const tabsData = [
    {
      id: "reviews",
      Icon : Star ,
      label: "Reviews",
      content: <Reviews />,
    },
    {
      id: "details",
      Icon : Info , 
      label: "Product Details",
      content: (
        <ProductMoreDetailsTabMaster
          description={product.description}
          brand={product.brand}
          category={product.category}
          tags={product.tags}
          sku={product.sku}
          releaseDate={product.releaseDate}
        />
      ),
    },
    {
      id: "specs",
      label: "Specifications",
      Icon : User ,
      content: (
        <Specs
          materials={product.materials}
          madeCountry={product.madeCountry}
          fits={product.fits}
          season={product.season}
          gender={product.gender}
          styles={product.styles}
          sku={product.sku}
        />
      ),
    },
  ];
  

  const handleAddToCard = async (id : string ) => {
        router.post(route('cart.store') , {id}) ;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="sticky top-4 h-fit">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200">
              <MediaGallery media={product.covers ?? []} video={product.video ?? null} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
              <div className="space-y-6">
                <ProductInfo 
                  colors={product.colors}
                  sizes={product.sizes}
                  name={product.name}
                  brand={product.brand}
                  rating_average={product.rating_average}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  sku={product.sku}
                  stock={product.stockQuantity}
                  description={product.description}
                  materials={product.materials}
                  fits={product.fits}
                  gender={product.gender}
                  styles={product.styles}
                  season={product.season}
                  madeCountry={product.madeCountry}
                  isCOD={true}
                />

                
                <div className="pt-4">
                  <AddToCart 
                   onAddToCart={() => handleAddToCard(product.id)}
                   onBuyNow={() => onStepChange("next")}
                   stock={product.stockQuantity} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs tabs={tabsData} defaultTab="reviews" />
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
