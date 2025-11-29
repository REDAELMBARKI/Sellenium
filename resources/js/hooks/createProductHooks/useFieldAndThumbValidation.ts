import { useInventory } from "@/contextHooks/createProductCtxHooks/useInventory";
import { useMedia } from "@/contextHooks/createProductCtxHooks/useMedia";
import { useProductForm } from "@/contextHooks/createProductCtxHooks/useProductForm";
import { useTags } from "@/contextHooks/createProductCtxHooks/useTags";
import { useEffect } from "react";

interface ReadyState {
  tags: boolean;
  inventory: boolean;
  [key: string]: boolean;
}


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
        const updatedState : Partial<ReadyState>  = {};

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