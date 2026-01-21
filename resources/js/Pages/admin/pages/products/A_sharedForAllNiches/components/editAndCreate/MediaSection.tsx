import { Button } from "@/components/ui/button";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { getMediaSrcOrDefault } from "@/functions/product/getMediaSrcOrDefault";
import { productFilesUploaderCleaner } from "@/functions/product/productFilesUploaderCleaner";
import { Film, Image as ImageIcon, X, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import { Oval } from "react-loader-spinner";
import NotifyUser from "@/components/ui/NotifyUser";
import { useBackendInteraction } from "@/functions/product/useBackendInteractions";
import { Cover, Video } from "@/types/inventoryTypes";
import { convertYoutubeToEmbed } from "@/functions/product/convertYoutubeToEmbed";
interface MediaSectionProps {
    setVideoPreview: React.Dispatch<React.SetStateAction<Video | null>>;
    videoPreview: Video | null;
}

const MediaSection = ({ setVideoPreview, videoPreview }: MediaSectionProps) => {
    const {
        state: { currentTheme : theme },
    } = useStoreConfigCtx();
    const { basicInfoForm, setBasicInfoForm ,draftId} =
        useProductDataCtx();
    const [coversPreview , setCoversPreview] = useState<Cover[]>(basicInfoForm.covers as Cover[] || []);
    const [isDragging, setIsDragging] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading , setImageUploading] = useState(false);
    const [uploadError , setUploadError] = useState<string | null>(null)
    const { cleanDeletedProductMedia, uploadProductFiles } =
    productFilesUploaderCleaner();
    
    const handleCoversUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadError(null);
            setImageUploading(true)
            const data = await uploadProductFiles(
                file,
                "cover",
                "Product",
                draftId.current
            );
            if(!draftId.current) draftId.current = data.draft_id ;
            setCoversPreview((prev) => [
                ...(prev || []),
                { url: data.media.url, id: data.media.id },
            ]);
        } catch (err : any) {
            setUploadError(err.message);
        }finally {
            if(imageInputRef.current) imageInputRef.current.value = "";
            setImageUploading(false);

         }
    };
    
    const handleRemoveCover = async (mediaId: string) => {
        if(!draftId.current || !mediaId) return;
        try{
        await cleanDeletedProductMedia(draftId.current, mediaId);
        setCoversPreview((prev) =>
            (prev || []).filter((media) => media.id != mediaId)
        );
        }catch(err : any){
          setUploadError(err.message);
        }finally {
            if (imageInputRef.current) imageInputRef.current.value = "";
         }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          
    };
   
    const handleRemoveVideo = () => {
        setBasicInfoForm({ ...basicInfoForm, video: {id : null , iframe: null , url: null , primary: null } });
        
        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // drag logic
    };

    const hasVideo =  basicInfoForm.video.url  || basicInfoForm.video.iframe 

    const headerActions = (
        <>
            <Button 
                variant="danger"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                    background: theme.bgSecondary,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                }}
            >
                <ImageIcon
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                />
                Add Images
            </Button>

            <Button
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                style={{
                    background: theme.bgSecondary,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                }}
            >
                <Film
                    className="w-4 h-4"
                    style={{ color: theme.textSecondary }}
                />
                Add Video
            </Button>
        </>
    );

    return (
        <>
            <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleCoversUpload}
            />
            <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
            />

            <div className="space-y-6">
               
                {/* IMAGES */}
                <div className="bg-black bg-opacity-50 rounded-lg border-2 border-dashed transition-all  p-4 "
                 style={{
                            borderColor: isDragging
                                ? theme.accent
                                : theme.border,
                            background: isDragging
                                ? theme.bgSecondary
                                : theme.bg,
                        }}
                >
                    
                    <h4
                        className="text-sm font-semibold mb-3"
                        style={{ color: theme.textSecondary }}
                    >
                        Images
                    </h4>
                    
                    
                    
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 "
                       
                    >  

                        

                         
                        {(coversPreview || basicInfoForm.covers || []).map(
                            (media, i) => (
                                <div
                                    key={i}
                                    className="relative aspect-square group animate-in fade-in zoom-in duration-200"
                                >
                                    <img
                                        src={getMediaSrcOrDefault(
                                            media,
                                            "image"
                                        )}
                                        alt={`cover-${i}`}
                                        className="w-full h-full object-cover rounded-lg shadow-sm transition-all"
                                        style={{ boxShadow: theme.shadow }}
                                    />

                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                        style={{ background: theme.overlay }}
                                    />

                                    <button 
                                        type="button"
                                        onClick={() =>
                                            handleRemoveCover(String(media.id))
                                        }
                                        className="absolute top-2 right-2 p-1 rounded-full shadow-lg transition-all"
                                        
                                        style={{ background: theme.card }}
                                        aria-label="Remove image"
                                    >
                                      <X
                                            className="w-4 h-4"
                                            style={{ color: theme.error }}
                                        />
                                    </button>
                                    
                                </div>
                            )
                        )}
                        {/* // image upload loding skelepton */}
                        {imageUploading && (
                             <div 
                              className="w-full h-full animate-pulse rounded-lg border-2 border-dashed transition-all" 
                              style={{background : theme.bgSecondary}}
                             >
                                <Oval
                                        height={30}
                                        width={30}
                                        
                                        color="#fff"
                                        visible={imageUploading}
                                />

                             </div>
                        )}

                        {/* ADD IMAGE */}
                        <button 
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-all cursor-pointer"
                            style={{
                                borderColor: theme.border,
                                background: theme.bgSecondary,
                            }}
                        >
                            <Upload
                                className="w-8 h-8 mb-2"
                                style={{ color: theme.textMuted }}
                            />
                            <p
                                className="text-xs font-medium"
                                style={{ color: theme.textSecondary }}
                            >
                                Add Images
                            </p>
                        </button>
                    </div>

                    {/* // upload errors  */}
                        {uploadError && (
                              <NotifyUser  message={uploadError} />

                        )}
                </div>

                 {/* VIDEO */}
                <div>
                <h4
                    className="text-sm font-semibold mb-3"
                    style={{ color: theme.textSecondary }}
                >
                    Video
                </h4>

                <div className="space-y-4">
                    {/* 1️⃣ YouTube URL Input on top */}
                    <input
                        type="url"
                        placeholder="Paste YouTube URL here"
                        value={(basicInfoForm.video?.iframe ?? '')}
                        onChange={(e) => setBasicInfoForm(prev => ({
                            ...prev,
                            video: {
                                ...(prev.video || {id  : null  , url : null , iframe  : null , primary : null}) , 
                                iframe : convertYoutubeToEmbed(e.target.value) , 
                                primary : 'iframe'
                            }  })) 
                        }
                        className="w-full rounded-lg p-3 border"
                        style={{
                            borderColor: theme.border,
                            background: theme.bgSecondary,
                            color: theme.text,
                        }}
                        disabled={!!basicInfoForm.video?.iframe} // disable input if a file is selected
                    />

                    {/* 2️⃣ Preview Section */}
                    {hasVideo && (
                    <div className="relative group ">
                        {basicInfoForm.video?.primary === "file" ? (
                        <video
                            src={
                              getMediaSrcOrDefault(basicInfoForm.video , "video")
                            }
                            controls
                            className="w-full max-w-2xl rounded-lg"
                            style={{ boxShadow: theme.shadowMd }}
                        />
                        ) : (
                        // YouTube Embed
                        <iframe
                            title={basicInfoForm.name}
                            src={(basicInfoForm.video?.iframe ?? '')}
                            className="w-full max-w-2xl rounded-lg aspect-video"
                            allowFullScreen
                        />
                        )}

                        <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none"
                        style={{ background: theme.overlay }}
                        />

                        <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="absolute top-3 right-3 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                        style={{ background: theme.card }}
                        aria-label="Remove video"
                        >
                        <X className="w-5 h-5" style={{ color: theme.error }} />
                        </button>
                    </div>
                    )}

                    {/* 3️⃣ Upload Video Button */}
                    <button
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center p-12 rounded-lg border-2 border-dashed transition-all"
                    style={{
                        borderColor: theme.border,
                        background: theme.bgSecondary,
                    }}
                    disabled={!!basicInfoForm.video?.primary && basicInfoForm.video?.primary === "iframe"}
                    >
                    <Upload
                        className="w-12 h-12 mb-3"
                        style={{ color: theme.textMuted }}
                    />
                    <p
                        className="text-sm font-medium mb-1"
                        style={{ color: theme.text }}
                    >
                        {hasVideo && basicInfoForm.video?.primary  === "file" ? "Replace Video" : "Upload Video"}
                    </p>
                    <p
                        className="text-xs"
                        style={{ color: theme.textMuted }}
                    >
                        Click to {hasVideo && basicInfoForm.video?.primary  === "file" ? "change" : "upload"} video
                    </p>
                    </button>
                </div>
                </div>

            </div>
        </>
    );
};

export default MediaSection;
