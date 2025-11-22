import { useInventory } from "@/contextHooks/useInventory";
import { useMedia } from "@/contextHooks/useMedia";
import { useEffect } from "react";



export const useThumbnailManipuler  = () => {
    const {setImages , images  , fileToPass , isAllCoversDeleted } =  useMedia()
    const {isCurrentVariantActive  } = useInventory()
       
    
    
    
    useEffect(() => {
            if (typeof setImages !== "function") return;
    
            // If variant inactive → remove cover_1
            if (!isCurrentVariantActive) {
                setImages((prev) => ({
                    ...prev,
                    cover_1: null,
                }));
            }
            // If active and no manual cover, use thumbnail
            else if (images.thumbnail && !images.cover_1) {
                setImages((prevImages) => ({
                    ...prevImages,
                    cover_1: prevImages.thumbnail,
                }));
            }
        }, [isCurrentVariantActive, images.thumbnail]);
    
    
        // Optional: Async fileToPass logic, but only if no manual cover exists
    
        useEffect(() => {
            if (!isCurrentVariantActive ) return;
    
            if (!images.cover_1 && fileToPass !== null) {
                if (isCurrentVariantActive && isAllCoversDeleted) {
                    setImages((prev) => ({
                        ...prev,
                        cover_1: fileToPass,
                    }));
                }
            }
        }, [isAllCoversDeleted, isCurrentVariantActive]);



}