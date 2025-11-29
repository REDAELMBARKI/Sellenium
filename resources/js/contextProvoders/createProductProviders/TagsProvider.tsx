import { TagsContext } from "@/context/createproductContext/TagsContext";
import { Tag } from "@/types/tagsTypes";
import { useState, type ReactNode } from "react";


// Provider
interface TagsProviderProps {
    children: ReactNode;
}

export const TagsProvider = ({ children }: TagsProviderProps) => {
    const [tagInputValue, setTagInputValue] = useState("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
    const [tagsValid, setTagsValid] = useState(false);

    return (
        <TagsContext.Provider
            value={{
                tagInputValue, 
                setTagInputValue,
                selectedTags,
                setSelectedTags,
                suggestedTags,
                setSuggestedTags,
                tagsValid,
                setTagsValid,
            }}
        >
            {children}
        </TagsContext.Provider>
    );
};