import React from 'react'


function VariantForm({
    inventoryOptions,
    currentVariant,
    handleVariantSelection,
    addVariant,
    isReadyToAdd,
    setCurrentVariant,
    variantFormRef
}) {
    return (
        <>
            <div
                ref={variantFormRef}
                className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-6 border border-slate-200"
            >
                <h3 className="text-lg font-semibold text-slate-800 mb-6">
                    Create Product Variant
                </h3>

                {/* <!-- Colors --> */}
                <div className="space-y-4 mb-6">
                    <label className="block text-sm font-semibold text-slate-700">
                        Color
                    </label>
                    <div className="flex flex-wrap gap-4" id="colorOptions">
                        {/* <!-- Color options --> */}
                        {inventoryOptions.colors.map(function (color, index) {
                            return (
                                <button
                                    key={index}
                                    className={`${
                                        currentVariant.color !== null &&
                                        currentVariant.color.value ===
                                            color.value
                                            ? "border-orange-500 ring-2 ring-orange-500 scale-110"
                                            : currentVariant.color !== null
                                            ? //herre other color are slected so we lower the opcity of othters
                                              "opacity-40 "
                                            : ""
                                    } w-12 h-12 rounded-full ${
                                        color.color
                                    } color-option transition-all duration-200 hover:scale-110 ring-2 ring-slate-300 hover:ring-slate-400 shadow-sm`}
                                    data-value={color.value}
                                    type="button"
                                    onClick={() => {
                                        handleVariantSelection("color", color);
                                    }}
                                ></button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-500">
                        Select one color for this variant
                    </p>
                </div>

                {/* <!-- Sizes --> */}
                <div className="space-y-4 mb-6">
                    <label className="block text-sm font-semibold text-slate-700">
                        Size
                    </label>
                    <div className="flex flex-wrap gap-3" id="sizeOptions">
                        {/* <!-- Size options --> */}
                        {inventoryOptions.sizes.map(function (size, index) {
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    className={`${
                                        currentVariant.size === size
                                            ? "selected"
                                            : ""
                                    }  px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200`}
                                    data-value={size}
                                    onClick={() => {
                                        handleVariantSelection("size", size);
                                    }}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-500">
                        Select one size for this variant
                    </p>
                </div>

                {/* <!-- Fits --> */}
                <div className="space-y-4 mb-6">
                    <label className="block text-sm font-semibold text-slate-700">
                        Fit
                    </label>
                    <div className="flex flex-wrap gap-3" id="fitOptions">
                        {/* <!-- Fit options --> */}
                        {inventoryOptions.fits.map(function (fit, index) {
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    className={`${
                                        currentVariant.fit === fit
                                            ? "selected"
                                            : ""
                                    }  px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200`}
                                    data-value={fit}
                                    onClick={() => {
                                        handleVariantSelection("fit", fit);
                                    }}
                                >
                                    {fit}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-500">
                        Select one fit for this variant
                    </p>
                </div>

                {/* <!-- Materials --> */}
                <div className="space-y-4 mb-6">
                    <label className="block text-sm font-semibold text-slate-700">
                        Material
                    </label>
                    <div className="flex flex-wrap gap-3" id="materialOptions">
                        {/* <!-- Material options --> */}
                        {inventoryOptions.materials.map(function (
                            material,
                            index
                        ) {
                            return (
                                <button
                                    type="button"
                                    key={index}
                                    className={`${
                                        currentVariant.material === material
                                            ? "selected"
                                            : ""
                                    } px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200`}
                                    data-value={material}
                                    onClick={() => {
                                        handleVariantSelection(
                                            "material",
                                            material
                                        );
                                    }}
                                >
                                    {material}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-500">
                        Select one material for this variant
                    </p>
                </div>

                {/* <!-- Quantity --> */}
                <div className="space-y-4 mb-6">
                    <label className="block text-sm font-semibold text-slate-700">
                        Quantity
                    </label>
                    <input
                        type="number"
                        id="variantQuantity"
                        value={currentVariant.quantity}
                        onChange={(e) => {
                            setCurrentVariant({
                                ...currentVariant,
                                quantity: e.target.value,
                            });
                        }}
                        className="w-32 p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white/80"
                        placeholder="0"
                        min="0"
                    />
                    <p className="text-xs text-slate-500">
                        Enter the quantity for this variant
                    </p>
                </div>

                {/* <!-- Add Variant Button --> */}
                <button
                    id="addVariantBtn"
                    type="button"
                    onClick={() => {
                        addVariant();
                    }}
                    className={`btn-16 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 transform
                                            ${
                                                isReadyToAdd
                                                    ? "hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-200 hover:shadow-xl hover:scale-105 glow-ready"
                                                    : "opacity-50 cursor-not-allowed"
                                            }
                                        `}
                    disabled={!isReadyToAdd}
                >
                    {isReadyToAdd
                        ? "Add Variant"
                        : "Select all options and enter quantity"}
                </button>
            </div>
        </>
    );
}



export default VariantForm
