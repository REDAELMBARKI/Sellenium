
import { DEFAULT_PRODUCT_IMAGE, DEFAULT_PRODUCT_VIDEO } from '@/data/defaults';
import { ImagePreviewItem } from '@/types/mediaTypes';
import { Cover } from '@/types/inventoryTypes';


export function getMediaSrcOrDefault(c: Cover | ImagePreviewItem | null , mediaType : "video" | "image" ): string {
  
  if (!c){
    if(mediaType === "video") return DEFAULT_PRODUCT_VIDEO
    else if(mediaType === "image") return DEFAULT_PRODUCT_IMAGE
    else return "";
  };

  if ("url" in c && c.url) return c.url; 
  if ("path" in c && c.path) return c.path; 
  return mediaType === "video" ? DEFAULT_PRODUCT_VIDEO : DEFAULT_PRODUCT_IMAGE;
}
