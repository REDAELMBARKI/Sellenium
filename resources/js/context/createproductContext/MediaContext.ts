import { MediaContextType } from "@/types/mediaTypes";
import { createContext } from "react";



// Context
export const MediaContext = createContext<MediaContextType| null>(null);
