import { useTags } from "@/contextHooks/useTags";
import { Tag } from "@/types/createPageTypes";




export const useTagsActions = () => {
    const { selectedTags, setSelectedTags, setTagInputValue } = useTags();

    const handleTagRemove = (tagToRemove: number) => {
        const tags = selectedTags.filter((_, index) => index !== tagToRemove);
        setSelectedTags(tags);
    };

    const addSuggestedTagToSelectedOnes = (tag: Tag) => {
        setSelectedTags([...selectedTags, tag]);
        setTagInputValue("");
    };



    
    function addTag() {
        if (tagInputValue.trim().length < 1) {
            return;
        }
        setSelectedTags([
            ...selectedTags,
            {
                id: null,
                name: tagInputValue,
            },
        ]);
    }

    function addHighlightedTag() {
    
        if (suggestedTags?.length > 0) {
            setSelectedTags([...selectedTags, suggestedTags[0]]);
            setTagInputValue('')
        } else {
            
            setSelectedTags([...selectedTags, {
                id:null,
                name:tagInputValue
            }]);
              setTagInputValue("");
            
        }
    }

    return { handleTagRemove, addSuggestedTagToSelectedOnes , addTag , addHighlightedTag };
};