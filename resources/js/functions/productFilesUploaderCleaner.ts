import { ModelType } from "@/types/backendTypes";
import { FlagMedia } from "@/types/mediaTypes";
import axios from "axios";
import { route } from "ziggy-js";

export  const productFilesUploaderCleaner = () => {



const uploadProductFiles = async (file: File, collection: FlagMedia  , model_type : ModelType , toDraftId : string) => {
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection', collection);
    formData.append('model_type', model_type);
    formData.append('draft_id', toDraftId);
    const response = await axios.post(route('media.store'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log(response.data)
    if(response.status !== 200 ) throw new Error('faild to upload the file')
    return response.data;
  };


 const cleanProductTempMedia = async (draftId : string  , mediaId : string) => {
    const response =  await axios.delete(route('media.destroy') , {
         data : {
            draft_id : draftId , 
            media_id : mediaId
         }
    } )
    console.log(response.data)
    if(response.status !== 200 ) throw new Error('faild to clean temporary media files')
   
 }


return { cleanProductTempMedia , uploadProductFiles}
}