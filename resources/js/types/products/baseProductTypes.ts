import { Cover } from "../inventoryTypes";
import { ImagePreviewItem } from "../mediaTypes";
import { Tag } from "../tagsTypes";
import { CategoryCode } from "./categories";

export interface ProductBasicInfoData { 
  category: CategoryCode;
  id?: string | null;
  name: string;
  brand: string;
  subCategory: {id: string , name : string}[];
  description: string;
  rating_average?: number;
  thumbnail: Cover | ImagePreviewItem  | null ;
  video? : Cover | ImagePreviewItem | null ;
  covers? : (Cover | ImagePreviewItem)[] , 
  tags: Tag[];
  isFeatured?: boolean;
  isFreeShipping : boolean ;
  releaseDate?: string;

}
