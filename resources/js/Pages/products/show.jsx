import React, { useState, useMemo } from 'react';
import {
    variants,
    reviews,
    relatedProducts,
} from "../../data/productData";

import ImageGallery from '@/components/showProductPage/ImageGallery';
import StarRating from '@/components/showProductPage/StarRating';
import VariantSelector from '@/components/showProductPage/VariantSelector';
import AddToCartSection from '@/components/showProductPage/AddToCartSection';
import ReviewsSection from '@/components/showProductPage/ReviewsSection';
import RelatedProducts from '@/components/showProductPage/RelatedProducts';

function ProductDetails({ productData }) {
    const [selectedColor, setSelectedColor] = useState(variants[0].color.id);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedFit, setSelectedFit] = useState(null);

    // Get current variant based on selected color
    const currentVariant = useMemo(() => {
        return (
            variants.find((v) => v.color.id === selectedColor) || variants[0]
        );
    }, [selectedColor]);

    // Get available options for current color
    const availableOptions = useMemo(() => {
        const colorVariants = variants.filter(
            (v) => v.color.id === selectedColor
        );

        const sizes = colorVariants.reduce((acc, variant) => {
            variant.sizes.forEach((size) => {
                if (!acc.find((s) => s.id === size.id)) {
                    acc.push(size);
                }
            });
            return acc;
        }, []);

        const materials = colorVariants.reduce((acc, variant) => {
            variant.materials.forEach((material) => {
                if (!acc.find((m) => m.id === material.id)) {
                    acc.push(material);
                }
            });
            return acc;
        }, []);

        const fits = colorVariants.reduce((acc, variant) => {
            variant.fits.forEach((fit) => {
                if (!acc.find((f) => f.id === fit.id)) {
                    acc.push(fit);
                }
            });
            return acc;
        }, []);

        return { sizes, materials, fits };
    }, [selectedColor]);

    // Calculate average rating
    const averageRating = useMemo(() => {
        return (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
        );
    }, []);

    // Reset dependent selections when color changes
    const handleColorChange = (colorId) => {
        setSelectedColor(colorId);
        setSelectedSize(null);
        setSelectedMaterial(null);
        setSelectedFit(null);
    };

    const handleAddToCart = (quantity) => {
        console.log("Added to cart:", {
            product: productData,
            variant: currentVariant,
            selectedSize,
            selectedMaterial,
            selectedFit,
            quantity,
        });
        alert(`Added ${quantity} item(s) to cart!`);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                {/* Main Product Section */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Image Gallery */}
                    <div>
                        <ImageGallery
                            images={currentVariant.images}
                            productName={productData.name}
                        />
                    </div>

                    {/* Product Information */}
                    <div className="space-y-6">
                        {/* Title and Rating */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                             {productData.name}
                            </h1>
                            <div className="flex items-center space-x-4 mb-4">
                                <StarRating rating={productData.rating_average} />
                                <span className="text-gray-600">
                                    ({reviews.length} reviews)
                                </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                {productData.description}
                            </p>
                        </div>

                        {/* Variant Selection */}
                        <VariantSelector
                            variants={variants}
                            selectedColor={selectedColor}
                            selectedSize={selectedSize}
                            selectedMaterial={selectedMaterial}
                            selectedFit={selectedFit}
                            onColorChange={handleColorChange}
                            onSizeChange={setSelectedSize}
                            onMaterialChange={setSelectedMaterial}
                            onFitChange={setSelectedFit}
                            availableSizes={availableOptions.sizes}
                            availableMaterials={availableOptions.materials}
                            availableFits={availableOptions.fits}
                        />

                        {/* Add to Cart Section */}
                        <div className="border-t pt-6">
                            <AddToCartSection
                                stock={currentVariant.stock}
                                price={productData.price}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-16">
                    <ReviewsSection
                        reviews={reviews}
                        averageRating={averageRating}
                    />
                </div>

                {/* Related Products */}
                <RelatedProducts products={relatedProducts} />
            </div>
        </div>
    );
};

export default ProductDetails;
