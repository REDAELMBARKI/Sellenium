import React, { useEffect, useState } from 'react'
import AddImagesSection from './AddImagesSection';

    function VariantForm({
        inventoryOptions,
        currentVariant,
        handleVariantSelection,
        addVariant,
        isReadyToAdd,
        setCurrentVariant,
        variantFormRef,
        newSelectedColors,
        setNewSelectedColors,
        updateVariantMode,
        errors,
        isFlashing,
        // for covers
        addImagePlaceHolder,
        handleImageUpload,
        handleRemoveImage,
        images,
        setImages,
        imagesPlaceHolders,
        placeHolderNotFilled,
        isVariantCoverPreview,
        setIsVariantCoverPreview,
        data,
        isCurrentVariantActive,
        setIsCurrentVariantActive,
    }) {
        const [previewColor, setPreviewColor] = useState(null);
        function handleAddColor() {
            setNewSelectedColors([...newSelectedColors, previewColor]);
            setPreviewColor(null);
        }

        return (
            <>
                <div
                    className={`flex items-center  space-x-3 p-4 border-b rounded-md ${
                        errors.inventory
                            ? "bg-red-50 border-red-300"
                            : "border-slate-200"
                    }`}
                >
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>

                    <div className="flex items-center space-x-2 flex-grow">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Inventory Management
                        </h2>
                        {errors.inventory && (
                            <span className="text-red-600 text-sm font-medium">
                                (required)
                            </span>
                        )}
                    </div>
                </div>
                <div
                    ref={variantFormRef}
                    className={`bg-gradient-to-br from-slate-50 relative ${
                        isFlashing
                            ? "bg-orange-100 border-2 border-orange-200"
                            : ""
                    } to-blue-50/50 rounded-xl p-6 border border-slate-200`}
                >
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">
                        Create Product Variant
                    </h3>

                    <div className="space-y-4 mb-6">
                        <AddImagesSection
                            forInventory={true}
                            title="Product Variant Images"
                            addImagePlaceHolder={addImagePlaceHolder}
                            handleImageUpload={handleImageUpload}
                            handleRemoveImage={handleRemoveImage}
                            images={images}
                            setImages={setImages}
                            imagesPlaceHolders={imagesPlaceHolders}
                            errors={errors}
                            placeHolderNotFilled={placeHolderNotFilled}
                            currentVariant={currentVariant}
                            isVariantCoverPreview={isVariantCoverPreview}
                            setIsVariantCoverPreview={setIsVariantCoverPreview}
                            data={data}
                            isCurrentVariantActive={isCurrentVariantActive}
                            setIsCurrentVariantActive={
                                setIsCurrentVariantActive
                            }
                        />
                    </div>
                    {/* <!-- Colors --> */}
                    {/* <!-- Colors --> */}
                    <div className="space-y-4 mb-6">
                        <label className="block text-sm font-semibold text-slate-700">
                            Color
                        </label>

                        {/* Color Circles */}
                        <div className="flex flex-wrap gap-4">
                            {inventoryOptions.colors
                                .concat(newSelectedColors)
                                .map(function (color, index) {
                                    const hexColors = [];

                                    for (let obj of currentVariant.colors) {
                                        if (obj?.hex) {
                                            hexColors.push(obj?.hex);
                                        }
                                    }
                                    const isCurrent = hexColors.includes(
                                        color?.hex
                                    );

                                    return (
                                        <div
                                            className="relative w-8 h-8 rounded-full "
                                            key={index}
                                        >
                                            {/* Button fills parent */}
                                            <button
                                                style={{
                                                    backgroundColor: color?.hex,
                                                }}
                                                className={`w-full h-full rounded-full color-option
                                                ring-2 ring-slate-400 transition-all duration-200 hover:scale-110 shadow-sm
                                                ${
                                                    isCurrent
                                                        ? "scale-140 "
                                                        : currentVariant.colors
                                                              ?.length > 0
                                                        ? "opacity-40"
                                                        : ""
                                                }
                                                `}
                                                data-value={color?.hex}
                                                type="button"
                                                onClick={() =>
                                                    handleVariantSelection(
                                                        "colors",
                                                        color
                                                    )
                                                }
                                            />

                                            {/* Ring overlay */}
                                            {isCurrent && (
                                                <span
                                                    className="pointer-events-none absolute top-1/2 left-1/2"
                                                    style={{
                                                        width: "70%",
                                                        height: "70%",
                                                        borderRadius: "50%",
                                                        border: "5px solid",
                                                        borderColor:
                                                            color?.hex.toLowerCase() ===
                                                                "#ffffff" ||
                                                            color?.hex.toLowerCase() ===
                                                                "white"
                                                                ? "black"
                                                                : "white",
                                                        transform:
                                                            "translate(-50%, -50%)",
                                                        boxSizing: "border-box",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                        </div>

                        {/* Custom Color Preview & Picker */}
                        <div className="flex items-center gap-4 mt-6">
                            {/* Preview Circle */}
                            {previewColor && (
                                <div
                                    className="w-12 h-12 rounded-full ring-4 ring-purple-500 shadow-md transition-transform duration-200 hover:scale-110"
                                    style={{
                                        backgroundColor: previewColor.hex,
                                    }}
                                    title="Preview color"
                                ></div>
                            )}

                            {/* Color Picker Button */}
                            <div
                                onClick={() =>
                                    document
                                        .getElementById("custom-color-input")
                                        .click()
                                }
                                className="w-12 h-12 rounded-full  
                            bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 
                            flex items-center justify-center 
                            text-white text-xl font-bold 
                            ring-2 ring-slate-300 hover:ring-slate-400 
                            shadow-sm transition-all duration-200 hover:scale-110 
                            cursor-pointer"
                            >
                                +
                                <input
                                    id="custom-color-input"
                                    type="color"
                                    className="absolute opacity-0 pointer-events-none"
                                    onChange={(e) => {
                                        setPreviewColor({
                                            ...previewColor,
                                            hex: e.target.value,
                                        });
                                    }}
                                />
                            </div>

                            {/* Add Button */}
                            {previewColor && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleAddColor();
                                    }}
                                    className="px-3 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 ring-2 ring-orange-300 animate-pulse"
                                >
                                    + Add this color
                                </button>
                            )}
                        </div>

                        <p className="text-xs text-slate-500 mt-2">
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
                                            currentVariant?.size?.name ===
                                            size?.name
                                                ? "selected"
                                                : ""
                                        }  px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200`}
                                        data-value={size?.name}
                                        onClick={() => {
                                            handleVariantSelection(
                                                "size",
                                                size
                                            );
                                        }}
                                    >
                                        {size?.name}
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
                                            currentVariant?.fit?.name ===
                                            fit?.name
                                                ? "selected"
                                                : ""
                                        }  px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200`}
                                        data-value={fit?.name}
                                        onClick={() => {
                                            handleVariantSelection("fit", fit);
                                        }}
                                    >
                                        {fit?.name}
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
                        <div
                            className="flex flex-wrap gap-3"
                            id="materialOptions"
                        >
                            {/* <!-- Material options --> */}

                            {inventoryOptions.materials.map(function (
                                material,
                                index
                            ) {
                                const isCurrent =
                                    currentVariant?.materials?.some(
                                        (curr_material) =>
                                            curr_material.id === material.id
                                    );

                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        className={`${
                                            isCurrent ? "selected" : ""
                                        } px-4 py-3 rounded-xl border-2 font-medium variant-option bg-white/50 border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 shadow-sm transition-all duration-200`}
                                        data-value={material?.name}
                                        onClick={() => {
                                            handleVariantSelection(
                                                "materials",
                                                material
                                            );
                                        }}
                                    >
                                        {material?.name}
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
                            Enter the quantity for this variant id{" "}
                            {currentVariant.id}
                        </p>
                    </div>
                    {/* <!-- update Variant Button --> */}
                    <button
                        id="addVariantBtn"
                        type="button"
                        onClick={() => {
                            addVariant(currentVariant?.id);
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
                        {updateVariantMode
                            ? "update variant"
                            : isReadyToAdd
                            ? "Add Variant"
                            : "Select all options and enter quantity"}
                    </button>
                </div>
            </>
        );
    }



export default VariantForm
