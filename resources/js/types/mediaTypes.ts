

export interface ImagesMap {
    [key: string]: File | string | null;
    
}

export interface MediaContextType {
    images: ImagesMap;
    setImages: React.Dispatch<React.SetStateAction<ImagesMap>>;
    imagesPlaceHolders: number[];
    setImagesPlaceHolders: React.Dispatch<React.SetStateAction<number[]>>;
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


 export interface ImagePreviewItem {
  file: File;
  url: string;
  id : number | string ;
}

