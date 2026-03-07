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
import { router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";


interface Color {
  id: string;
  name: string;
  hex: string;
}

interface Country {
  code: string;
  name: string;
}

interface ProductDetailProps {
  onStepChange : (action : "next" | "prev") => void 
}

const ProductDetails = ({onStepChange}:ProductDetailProps) => {

  const [selectedMedia, setSelectedMedia] = useState<number>(0);
  const {product} = usePage().props ; 
  console.log("product" , product)
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
          category={product}
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
                  name={product.name}
                  brand={product.brand}
                  rating_average={product.rating_average}
                  price={product.variants[0].price}
                  compare_price={product.variants[0].compare_price}
                  stock={product.variants[0].stock}
                  description={product.description}
                  madeCountry={product.madeCountry}
                />

                
                <div className="pt-4">
                  <AddToCart 
                   onAddToCart={() => handleAddToCard(product.id)}
                   onBuyNow={() => onStepChange("next")}
                   stock={product.variants[0].stock} />
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
