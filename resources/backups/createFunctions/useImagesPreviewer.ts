import { useProductUICtx } from "@/contextHooks/sharedhooks/useProductUICtx";
import  { useEffect  } from "react";
import { v4 as uuidByV4} from "uuid";

 interface ImageItem {
  file: File;
  url: string;
  id : string
}


interface ImagesPreviewRevokerProps {
    imageItemsFileWithPreviewUrl  : ImageItem[]

}

export const useImagesPreviewRevoker = () => {

    const {uiActiveVariantFormImages2Preview } = useProductUICtx()
    useEffect(() => {
        return () => {
            uiActiveVariantFormImages2Preview.forEach(url => URL.revokeObjectURL(url.url))
        }
    }, [uiActiveVariantFormImages2Preview]);

    
}