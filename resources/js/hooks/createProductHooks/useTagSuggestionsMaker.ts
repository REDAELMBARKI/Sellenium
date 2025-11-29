import { useTags } from "@/contextHooks/createProductCtxHooks/useTags";
import { TagSuggestion } from "@/types/tagsTypes";
import { useEffect } from "react";



export const useTagSuggestionsMaker = ({tagSuggestions}:{tagSuggestions : TagSuggestion[]}) => {

    const {setSuggestedTags , tagInputValue , selectedTags } = useTags()

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
}