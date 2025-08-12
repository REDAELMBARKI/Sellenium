import React, { useState, useRef, useEffect } from "react";
// import '../../logic/createProduct';
import "../../../css/createProduct.css";
import Layout from "@/Layouts/Layout";
import { useForm ,usePage } from "@inertiajs/react";
import VariantForm from "@/components/addProductPartials/VariantForm";
import VariantsList from "@/components/addProductPartials/VariantsList";
import AddImagesSection from "@/components/addProductPartials/AddImagesSection";
import BasicInformationsSection from "@/components/addProductPartials/BasicInformationsSection";
import axios from "axios";
import isEqual from "lodash/isEqual";
import { forEach } from "lodash";
function Create({ tagSuggestions, inventoryOptions }) {
    const { data, setData, post, errors } = useForm({
        name: "",
        brand: "",
        price: "",
        thumbnail: "",
        description: "",
        isFeatured: false,
        free_shipping: false,
        inventory: [],
        tags: [],
    });

    // checkeers for data submit
    const [imagesValid, setImagesValid] = useState(false);
    const [tagsValid, setTagsValid] = useState(false);
    const [inventoryValid, setInventoryValid] = useState(false);
    const [otherStringFieldsValid, setOtherStringFieldsValid] = useState(true);
    const [newSelectedColors, setNewSelectedColors] = useState([]);
    const [updateVariantMode, setUpdateVariantMode] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    const [placeHolderNotFilled, setPlaceHolderNotFilled] = useState(false);
    const [isReadyToSubmit, setIsReadyToSubmit] = useState({
        bool: false,
        name: false,
        brand: false,
        description: false,
        price: false,
        tags: false,
        thumbnail: false,
        inventory: false,
    });

    const [tagInputValue, setTagInputValue] = useState("");
    // tags elements
    const [selectedTags, setSelectedTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [images, setImages] = useState({});
    const [imagesPlaceHolders, setImagesPlaceHolders] = useState([]);
    const [isVariantCoverPreview, setIsVariantCoverPreview] = useState(false);
    const variantFormRef = useRef(null);
    const [isCurrentVariantActive, setIsCurrentVariantActive] = useState(false);
    const [fileToPass, setFileToPass] = useState(null);
    const [isAllcoversDeleted, setIsAllcoversDeleted] = useState(false);
    // inventory ====================================================================

    const [productVariants, setProductVariants] = useState([]);
    // variants
    const [currentVariant, setCurrentVariant] = useState({
        id: null,
        colors: [],
        size: null,
        fit: null,
        materials: [],
        quantity: 1,
        covers: [],
    });

    // add variant button

    const isReadyToAdd = Object.entries(currentVariant)
        .filter(([key]) => key !== "id" && key !== "covers")
        .every(
            ([, value]) =>
                value !== null &&
                value !== "" &&
                (!Array.isArray(value) || value.length > 0)
        );
    // end inventry variablles ================================================================

    useEffect(() => {
        if (tagInputValue.length >= 2) {
            const filteredSuggestions = tagSuggestions?.filter(
                (suggestion) =>
                    suggestion.name
                        .toLowerCase()
                        .includes(tagInputValue.toLowerCase()) &&
                    !selectedTags.some(
                        (selectedTag) => selectedTag.name === suggestion.name
                    )
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
    function fileToDataUrl(file) {
        if (file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }
    }
    function handleImageUpload(field, file) {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const base64 = e.target.result;

            setImages((prevImages) => ({
                ...prevImages,
                [field]: base64,
            }));

            if (field === "thumbnail") {
                setData((prev) => ({
                    ...prev,
                    [field]: file,
                }));
                setFileToPass(base64);

                if (!images.cover_1) {
                     setIsVariantCoverPreview(true);
                }
            }

            //  other covers
            else if (field.startsWith("cover_")) {
                setCurrentVariant((prev) => ({
                    ...prev,
                    covers: [...(prev.covers || []), { [field]: file }],
                }));
                setIsVariantCoverPreview(false);
            }
        };

        reader.readAsDataURL(file);
    }


    useEffect(() => {
        if (typeof setImages !== "function") return;

        // If variant inactive → remove cover_1
        if (!isCurrentVariantActive) {
            setImages((prev) => ({
                ...prev,
                cover_1: null,
            }));
        }
        // If active and no manual cover, use thumbnail
        else if (images.thumbnail && !images.cover_1) {
            setImages((prevImages) => ({
                ...prevImages,
                cover_1: prevImages.thumbnail,
            }));
        }
    }, [isCurrentVariantActive, images.thumbnail]);


    // Optional: Async fileToPass logic, but only if no manual cover exists

    useEffect(() => {
        if (!isCurrentVariantActive ) return;

        if (!images.cover_1 && fileToPass !== null) {
            if (isCurrentVariantActive && isAllcoversDeleted) {
                setImages((prev) => ({
                    ...prev,
                    cover_1: fileToPass,
                }));
            }
        }
    }, [isAllcoversDeleted, isCurrentVariantActive]);
 


    // initial palce holders
    useEffect(() => {
        const temp = [];
        for (let i = 1; i < 2; i++) {
            temp.push(i);
        }
        setImagesPlaceHolders(temp);
    }, []);
    // add other place holders

    function addImagePlaceHolder() {
        const cover_field = Object.keys(currentVariant.covers);
        // prevent adding place holders if a place holder a vailiable
        if (cover_field.length === imagesPlaceHolders.length) {
            const newPlaceHolder = imagesPlaceHolders.length + 1;
            setImagesPlaceHolders([...imagesPlaceHolders, newPlaceHolder]);
        } else {
            setPlaceHolderNotFilled(true);

            setTimeout(() => {
                setPlaceHolderNotFilled(false);
            }, 200);
        }
    }

    // remove image
    function handleRemoveImage(field) {
        
        
        // delete ffrom iamges placeholders
        setImages({
            ...images,
            [field]: null,
        });

        // delete from data
        if (field === "thumbnail") {
            setData({
                ...data,
                [field]: null,
            });

            if (isVariantCoverPreview) {
                setImages({});
                setIsVariantCoverPreview(false);
            }
        } else {
            const covers = currentVariant.covers.filter(function (cover) {
                return !cover.hasOwnProperty(field);
            });

            setCurrentVariant((prev) => ({
                ...prev,
                covers: covers,
            }));

            setImages({
                ...images,
                [field]: null,
            });

            if (currentVariant.covers.length - 1 === 0) {
                console.log(isAllcoversDeleted)
                setIsAllcoversDeleted(true);
            }
        }


        // remove place holderrs is after deleting the cover
        
   
    }

    // inventory logic ===========================
    function addVariant(id = null) {
        // Check if variant already exists
        let allfieldsFilled = Object.entries(currentVariant)
            .filter(([key]) => key !== "covers")
            .every(function ([_, fieldValue]) {
                return (
                    fieldValue?.name !== "" &&
                    fieldValue?.name !== null &&
                    (!Array.isArray(fieldValue) || fieldValue.length > 0)
                );
            });

        if (!allfieldsFilled) {
            return;
        }

        const sameCoversVariant = (curr_covers, variant_covers) => {
            if (curr_covers.length !== variant_covers.length) {
                return false;
            }

            return (
                variant_covers.every((var_cover) =>
                    curr_covers.some((curr_cover) =>
                        isEqual(curr_cover, var_cover)
                    )
                ) &&
                curr_covers.every((curr_cover) =>
                    variant_covers.some((var_cover) =>
                        isEqual(var_cover, curr_cover)
                    )
                )
            );
        };

        const sameMaterialVariant = (curr_materials, variant_materials) => {
            if (curr_materials.length !== variant_materials.length) {
                return false;
            }

            return (
                variant_materials.every((var_mat) =>
                    curr_materials.some((curr_mat) =>
                        isEqual(curr_mat, var_mat)
                    )
                ) &&
                curr_materials.every((curr_mat) =>
                    variant_materials.some((var_mat) =>
                        isEqual(var_mat, curr_mat)
                    )
                )
            );
        };

        const sameColorVariant = (curr_colors, variant_colors) => {
            if (curr_colors.length !== variant_colors.length) {
                return false;
            }

            return (
                variant_colors.every((var_color) =>
                    curr_colors.some((curr_color) =>
                        isEqual(curr_color, var_color)
                    )
                ) &&
                curr_colors.every((curr_color) =>
                    variant_colors.some((var_color) =>
                        isEqual(var_color, curr_color)
                    )
                )
            );
        };

        const sameColor = productVariants.some(function (variant) {
            return (
                Array.isArray(currentVariant.colors) &&
                Array.isArray(variant.colors) &&
                sameColorVariant(currentVariant.colors, variant.colors)
            );
        });

        const sameMaterial = productVariants.some(function (variant) {
            return (
                Array.isArray(currentVariant.materials) &&
                Array.isArray(variant.materials) &&
                sameMaterialVariant(currentVariant.materials, variant.materials)
            );
        });

        const sameCovers = productVariants.some(function (variant) {
            // console.log(variant);
            return (
                Array.isArray(currentVariant.covers) &&
                Array.isArray(variant.covers) &&
                sameCoversVariant(currentVariant.covers, variant.covers)
            );
        });

        let variantExists;

        // this checkes if the uodateded values are difffirence then the originals before
        // if we update and no changes the elements styls the same
        // if only changes made then we update
        if (updateVariantMode) {
            var updatedVariant = productVariants.find(
                (variant) => variant.id === id
            );

            variantExists =
                sameCovers &&
                sameColor &&
                sameMaterial &&
                productVariants
                    .filter((obj) => obj.id !== updatedVariant.id)
                    .some((variant) => {
                        return (
                            variant.size === currentVariant.size &&
                            variant.fit === currentVariant.fit
                        );
                    });
        } else {
            variantExists =
                sameCovers &&
                sameColor &&
                sameMaterial &&
                productVariants.some((variant) => {
                    return (
                        variant.size === currentVariant.size &&
                        variant.fit === currentVariant.fit
                    );
                });
        }

        if (variantExists) {
            alert(
                "This variant combination already exists! Please select different options."
            );

            return;
        }

        if (updateVariantMode) {
            // just update
            setProductVariants((prevVariants) =>
                prevVariants.map((variant) => {
                    if (variant.id === currentVariant.id) {
                        const updated = { ...variant, ...currentVariant };
                        return updated;
                    }
                    return variant;
                })
            );

            setUpdateVariantMode(false);
        } else {
            const newVariant = {
                id: Date.now(),
                colors: currentVariant.colors,
                size: currentVariant.size,
                fit: currentVariant.fit,
                materials: currentVariant.materials,
                quantity: currentVariant.quantity,
                covers: currentVariant.covers,
            };
            setProductVariants([...productVariants, newVariant]);
            // update the evariants ib data
        }

        // Reset form
        resetVariantForm();
        // Show success message
        // showToast("Variant added successfully!", "success");
    }

    useEffect(() => {
        // update the evariants ib data
        setData({
            ...data,
            inventory: productVariants,
            tags: selectedTags,
        });
    }, [productVariants, selectedTags]);

    function resetVariantForm() {
        // Reset current variant
        setCurrentVariant({
            id: null,
            colors: [],
            size: null,
            fit: null,
            materials: [],
            quantity: 1,
            covers: [],
        });

        // reset images
        (async () => {
            setImages((prev) => {
                return Object.fromEntries(
                    Object.entries(prev).map(([key, value]) =>
                        key.startsWith("cover_") ? [key, null] : [key, value]
                    )
                );
            });
        })();

        // reset placeHolders to one placeholder cover_1
        setImagesPlaceHolders([1]);
    }

    function handleVariantSelection(type, option) {
        // option is an object
        //    opt_id ia optioon id like option is hex and op_id is its id

        if (type === "colors") {
            let colorExist = false;

            for (let obj of currentVariant.colors) {
                if (obj.hex === option.hex) {
                    colorExist = true;
                }
            }

            if (colorExist) {
                setCurrentVariant((prev) => ({
                    ...prev,
                    colors: currentVariant.colors.filter(
                        (obj) => obj.hex !== option.hex
                    ),
                }));
            } else {
                setCurrentVariant((prev) => ({
                    ...prev,
                    colors: [...prev.colors, option],
                }));
            }
        } else if (type === "materials") {
            let materailExist = false;

            for (let obj of currentVariant.materials) {
                if (obj.id === option.id) {
                    materailExist = true;
                }
            }

            if (materailExist) {
                setCurrentVariant((prev) => ({
                    ...prev,
                    materials: currentVariant.materials.filter(
                        (obj) => obj.id !== option.id
                    ),
                }));
            } else {
                setCurrentVariant((prev) => ({
                    ...prev,
                    materials: [...prev.materials, option],
                }));
            }
        } else {
            if (currentVariant[type] === option) {
                setCurrentVariant((prev) => ({
                    ...prev,
                    [type]: null,
                }));
            } else {
                setCurrentVariant((prev) => ({
                    ...prev,
                    [type]: option,
                }));
            }
        }
    }

    function scrollToVariantForm() {
        if (variantFormRef) {
            variantFormRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    // remove variant
    function removeVariant(id) {
        // productVariants

        setProductVariants((prev) => {
            return prev.filter((el) => el.id !== id);
        });

        if (id === currentVariant?.id) {
            resetVariantForm();
        }

        setUpdateVariantMode(false);
    }

    // end inventroy logic  ===============================

    // check if all fields are good
    useEffect(() => {
        if (selectedTags.length > 0) {
            setTagsValid(true);
        } else {
            setTagsValid(false);
        }

        if (productVariants.length > 0) {
            setInventoryValid(true);
        } else {
            setInventoryValid(false);
        }
    }, [selectedTags, productVariants]);

    // chck info fields info and thumbnail
    useEffect(() => {
        const fields = [
            data.name,
            data.brand,
            data.price,
            data.description,
            data.thumbnail,
        ];

        const allFilled = fields.every(
            (field) => field !== "" && field !== null && field !== undefined
        );

        setOtherStringFieldsValid(allFilled);

        // for missing fields tracking
        const updatedState = {};

        Object.keys(isReadyToSubmit)
            .filter((el) => el !== "bool")
            .forEach(function (field) {
                if (field === "tags") {
                    updatedState["tags"] = selectedTags.length > 0;
                } else if (field === "inventory") {
                    updatedState["inventory"] = productVariants.length > 0;
                } else {
                    updatedState[field] =
                        data[field] !== "" &&
                        data[field] !== null &&
                        data[field] !== undefined;
                }
            });

        setIsReadyToSubmit((prev) => ({
            ...prev,
            ...updatedState,
        }));

        // sice tembnail is set also so
        setImagesValid(allFilled);
    }, [data, selectedTags, productVariants]);

    // check if the all ready to submit
    useEffect(() => {
        setIsReadyToSubmit((prev) => ({
            ...prev,
            bool: [
                otherStringFieldsValid,
                imagesValid,
                tagsValid,
                inventoryValid,
            ].every((section) => section === true),
        }));
    }, [otherStringFieldsValid, imagesValid, tagsValid, inventoryValid]);

    // submit form
    function submitForm(e) {
        e.preventDefault();

        (async () => {
            try {
                post("/products", {
                    preserveScroll: true,
                    onError: (errors) => {
                        const keys = ["colors", "materials", "fit", "size"];

                        setProductVariants((prevVariants) =>
                            prevVariants.map((variant, index) => {
                                const hasErrors = keys.some((key) => {
                                    const error =
                                        errors[`inventory.${index}.${key}`];
                                    return (
                                        typeof error === "string" &&
                                        error.trim() !== ""
                                    );
                                });

                                return {
                                    ...variant,
                                    hasErrors,
                                };
                            })
                        );
                    },
                });
            } catch (error) {
                console.error(
                    "Error submitting product:",
                    error.response?.data || error.message
                );
                // Optional: show error to user
            }
        })();
    }

    // consoles

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
                            setSelectedTags={setSelectedTags}
                            // sunmition eerrors
                            errors={errors}
                            setSuggestedTags={setSuggestedTags}
                        />
                        {/* <!-- thumbnail Section --> */}
                        <AddImagesSection
                            title="Thumbnail"
                            forInventory={false}
                            addImagePlaceHolder={addImagePlaceHolder}
                            handleImageUpload={handleImageUpload}
                            handleRemoveImage={handleRemoveImage}
                            images={images}
                            imagesPlaceHolders={[]}
                            errors={errors}
                        />

                        {/* <!-- Inventory Section variantForm --> */}
                        <div className="space-y-8">
                            {/* <!-- Variant Creation Form --> */}
                            <VariantForm
                                inventoryOptions={inventoryOptions}
                                currentVariant={currentVariant}
                                handleVariantSelection={handleVariantSelection}
                                addVariant={addVariant}
                                isReadyToAdd={isReadyToAdd}
                                setCurrentVariant={setCurrentVariant}
                                variantFormRef={variantFormRef}
                                newSelectedColors={newSelectedColors}
                                setNewSelectedColors={setNewSelectedColors}
                                updateVariantMode={updateVariantMode}
                                //submision errors
                                errors={errors}
                                isFlashing={isFlashing}
                                // for covers container
                                addImagePlaceHolder={addImagePlaceHolder}
                                handleImageUpload={handleImageUpload}
                                handleRemoveImage={handleRemoveImage}
                                images={images}
                                setImages={setImages}
                                imagesPlaceHolders={imagesPlaceHolders}
                                placeHolderNotFilled={placeHolderNotFilled}
                                isVariantCoverPreview={isVariantCoverPreview}
                                setIsVariantCoverPreview={
                                    setIsVariantCoverPreview
                                }
                                isCurrentVariantActive={isCurrentVariantActive}
                                setIsCurrentVariantActive={
                                    setIsCurrentVariantActive
                                }
                            />
                            {/* <!-- Variants List --> */}
                            <VariantsList
                                removeVariant={removeVariant}
                                productVariants={productVariants}
                                scrollToVariantForm={scrollToVariantForm}
                                setCurrentVariant={setCurrentVariant}
                                currentVariant={currentVariant}
                                setUpdateVariantMode={setUpdateVariantMode}
                                setIsFlashing={setIsFlashing}
                                errors={errors}
                                setProductVariants={setProductVariants}
                                setImages={setImages}
                                images={images}
                                setImagesPlaceHolders={setImagesPlaceHolders}
                                setIsVariantCoverPreview={
                                    setIsVariantCoverPreview
                                }
                                data={data}
                               
                            />
                        </div>

                        {/* <!-- Save Button --> */}
                        <div className="pt-8 border-t border-slate-200">
                            <button
                                id="saveProduct"
                                type="button"
                                // disabled={true}
                                onClick={(e) => {
                                    submitForm(e);
                                }}
                                className={`${
                                    isReadyToSubmit.bool
                                        ? "!opacity-100 from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all "
                                        : ""
                                } opacity-40 duration-200 transform  font-semibold text-lg  bg-gradient-to-r from-blue-900 to-indigo-900 w-full md:w-auto px-10 py-4 text-white rounded-xl `}
                            >
                                {isReadyToSubmit.bool
                                    ? " Save Product"
                                    : "try to fill all the fields bellow "}
                            </button>
                            <ul className="mt-4 px-4 py-2 bg-orange-50 border border-orange-300 rounded-lg">
                                {Object.keys(isReadyToSubmit)
                                    .filter((key) => key !== "bool")
                                    .map((key) =>
                                        !isReadyToSubmit[key] ? (
                                            <li
                                                key={key}
                                                className="text-sm text-orange-600 font-medium py-1 pl-2 flex items-center gap-2"
                                            >
                                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                                <span className="capitalize">
                                                    {key} is missing
                                                </span>
                                            </li>
                                        ) : null
                                    )}
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Create;
