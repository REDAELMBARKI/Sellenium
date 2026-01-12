import { Button } from "@/components/ui/button";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useProductDraft } from "@/contextHooks/sharedhooks/useProductDraft";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { getMediaSrcOrDefault } from "@/functions/getMediaSrcOrDefault";
import { productFilesUploaderCleaner } from "@/functions/productFilesUploaderCleaner";
import { Film, Image as ImageIcon, X, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { v4 } from "uuid";
import { Oval } from "react-loader-spinner";
import NotifyUser from "@/components/ui/NotifyUser";

interface MediaSectionProps {
    setVideoPreview: React.Dispatch<React.SetStateAction<string | null>>;
    videoPreview: string | null;
}

const MediaSection = ({ setVideoPreview, videoPreview }: MediaSectionProps) => {
    const {
        state: { currentTheme : theme },
    } = useStoreConfigCtx();
    const { basicInfoForm, setBasicInfoForm, setCoversPreview, coversPreview } =
        useProductDataCtx();
    const [isDragging, setIsDragging] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading , setImageUploading] = useState(false);
    const [uploadError , setUploadError] = useState<string | null>(null)
    const { draftId, saveDraft } = useProductDraft();
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
            // validateField('cover', url);
            const draftId = await saveDraft();
            const imageData = await uploadProductFiles(
                file,
                "cover",
                "Product",
                draftId!
            );
            setCoversPreview((prev) => [
                ...(prev || []),
                { url: imageData.url, id: imageData.id },
            ]);
        } catch (err : any) {
            setUploadError(err.message);
        }finally {
            if(imageInputRef.current) imageInputRef.current.value = "";
            setImageUploading(false);

         }
    };

    const handleRemoveCover = async (mediaId: string) => {
        if(!draftId || !mediaId) return;
        try{
        await cleanDeletedProductMedia(draftId, mediaId);
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
        const file = e.target.files?.[0];
        const id = v4();
        if (!file) return;
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
    };

    const handleRemoveVideo = () => {
        setVideoPreview(null);
        setBasicInfoForm({ ...basicInfoForm, video: null });
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

    const hasImages = basicInfoForm.covers && basicInfoForm.covers.length > 0;
    const hasVideo =
        basicInfoForm.video &&
        Object.keys(basicInfoForm.video).length > 0 &&
        videoPreview !== null;

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
                        {hasVideo && (
                            <div className="relative group">
                                <video
                                    src={
                                        videoPreview ??
                                        getMediaSrcOrDefault(
                                            basicInfoForm.video!,
                                            "video"
                                        )
                                    }
                                    controls
                                    className="w-full max-w-2xl rounded-lg"
                                    style={{ boxShadow: theme.shadowMd }}
                                />

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
                                    <X
                                        className="w-5 h-5"
                                        style={{ color: theme.error }}
                                    />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => videoInputRef.current?.click()}
                            className="w-full flex flex-col items-center justify-center p-12 rounded-lg border-2 border-dashed transition-all"
                            style={{
                                borderColor: theme.border,
                                background: theme.bgSecondary,
                            }}
                        >
                            <Upload
                                className="w-12 h-12 mb-3"
                                style={{ color: theme.textMuted }}
                            />
                            <p
                                className="text-sm font-medium mb-1"
                                style={{ color: theme.text }}
                            >
                                {hasVideo ? "Replace Video" : "Upload Video"}
                            </p>
                            <p
                                className="text-xs"
                                style={{ color: theme.textMuted }}
                            >
                                Click to {hasVideo ? "change" : "upload"} video
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MediaSection;
