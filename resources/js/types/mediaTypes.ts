
// media Types
export interface ImagePlaceholder {
    id: string;
    url: string;
    file?: File;
}

export interface ImagesMap {
    [key: string]: File | string;
}

export interface MediaContextType {
    images: ImagesMap;
    setImages: React.Dispatch<React.SetStateAction<ImagesMap>>;
    imagesPlaceHolders: ImagePlaceholder[];
    setImagesPlaceHolders: React.Dispatch<React.SetStateAction<ImagePlaceholder[]>>;
    imagesValid: boolean;
    setImagesValid: React.Dispatch<React.SetStateAction<boolean>>;
    isVariantCoverPreview: boolean;
    setIsVariantCoverPreview: React.Dispatch<React.SetStateAction<boolean>>;
    fileToPass: File | null;
    setFileToPass: React.Dispatch<React.SetStateAction<File | null>>;
    isAllCoversDeleted: boolean;
    setIsAllCoversDeleted: React.Dispatch<React.SetStateAction<boolean>>;
    placeHolderNotFilled: boolean;
    setPlaceHolderNotFilled: React.Dispatch<React.SetStateAction<boolean>>;
}

