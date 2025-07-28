import React from 'react'

function VariantsList({
    removeVariant,
    productVariants,
    scrollToVariantForm,
}) {
    return (
        <>
            <div id="variantsList" className={`${productVariants.length > 0 ? '' : 'hidden' }`}>
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
                            {productVariants.length > 1
                                ? "s "
                                : " "}
                            added
                            
                        </span>
                        <button
                            type='button'
                            id="addNewVariantBtn"
                            onClick={() => {
                                scrollToVariantForm()
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 focus:ring-4 focus:ring-green-200 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            Add New Variant
                        </button>
                    </div>
                </div>
                <div id="variantsContainer" className="space-y-4">
                    {/* <!-- Variants will be added here --> */}

                    {productVariants &&
                        productVariants.map(function (variant ,index) {
                            return (
                                <div key={index} className="variant-card">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`w-8 h-8 rounded-full ${"bg-gray-500"} border-2 border-slate-300 shadow-sm`}
                                        ></div>
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-800">
                                                ${variant.color.name} / $
                                                {variant.size} / $
                                                {variant.fit} / $
                                                {variant.material}
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                Quantity:{" "}
                                                <span className="font-medium">
                                                    ${variant.quantity}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type='button'
                                            className="remove-variant-btn"
                                            onClick={removeVariant(variant.id)}
                                            title="Remove variant"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
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