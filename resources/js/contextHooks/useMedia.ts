import { MediaContext } from "@/context/MediaContext";
import { MediaContextType } from "@/types/mediaTypes";
import { useContext } from "react";

export const useMedia = (): MediaContextType => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error("useMedia must be used within MediaProvider");
    }
    return context;
};