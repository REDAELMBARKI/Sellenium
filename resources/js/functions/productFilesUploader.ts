import axios from "axios";
import { route } from "ziggy-js";

export  const uploadProductFiles = async (file: File, type: string , toDraftId : string) => {
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('draft_id', toDraftId);

    try {
        const response = await axios.post(route('media.store'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('File uploaded:', response.data);
        // update state if needed
    } catch (err) {
        console.error('File upload failed:', err);
    }
  };