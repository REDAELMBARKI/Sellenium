import React, { useState, useEffect } from "react";
import { Edit2, X, Check, Upload, Trash2 } from "lucide-react";
import UnsavedChangesToast from "@/components/editProductPartials/UnsavedChangesToast";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";

interface Color {
  id: number;
  name: string;
  hex: string;
}

interface Size {
  id: number;
  name: string;
}

interface Fit {
  id: number;
  name: string;
}

interface Material {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Variant {
  id: number;
  colors: Color[];
  sizes: Size[];
  fits: Fit[];
  materials: Material[];
  quantity: number;
  images: string[];
}

interface ProductData {
  id: number;
  name: string;
  brand: string;
  price: string;
  description: string;
  category: string;
  productType: string;
  gender: string;
  isFeatured: boolean;
  free_shipping: boolean;
  thumbnail: string;
  tags: Tag[];
  variants: Variant[];
}

interface EditProductProps {
  product: ProductData;
  inventoryOptions: {
    colors: Color[];
    sizes: Size[];
    fits: Fit[];
    materials: Material[];
  };
  tagSuggestions: Tag[];
}

export default function Edit({
  product,
  inventoryOptions,

}: EditProductProps) {
  


  const tagSuggestions = [
    {id:1 , name : 'tag1'}
  ]

  const [productData, setProductData] = useState<ProductData>(product);
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [variantToDelete, setVariantToDelete] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [basicInfoForm, setBasicInfoForm] = useState({
    name: product.name,
    brand: product.brand,
    price: product.price,
    description: product.description,
    category: product.category,
    productType: product.productType,
    gender: product.gender,
    isFeatured: product.isFeatured,
    free_shipping: product.free_shipping,
    thumbnail: product.thumbnail,
    tags: product.tags,
  });

  const [variantForm, setVariantForm] = useState<Variant | null>(null);

  useEffect(() => {
    if (hasUnsavedChanges && !showToast) {
      setShowToast(true);
    }
  }, [hasUnsavedChanges, showToast]);

  const handleEditBasicInfo = () => {
    setIsEditingBasicInfo(true);
    setBasicInfoForm({
      name: productData.name,
      brand: productData.brand,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      productType: productData.productType,
      gender: productData.gender,
      isFeatured: productData.isFeatured,
      free_shipping: productData.free_shipping,
      thumbnail: productData.thumbnail,
      tags: productData.tags,
    });
  };

  const handleSaveBasicInfo = () => {
    setProductData({
      ...productData,
      ...basicInfoForm,
    });
    setIsEditingBasicInfo(false);
    setHasUnsavedChanges(true);
  };

  const handleCancelBasicInfo = () => {
    setIsEditingBasicInfo(false);
    setBasicInfoForm({
      name: productData.name,
      brand: productData.brand,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      productType: productData.productType,
      gender: productData.gender,
      isFeatured: productData.isFeatured,
      free_shipping: productData.free_shipping,
      thumbnail: productData.thumbnail,
      tags: productData.tags,
    });
  };

  const handleEditVariant = (variant: Variant) => {
    setEditingVariantId(variant.id);
    setVariantForm({ ...variant });
  };

  const handleSaveVariant = () => {
    if (!variantForm || editingVariantId === null) return;

    setProductData({
      ...productData,
      variants: productData?.variants?.map((v) =>
        v.id === editingVariantId ? variantForm : v
      ),
    });
    setEditingVariantId(null);
    setVariantForm(null);
    setHasUnsavedChanges(true);
  };

  const handleCancelVariant = () => {
    setEditingVariantId(null);
    setVariantForm(null);
  };

  const handleDeleteVariantClick = (variantId: number) => {
    setVariantToDelete(variantId);
    setDeleteModalOpen(true);
    setDeleteConfirmText("");
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmText.toLowerCase() === "delete" && variantToDelete !== null) {
      setProductData({
        ...productData,
        variants: productData?.variants?.filter((v) => v.id !== variantToDelete),
      });
      setDeleteModalOpen(false);
      setDeleteConfirmText("");
      setVariantToDelete(null);
      setHasUnsavedChanges(true);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteConfirmText("");
    setVariantToDelete(null);
  };

  const handleSaveAllChanges = () => {
    console.log("Saving all changes:", productData);
    alert("Changes saved successfully!");
    setHasUnsavedChanges(false);
    setShowToast(false);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBasicInfoForm({
          ...basicInfoForm,
          thumbnail: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariantImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!variantForm) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVariantForm({
          ...variantForm,
          images: [...variantForm.images, reader.result as string],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVariantImage = (index: number) => {
    if (!variantForm) return;
    setVariantForm({
      ...variantForm,
      images: variantForm.images.filter((_, i) => i !== index),
    });
  };

  const toggleVariantAttribute = <T extends Color | Size | Fit | Material>(
    key: "colors" | "sizes" | "fits" | "materials",
    item: T
  ) => {
    if (!variantForm) return;

    const currentItems = variantForm[key] as T[];
    const exists = currentItems.some((i) => i.id === item.id);

    setVariantForm({
      ...variantForm,
      [key]: exists
        ? currentItems.filter((i) => i.id !== item.id)
        : [...currentItems, item],
    });
  };

  const removeTag = (tagId: number) => {
    setBasicInfoForm({
      ...basicInfoForm,
      tags: basicInfoForm?.tags?.filter((t) => t.id !== tagId),
    });
  };

  const addTag = (tag: Tag) => {
    if (!basicInfoForm?.tags?.some((t) => t.id === tag.id)) {
      setBasicInfoForm({
        ...basicInfoForm,
        tags: [...basicInfoForm.tags, tag],
      });
    }
  };

  return (
    <>
      {showToast && hasUnsavedChanges && (
        <UnsavedChangesToast
          message="Changes unsaved"
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="min-h-screen bg-slate-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Edit Product
          </h1>
          <p className="text-slate-600">Update product details and variants</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
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
                  Basic Information
                </h2>
              </div>

              {!isEditingBasicInfo ? (
                <button
                  onClick={handleEditBasicInfo}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBasicInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelBasicInfo}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  {(isEditingBasicInfo
                    ? basicInfoForm.thumbnail
                    : productData.thumbnail) && (
                    <img
                      src={
                        isEditingBasicInfo
                          ? basicInfoForm.thumbnail
                          : productData.thumbnail
                      }
                      alt="Product thumbnail"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-slate-200"
                    />
                  )}
                  {isEditingBasicInfo && (
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-300">
                      <Upload className="w-4 h-4" />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Product Name
                  </label>
                  {isEditingBasicInfo ? (
                    <input
                      type="text"
                      value={basicInfoForm.name}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {productData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Brand
                  </label>
                  {isEditingBasicInfo ? (
                    <input
                      type="text"
                      value={basicInfoForm.brand}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          brand: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {productData.brand}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Price
                  </label>
                  {isEditingBasicInfo ? (
                    <input
                      type="number"
                      step="0.01"
                      value={basicInfoForm.price}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          price: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">
                      ${productData.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Product Type
                  </label>
                  {isEditingBasicInfo ? (
                    <select
                      value={basicInfoForm.productType}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          productType: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select product type</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Shirts">Shirts</option>
                      <option value="Pants">Pants</option>
                      <option value="Jeans">Jeans</option>
                      <option value="Shorts">Shorts</option>
                      <option value="Jackets">Jackets</option>
                      <option value="Coats">Coats</option>
                      <option value="Sweaters">Sweaters</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Skirts">Skirts</option>
                      <option value="Shoes">Shoes</option>
                      <option value="Sneakers">Sneakers</option>
                      <option value="Boots">Boots</option>
                      <option value="Sandals">Sandals</option>
                      <option value="Socks">Socks</option>
                      <option value="Underwear">Underwear</option>
                      <option value="Activewear">Activewear</option>
                      <option value="Swimwear">Swimwear</option>
                    </select>
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {productData.productType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Gender
                  </label>
                  {isEditingBasicInfo ? (
                    <select
                      value={basicInfoForm.gender}
                      onChange={(e) =>
                        setBasicInfoForm({
                          ...basicInfoForm,
                          gender: e.target.value,
                        })
                      }
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      <option value="">Select gender</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  ) : (
                    <p className="text-slate-900 font-medium">
                      {productData.gender}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Description
                </label>
                {isEditingBasicInfo ? (
                  <textarea
                    rows={5}
                    value={basicInfoForm.description}
                    onChange={(e) =>
                      setBasicInfoForm({
                        ...basicInfoForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                ) : (
                  <p className="text-slate-900">{productData.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {(isEditingBasicInfo
                    ? basicInfoForm?.tags
                    : productData?.tags
                  ).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {tag.name}
                      {isEditingBasicInfo && (
                        <button
                          onClick={() => removeTag(tag.id)}
                          className="hover:text-emerald-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditingBasicInfo && tagSuggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">
                      Available tags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tagSuggestions
                        .filter(
                          (ts) => !basicInfoForm?.tags.some((t) => t.id === ts.id)
                        )
                        .map((tag) => (
                          <button
                            key={tag.id}
                            onClick={() => addTag(tag)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm transition-colors"
                          >
                            + {tag.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-8">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      isEditingBasicInfo
                        ? basicInfoForm.isFeatured
                        : productData.isFeatured
                    }
                    onChange={(e) =>
                      isEditingBasicInfo &&
                      setBasicInfoForm({
                        ...basicInfoForm,
                        isFeatured: e.target.checked,
                      })
                    }
                    disabled={!isEditingBasicInfo}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">
                    Is Featured
                  </span>
                </label>

                <label className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      isEditingBasicInfo
                        ? basicInfoForm.free_shipping
                        : productData.free_shipping
                    }
                    onChange={(e) =>
                      isEditingBasicInfo &&
                      setBasicInfoForm({
                        ...basicInfoForm,
                        free_shipping: e.target.checked,
                      })
                    }
                    disabled={!isEditingBasicInfo}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm font-medium text-slate-700">
                    Free Shipping
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
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
              <h2 className="text-2xl font-bold text-slate-800">Variants</h2>
            </div>

            <div className="space-y-6">
              {productData?.variants?.map((variant) => {
                const isEditing = editingVariantId === variant.id;
                const displayVariant = isEditing ? variantForm! : variant;

                return (
                  <div
                    key={variant.id}
                    className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Variant #{variant.id}
                      </h3>

                      <div className="flex gap-2">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditVariant(variant)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVariantClick(variant.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={handleSaveVariant}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <Check className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelVariant}
                              className="flex items-center gap-2 px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Images
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {displayVariant.images.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-20 h-20 group"
                            >
                              <img
                                src={img}
                                alt={`Variant ${idx + 1}`}
                                className="w-full h-full object-cover rounded-lg border border-slate-300"
                              />
                              {isEditing && (
                                <button
                                  onClick={() => removeVariantImage(idx)}
                                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors">
                              <Upload className="w-5 h-5 text-slate-400" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleVariantImageUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Color
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {isEditing
                            ? inventoryOptions.colors.map((color) => {
                                const isSelected = displayVariant.colors.some(
                                  (c) => c.id === color.id
                                );
                                return (
                                  <button
                                    key={color.id}
                                    type="button"
                                    onClick={() =>
                                      toggleVariantAttribute("colors", color)
                                    }
                                    className="relative w-10 h-10 rounded-full transition-all"
                                    style={{
                                      backgroundColor: color.hex,
                                      border: isSelected
                                        ? "3px solid #1e293b"
                                        : "2px solid #cbd5e1",
                                    }}
                                    title={color.name}
                                  />
                                );
                              })
                            : displayVariant.colors.map((color) => (
                                <div
                                  key={color.id}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-8 h-8 rounded-full border-2 border-slate-300"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <span className="text-sm text-slate-700">
                                    {color.name}
                                  </span>
                                </div>
                              ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {isEditing
                            ? inventoryOptions.sizes.map((size) => {
                                const isSelected = displayVariant.sizes.some(
                                  (s) => s.id === size.id
                                );
                                return (
                                  <button
                                    key={size.id}
                                    type="button"
                                    onClick={() =>
                                      toggleVariantAttribute("sizes", size)
                                    }
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                      isSelected
                                        ? "bg-blue-500 text-white border-blue-600"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                  >
                                    {size.name}
                                  </button>
                                );
                              })
                            : displayVariant.sizes.map((size) => (
                                <span
                                  key={size.id}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                                >
                                  {size.name}
                                </span>
                              ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Fit
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {isEditing
                            ? inventoryOptions.fits.map((fit) => {
                                const isSelected = displayVariant.fits.some(
                                  (f) => f.id === fit.id
                                );
                                return (
                                  <button
                                    key={fit.id}
                                    type="button"
                                    onClick={() =>
                                      toggleVariantAttribute("fits", fit)
                                    }
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                      isSelected
                                        ? "bg-green-500 text-white border-green-600"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                  >
                                    {fit.name}
                                  </button>
                                );
                              })
                            : displayVariant.fits.map((fit) => (
                                <span
                                  key={fit.id}
                                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                                >
                                  {fit.name}
                                </span>
                              ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Material
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {isEditing
                            ? inventoryOptions.materials.map((material) => {
                                const isSelected =
                                  displayVariant.materials.some(
                                    (m) => m.id === material.id
                                  );
                                return (
                                  <button
                                    key={material.id}
                                    type="button"
                                    onClick={() =>
                                      toggleVariantAttribute(
                                        "materials",
                                        material
                                      )
                                    }
                                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                                      isSelected
                                        ? "bg-amber-500 text-white border-amber-600"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                                    }`}
                                  >
                                    {material.name}
                                  </button>
                                );
                              })
                            : displayVariant.materials.map((material) => (
                                <span
                                  key={material.id}
                                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium"
                                >
                                  {material.name}
                                </span>
                              ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Quantity
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            value={displayVariant.quantity}
                            onChange={(e) =>
                              setVariantForm({
                                ...variantForm!,
                                quantity: Number(e.target.value),
                              })
                            }
                            className="w-32 p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">
                            {displayVariant.quantity} units
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSaveAllChanges}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Save All Changes
            </button>
          </div>
        </div>
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Delete Variant
              </h3>
            </div>

            <p className="text-slate-600 mb-6">
              To confirm deletion, please type <span className="font-bold text-red-600">delete</span> in the box below.
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type 'delete' to confirm"
              className="w-full p-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirmText.toLowerCase() !== "delete"}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                  deleteConfirmText.toLowerCase() === "delete"
                    ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                Delete Variant
              </button>
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}



Edit.layout = page => <AdminLayout children={page} />