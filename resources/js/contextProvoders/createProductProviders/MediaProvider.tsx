import { useState, type ReactNode } from "react";
import { ImagesMap } from "@/types/mediaTypes";
import { MediaContext } from "@/context/createproductContext/MediaContext";


// Provider
interface MediaProviderProps {
    children: ReactNode;
}

export const MediaProvider = ({ children }: MediaProviderProps) => {
    const [images, setImages] = useState<ImagesMap>({});
    const [imagesPlaceHolders, setImagesPlaceHolders] = useState<number[]>([]);
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
