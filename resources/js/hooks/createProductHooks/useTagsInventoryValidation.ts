import { useInventory } from "@/contextHooks/createProductCtxHooks/useInventory";
import { useTags } from "@/contextHooks/createProductCtxHooks/useTags";
import { useEffect } from "react";





export const useTagsInventoryValidation = () => {
     const {selectedTags ,setTagsValid} = useTags()
     const {setInventoryValid , productVariants } =  useInventory()
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
}