import NotifyUser from "@/components/ui/NotifyUser";
import { useProductDataCtx } from "@/contextHooks/product/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";

import { getMediaSrcOrDefault } from "@/functions/product/getMediaSrcOrDefault";
import { productFilesUploaderCleaner } from "@/functions/product/productFilesUploaderCleaner";
import { useBackendInteraction } from "@/functions/product/useBackendInteractions";
import { Cover } from "@/types/inventoryTypes";
import { Upload, X } from "lucide-react";
import {  useEffect, useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";




const BaseSharedForm = ({getThumbnailPreview , validateField , frontEndErrors} : {getThumbnailPreview : (thumbnail:string) => void , validateField : (field: string, value: any) => void , frontEndErrors : Record<string , string>}) => {
    
    const { basicInfoForm, setBasicInfoForm , draftId } = useProductDataCtx();
    const {state :{currentTheme}} = useStoreConfigCtx()
    const  thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [uploadError , setUploadError] = useState<string | null>(null)
    const [thumbnailUploading , setThumbnailUploading] = useState(false)
    const [thumbnailPreview, setThumbnailPreview] = useState<Cover | null>(basicInfoForm.thumbnail);
    const {cleanDeletedProductMedia , uploadProductFiles} = productFilesUploaderCleaner()
    const {createDraft} = useBackendInteraction()

    
    
    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      try{   
           
            const file = e.target.files?.[0];
            if (!file) return;
            setUploadError(null)
            setThumbnailUploading(true)
            // validateField('thumbnail', url);
            const data =  await uploadProductFiles(file , 'thumbnail' , 'Product', draftId.current);
            setThumbnailPreview({url : data.media.url , id : data.media.id});
            if(!draftId.current) draftId.current = data.draft_id
          }catch(err : any){
              setUploadError(err.message)
           }
          finally{
            if(thumbnailInputRef.current) thumbnailInputRef.current.value = "";
            setThumbnailUploading(false)
          }
    };

   
    const handleThumnailRemove = async (mediaId : string) => {
      if(!draftId.current || !mediaId) return ;
      try{ 
          await  cleanDeletedProductMedia(draftId.current , mediaId);
          setThumbnailPreview(null);
        }catch(err : any){
          setUploadError(err.message)
        }finally {
            if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        }
    }

    return (
    <div className="space-y-6 pb-6 border-b" style={{ borderColor: currentTheme.border }}>
          
          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Thumbnail <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-6">
               {/* // image upload loding skelepton */}
                        {thumbnailUploading && (
                             <div 
                              className="w-40 h-40 animate-pulse rounded-lg border-2 border-dashed transition-all" 
                              style={{background : currentTheme.bgSecondary}}
                             >
                                <Oval
                                        height={30}
                                        width={30}
                                        
                                        color="#fff"
                                        visible={thumbnailUploading}
                                />

                             </div>
                        )}
              {!!thumbnailPreview && (
                <div className="relative w-40 h-40 group overflow-hidden rounded-2xl shadow-lg border-2"
                     style={{ borderColor: frontEndErrors.thumbnail ? '#ef4444' : currentTheme.border }}>
                  <img 
                    src={!!thumbnailPreview || !!basicInfoForm.thumbnail  ?
                       thumbnailPreview.url :  
                       typeof basicInfoForm?.thumbnail === 'object' ?
                        getMediaSrcOrDefault(basicInfoForm?.thumbnail , 'image') : ""  
                      }
                    alt="Product thuc mbnail"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleThumnailRemove(String(thumbnailPreview.id))}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white/70 hover:bg-white shadow-lg transition-all"
                  >
                    <X className="w-5 h-5 text-black" />
                  </button>
                </div>
              )}
              {/* // uploader  */}
              {
                !thumbnailPreview && !thumbnailUploading && (
                  <label className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-md font-semibold"
                     style={{ backgroundColor: currentTheme.secondary, color: currentTheme.text, borderWidth: '2px', borderColor: currentTheme.border }}>
                <Upload className="w-6 h-6" />
                Upload Image
                <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
              </label>
                )
              }
            </div>
             {/* // upload errors  */}
                        {uploadError && (
                              <NotifyUser message={uploadError} />
                        )}
            {frontEndErrors.thumbnail && <p className="text-red-500 text-sm mt-2">{frontEndErrors.thumbnail}</p>}
          </div>

          {/* Name, Brand */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basicInfoForm.name}
                onChange={(e) => {
                  setBasicInfoForm({ ...basicInfoForm, name: e.target.value });
                  validateField('name', e.target.value);
                }}
                onBlur={(e) => validateField('name', e.target.value)}
                className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                style={{
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderWidth: '2px',
                  borderColor: frontEndErrors.name ? '#ef4444' : currentTheme.border
                }}
              />
              {frontEndErrors.name && <p className="text-red-500 text-sm mt-2">{frontEndErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basicInfoForm.brand}
                onChange={(e) => {
                  setBasicInfoForm({ ...basicInfoForm, brand: e.target.value });
                  validateField('brand', e.target.value);
                }}
                onBlur={(e) => validateField('brand', e.target.value)}
                className="w-full px-5 py-4 rounded-xl font-medium shadow-sm"
                style={{
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text,
                  borderWidth: '2px',
                  borderColor: frontEndErrors.brand ? '#ef4444' : currentTheme.border
                }}
              />
              {frontEndErrors.brand && <p className="text-red-500 text-sm mt-2">{frontEndErrors.brand}</p>}
            </div>
          </div>

        

          

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-4 uppercase tracking-wide" style={{ color: currentTheme.text }}>
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
               onBlur={(previousRange, source, editor) => {
                const content = editor.getText(); // plain text version
                validateField('description', content);
              }}
              value={basicInfoForm.description}
              onChange={(value) => {
                setBasicInfoForm({ ...basicInfoForm, description: value });
                validateField('description',value);
              }}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-300"

              placeholder="Write your description here..."
              modules={{
                toolbar: [
                  ["bold", "italic", "underline", "strike"],
                  [{ header: [1, 2, 3, false] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  [{ color: [] }, { background: [] }], // <-- color and highlight
                  ["clean"],
                ],
              }}
            />
            {frontEndErrors.description && <p className="text-red-500 text-sm mt-2">{frontEndErrors.description}</p>}
          </div>
          


        

        </div>)
    
}


export default BaseSharedForm ; 



