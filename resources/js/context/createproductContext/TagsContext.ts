import { TagsContextType } from "@/types/tagsTypes";
import { createContext } from "react";


// Context
export const TagsContext = createContext<TagsContextType| null>(null);