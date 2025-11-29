import { TagsContext } from "@/context/createproductContext/TagsContext";
import { TagsContextType } from "@/types/tagsTypes";
import { useContext } from "react";

// Hook
export const useTags = (): TagsContextType => {
    const context = useContext(TagsContext);
    if (!context) {
        throw new Error("useTags must be used within TagsProvider");
    }
    return context;
};