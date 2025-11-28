import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { defaultEasing } from "framer-motion"
import { Check, Edit2, Upload, X } from "lucide-react";






const ProductInfoReadOnly = ({basicInfoForm , isEditingBasicInfo , productData ,setBasicInfoForm ,handleThumbnailUpload ,handleEditBasicInfo  , removeTag , addTag , tagSuggestions}) => {
    return ( <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
    
                {/* header and  model  */}
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
                   {/* model */}
                  {!isEditingBasicInfo ? ( 
                    <Button
                      variant="default"
                      onClick={handleEditBasicInfo}
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                       variant="default"
    
                        onClick={handleSaveBasicInfo}
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </Button>
                      <Button 
                        variant="default"
    
                        onClick={handleCancelBasicInfo}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
    
                <div className="space-y-6">
                  {/* image section */}
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
        
                  {/* product name and brand   */}
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
                        <Input readOnly className="text-slate-900 font-medium"  value={productData.name} />
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
                        <Input readOnly className="text-slate-900 font-medium"  value={productData.brand} />

                      )}
                    </div>
                  </div>
    
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
                    {/* price */}
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
                        <Input readOnly className="text-slate-900 font-medium"  value={"$" + productData.price} />

                      )}
                    </div>
               
                    {/* product type */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Product Type
                      </label>
                      {isEditingBasicInfo ? (
                        <select value={basicInfoForm.productType}
                          onChange={(e) =>
                            setBasicInfoForm({
                              ...basicInfoForm,
                              productType: e.target.value,
                            })
                          }
                          >
                            {
                              ["T-Shirts" , 'Pants' , 'Shoes' , 'Hoodies' , "Jeans"].map((op , i ) => {
                                return(
                                  <option key={i} value={op.toLowerCase()} >
                                    {op}
                                  </option> 
                                )
                              })
                            }
                          </select>
                      ) : (
                        <Input readOnly className="text-slate-900 font-medium"  value={productData.productType} />

                      )}
                    </div>
     
                   {/* gendere section */}
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
                        <Input readOnly className="text-slate-900 font-medium"  value={productData.gender} />

                      )}
                    </div>
                  </div>
                  {/* description */}
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
                      <textarea>{productData.description}</textarea>
                    )}
                  </div>
    
                  {/* tags section */}
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
     
    
                   {/* i featured  / shipping  */}
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
              </div>)
}


export default ProductInfoReadOnly ;