import axios from 'axios';
import React, { useEffect } from 'react'

function BasicInformationsSection({
    tagInputValue,
    setTagInputValue,
    data,
    setData,
    addSuggestedTagToSelectedOnes,
    suggestedTags,
    setSuggestedTags,
    selectedTags,
    setSelectedTags,
    handleTagRemove,
    errors
}) {



    function addTag() {
        if (tagInputValue.trim().length < 1) {
            return;
        }
        setSelectedTags([
            ...selectedTags,
            {
                id: null,
                name: tagInputValue,
            },
        ]);
    }

    function addHighlightedTag() {
    
        if (suggestedTags?.length > 0) {
            setSelectedTags([...selectedTags, suggestedTags[0]]);
            setTagInputValue('')
        } else {
            
            setSelectedTags([...selectedTags, {
                id:null,
                name:tagInputValue
            }]);
              setTagInputValue("");
            
        }
    }



    useEffect(() => {
        async function getTags() {
               try {
                   const { data: tagsData } = await axios.get("/tags/suggest", {
                       params: { q: tagInputValue },
                   });

                   if (tagsData.length > 0) {
                       setSuggestedTags([...tagsData]);
                   }
               } catch (error) {
                   console.log(error);
               }
        }
        
        
        if (tagInputValue.length > 1) {
            getTags();
        }
    },[tagInputValue])
  
    return (
        <>
            <div className="space-y-8">
                <div
                    className={`flex items-center space-x-3 p-4 border-b rounded-lg ${
                        errors.name ||
                        errors.brand ||
                        errors.description ||
                        errors.price
                            ? "bg-red-50 border-red-300"
                            : "border-slate-200"
                    }`}
                >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
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
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Product Information
                    </h2>
                    {(errors.name ||
                        errors.brand ||
                        errors.description ||
                        errors.price) && (
                        <span className="ml-auto text-sm font-medium text-red-600">
                            (required)
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="productName"
                            value={data.name}
                            onChange={function (e) {
                                setData("name", e.target.value);
                            }}
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                            placeholder="Enter product name"
                        />
                        {/* errors */}
                        {errors.name && (
                            <div className="text-red-500 text-sm">
                                {errors.name}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Brand
                        </label>
                        <input
                            type="text"
                            value={data.brand}
                            onChange={function (e) {
                                setData("brand", e.target.value);
                            }}
                            id="productBrand"
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                            placeholder="Enter brand name"
                        />
                        {/* errors */}
                        {errors.brand && (
                            <div className="text-red-500 text-sm">
                                {errors.brand}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Price
                        </label>
                        <input
                            value={data.price}
                            onChange={function (e) {
                                setData("price", e.target.value);
                            }}
                            type="number"
                            id="productPrice"
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                            placeholder="0.00"
                            step="0.01"
                        />
                        {/* errors */}
                        {errors.price && (
                            <div className="text-red-500 text-sm">
                                {errors.price}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Description
                    </label>
                    <textarea
                        id="productDescription"
                        value={data.description}
                        onChange={function (e) {
                            setData("description", e.target.value);
                        }}
                        rows="5"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 resize-none"
                        placeholder="Enter product description"
                    ></textarea>
                    {/* errors */}
                    {errors.description && (
                        <div className="text-red-500 text-sm mt-3">
                            {errors.description}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-8">
                    <label className="flex items-center group cursor-pointer">
                        <input
                            type="checkbox"
                            value={data.isFeatured}
                            onChange={function (e) {
                                setData("isFeatured", e.target.checked);
                            }}
                            id="isFeatured"
                            className="w-5 h-5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            Is Featured
                        </span>
                    </label>

                    <label className="flex items-center group cursor-pointer">
                        <input
                            value={data.free_shipping}
                            onChange={function (e) {
                                setData("free_shipping", e.target.checked);
                            }}
                            type="checkbox"
                            id="freeShipping"
                            className="w-5 h-5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            Free Shipping
                        </span>
                    </label>
                </div>
            </div>

            {/* <!-- Tags Section --> */}
            <div className="space-y-6">
                <div
                    className={`flex items-center space-x-3 p-4 border-b rounded-md ${
                        errors.tags
                            ? "bg-red-50 border-red-300"
                            : "border-slate-200"
                    }`}
                >
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
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
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">
                                Tags
                            </h2>
                            {errors.tags && (
                                <span className="text-red-600 text-sm font-medium">
                                    (required)
                                </span>
                            )}
                            <a
                                href="/tags/create"
                                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-400 px-3 py-1.5 rounded-xl transition duration-150"
                            >
                                + Add new tags
                            </a>
                        </div>

                        <p className="mt-1 text-xs text-slate-500 italic">
                            New tags you add will be saved to the database and
                            available for you later on.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative w-full">
                        <input
                            type="text"
                            id="tagInput"
                            value={tagInputValue}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    addHighlightedTag();
                                }
                            }}
                            onChange={(e) => setTagInputValue(e.target.value)}
                            className="w-full p-4 pr-16 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                            placeholder="Type to search or add tags..."
                        />

                        <button
                            type="button"
                            onClick={addTag}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-1.5 rounded-lg shadow"
                        >
                            Add
                        </button>
                    </div>

                    {errors.tags && (
                        <div className="text-red-500 text-sm">
                            {errors.tags}
                        </div>
                    )}

                    <div
                        id="tagSuggestions"
                        className={`absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl ${
                            suggestedTags?.length > 0 ? "" : "hidden"
                        }`}
                    >
                        {suggestedTags && (
                            <ul className="flex flex-wrap gap-2 p-2">
                                {suggestedTags.map((tag, index) => (
                                    <li
                                        type="button"
                                        key={index}
                                        onClick={() =>
                                            addSuggestedTagToSelectedOnes(tag)
                                        }
                                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-150 ${
                                            index === 0
                                                ? "border border-emerald-400 bg-slate-100 text-slate-800 shadow-sm"
                                                : "border border-slate-200 bg-slate-100 text-slate-700"
                                        } hover:bg-white`}
                                    >
                                        {tag?.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div id="selectedTags" className="flex flex-wrap gap-3">
                    {selectedTags
                        ? selectedTags.map(function (tag, index) {
                              return (
                                  <span
                                      className="tag-item slide-in"
                                      key={index}
                                  >
                                      {tag?.name}

                                      <button
                                          type="button"
                                          className="tag-remove"
                                          onClick={() => {
                                              handleTagRemove(index);
                                          }}
                                      >
                                          ×
                                      </button>
                                  </span>
                              );
                          })
                        : ""}
                </div>
            </div>
        </>
    );
}

export default BasicInformationsSection