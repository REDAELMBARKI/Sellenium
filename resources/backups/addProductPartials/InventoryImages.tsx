import { useMedia } from "@/contextHooks/createProductCtxHooks/useMedia";
import { useMediaActions } from "@/functions/createFunctions/useMediaActions";
import { Plus } from "lucide-react";
import React from "react";

export default function InventoryImages({ width = 100, height = 100 }) {
  const {
    images,
    imagesPlaceHolders,
    isVariantCoverPreview,
    placeHolderNotFilled,
  } = useMedia();

  const {
    addImagePlaceHolder,
    handleImageUpload,
    handleRemoveImage,
  } = useMediaActions();

  return (
    <div className="p-3">
      <div className="space-y-6">
        {/* Images Grid */}
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
          {imagesPlaceHolders.map((index, i) => {
            const key = `cover_${index}`;
            const hasImage = images[key];

            return (
              <li
                key={i}
                style={{ width, height }}
                className={`
                  group relative overflow-hidden rounded-xl transition-all duration-300
                  ${hasImage ? "border border-purple-400 shadow-sm" : "border-2 border-dashed border-slate-300"}
                  ${placeHolderNotFilled && i === imagesPlaceHolders.length - 1 ? "!border-red-500" : ""}
                `}
              >
                {/* IMAGE EXISTS */}
                {hasImage && (
                  <>
                    <img
                      src={hasImage}
                      style={{ width: "100%", height: "100%" }}
                      className={`
                        object-cover group-hover:scale-105 transition-transform
                        ${isVariantCoverPreview ? "opacity-50" : ""}
                      `}
                    />

                    {/* Hover Drop Overlay */}
                    <div
                      role="button"
                      onClick={() => handleRemoveImage(key)}
                      className="
                        absolute inset-0 bg-black/40 text-white text-sm flex items-center justify-center
                        opacity-0 group-hover:opacity-100 z-10 cursor-pointer
                      "
                    >
                      Drop Image
                    </div>

                    {/* Small remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(key)}
                      className="
                        absolute top-1 right-1 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white
                        rounded-full p-1 shadow hidden group-hover:block z-20
                      "
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                )}

                {/* EMPTY SLOT */}
                {!hasImage && (
                  <div
                    style={{ width: "100%", height: "100%" }}
                    className="flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
                      <path d="m14 19.5 3-3 3 3" />
                      <path d="M17 22v-5.5" />
                      <circle cx="9" cy="9" r="2" />
                    </svg>
                  </div>
                )}

                {/* File input */}
                <input
                  type={hasImage ? "button" : "file"}
                  accept="image/*"
                  className={`
                    absolute inset-0 opacity-0 cursor-pointer z-30
                    ${hasImage ? "pointer-events-none" : ""}
                  `}
                  onChange={(e) => handleImageUpload(key, e.target.files[0])}
                />
              </li>
            );
          })}
        </ul>

        {/* ADD SLOT BUTTON */}
        <button
          type="button"
          onClick={addImagePlaceHolder}
          className="
            flex items-center justify-center px-4 py-2 bg-purple-600 
            text-sm font-medium rounded-lg shadow-md hover:bg-purple-700
          "
        >
          <Plus />
        </button>
      </div>
    </div>
  );
}
