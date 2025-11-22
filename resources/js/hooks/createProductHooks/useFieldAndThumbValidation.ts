import { useInventory } from "@/contextHooks/useInventory";
import { useMedia } from "@/contextHooks/useMedia";
import { useProductForm } from "@/contextHooks/useProductForm";
import { useTags } from "@/contextHooks/useTags";
import { useEffect } from "react";



export const useFieldAndThumbValidation  = ()=> {



    const {data , setOtherStringFieldsValid , isReadyToSubmit , setIsReadyToSubmit} =  useProductForm()
    const {selectedTags } = useTags()
    const {productVariants} = useInventory()
    const {setImagesValid}  = useMedia()
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
}