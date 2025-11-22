import { useState, type ReactNode } from "react";
import { MediaContext } from "../context/MediaContext";
import { ImagePlaceholder, ImagesMap } from "@/types/mediaTypes";


// Provider
interface MediaProviderProps {
    children: ReactNode;
}

export const MediaProvider = ({ children }: MediaProviderProps) => {
    const [images, setImages] = useState<ImagesMap>({});
    const [imagesPlaceHolders, setImagesPlaceHolders] = useState<ImagePlaceholder[]>([]);
    const [imagesValid, setImagesValid] = useState(false);
    const [isVariantCoverPreview, setIsVariantCoverPreview] = useState(false);
    const [fileToPass, setFileToPass] = useState<File | null>(null);
    const [isAllCoversDeleted, setIsAllCoversDeleted] = useState(false);
    const [placeHolderNotFilled, setPlaceHolderNotFilled] = useState(false);

    return (
        <MediaContext.Provider
            value={{
                images,
                setImages,
                imagesPlaceHolders,
                setImagesPlaceHolders,
                imagesValid,
                setImagesValid,
                isVariantCoverPreview,
                setIsVariantCoverPreview,
                fileToPass,
                setFileToPass,
                isAllCoversDeleted,
                setIsAllCoversDeleted,
                placeHolderNotFilled,
                setPlaceHolderNotFilled,
            }}
        >
            {children}
        </MediaContext.Provider>
    );
};
