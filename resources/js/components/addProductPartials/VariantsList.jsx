import React, { useState,useEffect } from 'react'

function VariantsList({
    removeVariant,
    productVariants,
    scrollToVariantForm,
    setCurrentVariant,
    currentVariant,
    setUpdateVariantMode,
    setIsFlashing,
    setImages,
    images,
    setImagesPlaceHolders,
    setIsVariantCoverPreview,
}) {
    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function editVariant(id) {
        scrollToVariantForm()
        setIsFlashing(true);
        setUpdateVariantMode(true);
        const variant = productVariants?.find((variant) => variant.id === id);
        setCurrentVariant({
            ...currentVariant,
            id: variant.id,
            colors: [...variant.colors],
            quantity: variant.quantity,
            fits: variant.fits,
            sizes: variant.sizes,
            materials: variant.materials,
            covers: variant.covers,
        });


 
        (async function updateImagesWithBase64() {
            const newImages = {};

            for (const coverObj of variant.covers) {
                const coverKey = Object.keys(coverObj)[0];
                const file = Object.values(coverObj)[0];
                const base64 = await fileToDataUrl(file);
                newImages[coverKey] = base64;
            }

            setImages((prev) => ({
                ...prev,
                ...newImages,
            }));


            if (variant.covers.length === 0 && images.thumbnail) {
                 setIsVariantCoverPreview(true);
                 setImages({
                     ...images,
                     cover_1: images.thumbnail,
                 });
            }
        })();

        const editedVariantPlaceHolders = [];
        for (let i = 1; i <= variant.covers.length; i++) {
            editedVariantPlaceHolders.push(i);
        }

       

        setImagesPlaceHolders(
            editedVariantPlaceHolders.length > 1
                ? editedVariantPlaceHolders
                : [1]
        );
        setTimeout(() => {
            setIsFlashing(false);
        }, 100);
    }

    return (
        <>
            <div
                id="variantsList"
                className={`${productVariants.length > 0 ? "" : "hidden"}`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Product Variants
                    </h3>
                    <div className="flex items-center space-x-4">
                        <span
                            id="variantCount"
                            className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full"
                        >
                            {productVariants.length} variant
                            {productVariants.length > 1 ? "s " : " "}
                            added
                        </span>
                        <button
                            type="button"
                            id="addNewVariantBtn"
                            onClick={() => {
                                scrollToVariantForm();
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 focus:ring-4 focus:ring-green-200 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Add New Variant
                        </button>
                    </div>
                </div>
                <div id="variantsContainer" className="space-y-4 ">
                    {/* <!-- Variants will be added here --> */}

                    {productVariants &&
                        productVariants.map(function (variant, index) {
                            return (
                                <div
                                    key={index}
                                    className={`variant-card    ${
                                        variant.hasErrors
                                            ? "border-2 !border-red-500 !bg-red-500"
                                            : ""
                                    }  `}
                                >
                                    <div className="flex items-center space-x-4 ">
                                        <div
                                            className={`w-8 h-8 rounded-full ${"bg-gray-500"}  border-2 border-slate-300 shadow-sm`}
                                        ></div>
                                        <div className="flex-1 space-y-1 text-sm text-slate-700">
                                            {/* Color Circles */}
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-800">
                                                    Colors:
                                                </span>
                                                {variant?.colors.map(
                                                    (color, index) => (
                                                        <span
                                                            key={index}
                                                            className="w-4 h-4 rounded-full border border-slate-300"
                                                            style={{
                                                                backgroundColor:
                                                                    color?.hex,
                                                            }}
                                                            title={color?.hex}
                                                        ></span>
                                                    )
                                                )}
                                            </div>

                                            {/* Attributes */}
                                            <div className="flex flex-wrap gap-3 text-slate-600">
                                                <div>
                                                    <span className="text-xs uppercase text-slate-400">
                                                        Size
                                                        {variant?.sizes
                                                            ?.length > 1
                                                            ? "s"
                                                            : ""}
                                                        :
                                                    </span>{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {variant?.sizes
                                                            ?.map(function (
                                                                size,
                                                                index
                                                            ) {
                                                                return size.name;
                                                            })
                                                            .join(" | ")}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase text-slate-400">
                                                        Fit
                                                        {variant?.fits?.length >
                                                        1
                                                            ? "s"
                                                            : ""}
                                                        :
                                                    </span>{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {variant?.fits
                                                            ?.map(function (
                                                                fit,
                                                                index
                                                            ) {
                                                                return fit.name;
                                                            })
                                                            .join(" | ")}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase text-slate-400">
                                                        Material
                                                        {variant?.materials
                                                            ?.length > 1
                                                            ? "s"
                                                            : ""}
                                                        :
                                                    </span>{" "}
                                                    <span className="font-medium text-slate-700">
                                                        {variant?.materials
                                                            ?.map(function (
                                                                material,
                                                                index
                                                            ) {
                                                                return material.name;
                                                            })
                                                            .join(" | ")}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="text-slate-600">
                                                <span className="text-xs uppercase text-slate-400">
                                                    Quantity:
                                                </span>{" "}
                                                <span className="font-semibold text-slate-700">
                                                    {variant?.quantity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {/* Edit Button */}
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-blue-100 text-blue-600 transition-colors"
                                                onClick={() =>
                                                    editVariant(variant?.id)
                                                }
                                                title="Edit variant"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M11 5h6M5 19l4.586-4.586a2 2 0 012.828 0L19 18m-1-8l-2-2a2 2 0 00-2.828 0l-7.172 7.172A4 4 0 005 17v2h2a4 4 0 002.828-1.172L17 9z"
                                                    />
                                                </svg>
                                            </button>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                className="p-2 rounded hover:bg-red-100 text-red-600 transition-colors"
                                                onClick={() =>
                                                    removeVariant(variant?.id)
                                                }
                                                title="Remove variant"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}

export default VariantsList