import React, { useState, useRef, useEffect } from "react";
// import '../../logic/createProduct';
import "../../../css/createProduct.css";
import Layout from "@/Layouts/Layout";
import { useForm } from "@inertiajs/react";
import VariantForm from "@/components/productPartials/VariantForm";
import VariantsList from "@/components/productPartials/VariantsList";
import AddImagesSection from "@/components/productPartials/AddImagesSection";
import BasicInformationsSection from "@/components/productPartials/BasicInformationsSection";
function Create() {
    const { data, setData } = useForm({
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
        tags: [],
    });
    const [tagInputValue, setTagInputValue] = useState("");
    // tags elements
    const [selectedTags, setSelectedTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [images, setImages] = useState({});
    const [imagesPlaceHolders, setImagesPlaceHolders] = useState([]);
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
    const variantFormRef = useRef(null)

    // inventory ====================================================================
    const inventoryOptions = {
        colors: [
            { name: "Red", value: "red", color: "bg-red-500" },
            { name: "Blue", value: "blue", color: "bg-blue-500" },
            { name: "Green", value: "green", color: "bg-green-500" },
            { name: "Black", value: "black", color: "bg-black" },
            {
                name: "White",
                value: "white",
                color: "bg-white border-2 border-gray-300",
            },
            { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
            { name: "Purple", value: "purple", color: "bg-purple-500" },
            { name: "Pink", value: "pink", color: "bg-pink-500" },
        ],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        fits: ["Slim", "Regular", "Loose", "Oversized"],
        materials: [
            "Cotton",
            "Polyester",
            "Silk",
            "Wool",
            "Linen",
            "Denim",
            "Leather",
            "Canvas",
        ],
    };
    const [productVariants, setProductVariants] = useState([]);
    // variants
    const [currentVariant, setCurrentVariant] = useState({
        color: null,
        size: null,
        fit: null,
        material: null,
        quantity: 1,
    });

    // add variant button
    const isReadyToAdd = Object.values(currentVariant).every(
        (value) => value !== null && value !== ""
    );
    // end inventry variablles ================================================================

    useEffect(() => {
        if (tagInputValue.length >= 2) {
            const filteredSuggestions = tagSuggestions.filter(
                (suggestion) =>
                    suggestion
                        .toLowerCase()
                        .includes(tagInputValue.toLowerCase()) &&
                    !selectedTags.includes(suggestion)
            );
            setSuggestedTags(filteredSuggestions);
        } else {
            // Clear suggestions if less than 2 chars
            setSuggestedTags([]);
        }
    }, [tagInputValue, selectedTags]);

    function handleTagRemove(tagToRemove) {
        const tags = selectedTags.filter((_, index) => index !== tagToRemove);
        setSelectedTags(tags);
    }

    function addSuggestedTagToSelectedOnes(tag) {
        setSelectedTags([...selectedTags, tag]);
        setTagInputValue("");
    }

    // end tags logic

    //start image uploads

    function handleImageUpload(field, file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages((prevImages) => ({
                    ...prevImages,
                    [field]: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        const temp = [];
        for (let i = 1; i < 5; i++) {
            temp.push(i);
        }
        setImagesPlaceHolders(temp);
    }, []);
    // add other place holders

    function addImagePlaceHolder() {
        const newPlaceHolder = imagesPlaceHolders.length + 1;
        setImagesPlaceHolders([...imagesPlaceHolders, newPlaceHolder]);

        console.log(imagesPlaceHolders);
    }
    
    // inventory logic ===========================
    function addVariant() {
        // Check if variant already exists
        const variantExists = productVariants.some(
            function (variant) {
                      return (
                          variant.color.value === currentVariant.color.value &&
                          variant.size === currentVariant.size &&
                          variant.fit === currentVariant.fit &&
                          variant.material === currentVariant.material
                      );
                }
                      
            );
            
            if (variantExists) {
                    alert(
                            "This variant combination already exists! Please select different options."
                    );
               
                    return;
            }
         
             

        // // Add variant to list
        const newVariant = {
            id: Date.now(),
            color: currentVariant.color,
            size: currentVariant.size,
            fit: currentVariant.fit ,
            material: currentVariant.material ,
            quantity: currentVariant.quantity,
        };
        setProductVariants([...productVariants, newVariant]);

        // Reset form
        resetVariantForm();
        // Show success message
        // showToast("Variant added successfully!", "success");
    }
    useEffect(() => {
        console.log(productVariants)
    }, [productVariants])
    
    function resetVariantForm() {
        // Reset current variant
        setCurrentVariant({
            color: null,
            size: null,
            fit: null,
            material: null,
            quantity: 1,
        });
    }

    function handleVariantSelection(type, option) {
        setCurrentVariant((prev) => ({
            ...prev,
            [type]: option,
        }));
    }
   
    function scrollToVariantForm() {
        if (variantFormRef) {
            variantFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // remove variant 
    function removeVariant(id){
        
    }
    
    // end inventroy logic  ===============================

    return (
        <Layout currentPage="home">
            {/* info section */}
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

                        <BasicInformationsSection
                            addSuggestedTagToSelectedOnes={
                                addSuggestedTagToSelectedOnes
                            }
                            setTagInputValue={setTagInputValue}
                            setData={setData}
                            handleTagRemove={handleTagRemove}
                            tagInputValue={tagInputValue}
                            data={data}
                            selectedTags={selectedTags}
                            suggestedTags={suggestedTags}
                        />
                        {/* <!-- Images Section --> */}
                        <AddImagesSection
                            addImagePlaceHolder={addImagePlaceHolder}
                            handleImageUpload={handleImageUpload}
                            images={images}
                            imagesPlaceHolders={imagesPlaceHolders}
                        />

                        {/* <!-- Inventory Section variantForm --> */}
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
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Inventory Management
                                </h2>
                            </div>

                            {/* <!-- Variant Creation Form --> */}
                            <VariantForm
                                inventoryOptions={inventoryOptions}
                                currentVariant={currentVariant}
                                handleVariantSelection={handleVariantSelection}
                                addVariant={addVariant}
                                isReadyToAdd={isReadyToAdd}
                                setCurrentVariant={setCurrentVariant}
                                variantFormRef={variantFormRef}
                            />
                            {/* <!-- Variants List --> */}
                            <VariantsList
                                removeVariant={removeVariant}
                                productVariants={productVariants}
                                scrollToVariantForm={scrollToVariantForm}
                            />
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

export default Create;
