import { style } from "framer-motion/client";


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
  id? : string | null ;
  file: File | null;
  url: string | null;
}


export type FlagMedia = 
  | 'thumbnail'       // main product image
  | 'cover'           // gallery or variant cover images
  | 'video'           // product video
  | 'avatar_user'     // customer or user avatar
  | 'avatar_admin'    // admin avatar
  | 'brand_logo'      // brand logos
  | 'general';        // anything else / fallback

