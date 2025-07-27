import React ,{useState , useRef , useEffect} from 'react'
import '../../logic/createProduct';
import '../../../css/createProduct.css';
import Layout from '@/Layouts/Layout';
import { useForm } from '@inertiajs/react';
function Create() {
    const { productData, setProductData } = useForm({
        name: "",
        brand: "",
        price: "",
        thumbnail: "",
        cover_1: "",
        cover_2: "",
        cover_3: "",
        cover_4: "",
        description: "",
        isFeatured: false,
        free_shipping: false,
        inventrory: [],
        tags : []
    });
    const [tagInputValue, setTagInputValue] = useState("");
    // tags elements 
    const [selectedTags, setSelectedTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);

    const tagSuggestions = [
        "Electronics",
        "Fashion",
        "Sports",
        "Home",
        "Beauty",
        "Books",
        "Toys",
        "Automotive",
        "Health",
        "Garden",
        "Kitchen",
        "Office",
    ];

    
    useEffect(() => {
        const filteredSuggestions = tagSuggestions.filter(
            (suggestion) =>
                suggestion
                    .toLowerCase()
                    .includes(tagInputValue.toLowerCase()) &&
                !selectedTags.includes(suggestion)
        );
        setSuggestedTags(filteredSuggestions);
    }, [tagInputValue])
    
    function handleTagRemove(tagToRemove) {
        tags = selectedTags.filter((index, tag) => index !== tagToRemove);
        renderTags();
    }
    function handleTagInput(e) {
        
        const suggestionsContainer = document.getElementById("tagSuggestions");

        if (input) {
            const filteredSuggestions = tagSuggestions.filter(
                (suggestion) =>
                    suggestion.toLowerCase().includes(input.toLowerCase()) &&
                    !tags.includes(suggestion)
            );

            if (filteredSuggestions.length > 0) {
                suggestionsContainer.innerHTML = "";
                filteredSuggestions.slice(0, 5).forEach((suggestion) => {
                    const button = document.createElement("button");
                    button.className = "suggestion-item";
                    button.textContent = suggestion;
                    button.addEventListener("click", () =>
                        handleTagAdd(suggestion)
                    );
                    suggestionsContainer.appendChild(button);
                });
                suggestionsContainer.classList.remove("hidden");
                suggestionsContainer.classList.add("fade-in");
            } else {
                suggestionsContainer.classList.add("hidden");
            }
        } else {
            suggestionsContainer.classList.add("hidden");
        }
    }
  return (
      <Layout currentPage="home">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
              <div className="max-w-5xl mx-auto px-6">
                  <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                          Add New Product
                      </h1>
                      <p className="text-slate-600 text-lg">
                          Create and manage your product inventory
                      </p>
                  </div>

                  <form className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-10 space-y-10">
                      {/* <!-- Basic Product Information --> */}

                      <div className="space-y-8">
                          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                  <svg
                                      className="w-4 h-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                  >
                                      <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                  </svg>
                              </div>
                              <h2 className="text-2xl font-bold text-slate-800">
                                  Product Information
                              </h2>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                                      Product Name
                                  </label>
                                  <input
                                      type="text"
                                      id="productName"
                                      value={productData.name}
                                      onChange={function (e) {
                                          setProductData(
                                              "name",
                                              e.target.value
                                          );
                                      }}
                                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                                      placeholder="Enter product name"
                                  />
                              </div>

                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                                      Brand
                                  </label>
                                  <input
                                      type="text"
                                      value={productData.brand}
                                      onChange={function (e) {
                                          setProductData(
                                              "brand",
                                              e.target.value
                                          );
                                      }}
                                      id="productBrand"
                                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                                      placeholder="Enter brand name"
                                  />
                              </div>

                              <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                                      Price
                                  </label>
                                  <input
                                      value={productData.price}
                                      onChange={function (e) {
                                          setProductData(
                                              "price",
                                              e.target.value
                                          );
                                      }}
                                      type="number"
                                      id="productPrice"
                                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                                      placeholder="0.00"
                                      step="0.01"
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-3">
                                  Description
                              </label>
                              <textarea
                                  id="productDescription"
                                  value={function () {
                                      productData.description = e.target.value;
                                  }}
                                  rows="5"
                                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 resize-none"
                                  placeholder="Enter product description"
                              ></textarea>
                          </div>

                          <div className="flex flex-wrap gap-8">
                              <label className="flex items-center group cursor-pointer">
                                  <input
                                      type="checkbox"
                                      value={productData.isFeatured}
                                      onChange={function (e) {
                                          setProductData(
                                              "isFeatured",
                                              e.target.checked
                                          );
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
                                      value={productData.free_shipping}
                                      onChange={function (e) {
                                          setProductData(
                                              "free_shipping",
                                              e.target.value
                                          );
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
                          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                  <svg
                                      className="w-4 h-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                  >
                                      <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                      />
                                  </svg>
                              </div>
                              <h2 className="text-2xl font-bold text-slate-800">
                                  Tags
                              </h2>
                          </div>

                          <div className="relative">
                              <input
                                  type="text"
                                  id="tagInput"
                                  value={tagInputValue}
                                  onChange={function (e) {
                                      setTagInputValue(e.target.value);
                                  }}
                                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:bg-white/80"
                                  placeholder="Type to search tags..."
                              />

                              <div
                                  id="tagSuggestions"
                                  className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl hidden"
                              >
                                  {/* onClick={addTags} */}

                                  {suggestedTags.map((index, tag) => {
                                      <button
                                          key={index}
                                          onClick={setSelectedTags([
                                              ...selectedTags,
                                              tag,
                                          ])}
                                          className="suggestion-item"
                                      >
                                          {tag}
                                      </button>;
                                  })}
                              </div>
                          </div>

                          <div
                              id="selectedTags"
                              className="flex flex-wrap gap-3"
                          >
                              <ul>
                                  {selectedTags
                                      ? selectedTags.map((index, tag) => {
                                            <li key={index}>
                                                <span className="tag-item slide-in">
                                                    ${tag}
                                                </span>
                                                <button
                                                    class="tag-remove"
                                                    onclick={handleTagRemove(index)}
                                                >
                                                    ×
                                                </button>
                                            </li>;
                                        })
                                      : ""}
                              </ul>
                          </div>
                      </div>

                      {/* <!-- Images Section --> */}
                      <div className="space-y-6">
                          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                  <svg
                                      className="w-4 h-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                  >
                                      <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                  </svg>
                              </div>
                              <h2 className="text-2xl font-bold text-slate-800">
                                  Product Images
                              </h2>
                          </div>

                          <div
                              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                              id="imageGrid"
                          >
                              {/* <!-- Image slots will be generated by JavaScript --> */}
                          </div>
                      </div>

                      {/* <!-- Inventory Section --> */}
                      <div className="space-y-8">
                          <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                  <svg
                                      className="w-4 h-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                  >
                                      <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                      />
                                  </svg>
                              </div>
                              <h2 className="text-2xl font-bold text-slate-800">
                                  Inventory Management
                              </h2>
                          </div>

                          {/* <!-- Variant Creation Form --> */}
                          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl p-6 border border-slate-200">
                              <h3 className="text-lg font-semibold text-slate-800 mb-6">
                                  Create Product Variant
                              </h3>

                              {/* <!-- Colors --> */}
                              <div className="space-y-4 mb-6">
                                  <label className="block text-sm font-semibold text-slate-700">
                                      Color
                                  </label>
                                  <div
                                      className="flex flex-wrap gap-4"
                                      id="colorOptions"
                                  >
                                      {/* <!-- Color options will be generated by JavaScript --> */}
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
                                  <div
                                      className="flex flex-wrap gap-3"
                                      id="sizeOptions"
                                  >
                                      {/* <!-- Size options will be generated by JavaScript --> */}
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
                                  <div
                                      className="flex flex-wrap gap-3"
                                      id="fitOptions"
                                  >
                                      {/* <!-- Fit options will be generated by JavaScript --> */}
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
                                      {/* <!-- Material options will be generated by JavaScript --> */}
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
                                  onClick={addVariant}
                                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-200 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                  disabled
                              >
                                  Add Variant
                              </button>
                          </div>

                          {/* <!-- Variants List --> */}
                          <div id="variantsList" className="hidden">
                              <div className="flex items-center justify-between mb-6">
                                  <h3 classNameName="text-lg font-semibold text-slate-800">
                                      Product Variants
                                  </h3>
                                  <div className="flex items-center space-x-4">
                                      <span
                                          id="variantCount"
                                          className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full"
                                      >
                                          0 variants
                                      </span>
                                      <button
                                          id="addNewVariantBtn"
                                          onClick={scrollToVariantForm}
                                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 focus:ring-4 focus:ring-green-200 font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                      >
                                          Add New Variant
                                      </button>
                                  </div>
                              </div>
                              <div id="variantsContainer" className="space-y-4">
                                  {/* <!-- Variants will be added here --> */}
                              </div>
                          </div>
                      </div>

                      {/* <!-- Save Button --> */}
                      <div className="pt-8 border-t border-slate-200">
                          <button
                              id="saveProduct"
                              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                              Save Product
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </Layout>
  );
}

export default Create


