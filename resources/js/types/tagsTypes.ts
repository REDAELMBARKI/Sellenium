export interface TagSuggestion {
    id: number | null;
    name: string;
}




// tags Types
export  interface Tag {
    id: string | null;
    name: string;
}

export  interface TagsContextType {
    tagInputValue: string;
    setTagInputValue: React.Dispatch<React.SetStateAction<string>>;
    selectedTags: Tag[];
    setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    suggestedTags: Tag[];
    setSuggestedTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    tagsValid: boolean;
    setTagsValid: React.Dispatch<React.SetStateAction<boolean>>;
}
