import { Button } from "@/components/ui/button";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { getMediaSrcOrDefault } from "@/functions/product/getMediaSrcOrDefault";
import { productFilesUploaderCleaner } from "@/functions/product/productFilesUploaderCleaner";
import {
    Film,
    Image as ImageIcon,
    X,
    Upload,
    Plus,
    Minimize,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";
import { Oval } from "react-loader-spinner";
import NotifyUser from "@/components/ui/NotifyUser";
import { useBackendInteraction } from "@/functions/product/useBackendInteractions";
import { Cover, Video } from "@/types/inventoryTypes";
import { convertYoutubeToEmbed } from "@/functions/product/convertYoutubeToEmbed";
import { convertToYoutubeId } from "@/functions/product/convertToYoutubeId";
import Tabs from "../showProductPage/Tabs";
import { TabsList } from "@/components/ui/tabs";
interface MediaSectionProps {
    setVideoPreview: React.Dispatch<React.SetStateAction<Video | null>>;
    videoPreview: Video | null;
}

const MediaSection = ({ setVideoPreview, videoPreview }: MediaSectionProps) => {
    const {
        state: { currentTheme: theme },
    } = useStoreConfigCtx();
    const { basicInfoForm, setBasicInfoForm, draftId } = useProductDataCtx();

    const [coversPreview, setCoversPreview] = useState<Cover[]>(
        (basicInfoForm.covers as Cover[]) || [],
    );
    const [isDragging, setIsDragging] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showIframeModal, setShowIframeModal] = useState(false);
    const [newIframeUrl, setNewIframeUrl] = useState("");
    const { cleanDeletedProductMedia, uploadProductFiles } =
        productFilesUploaderCleaner();

    const handleCoversUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadError(null);
            setImageUploading(true);
            const data = await uploadProductFiles(
                file,
                "cover",
                "Product",
                draftId.current,
            );
            if (!draftId.current) draftId.current = data.draft_id;
            setCoversPreview((prev) => [
                ...(prev || []),
                { url: data.media.url, id: data.media.id },
            ]);
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            if (imageInputRef.current) imageInputRef.current.value = "";
            setImageUploading(false);
        }
    };

    const handleRemoveCover = async (mediaId: string) => {
        if (!draftId.current || !mediaId) return;
        try {
            await cleanDeletedProductMedia(draftId.current, mediaId);
            setCoversPreview((prev) =>
                (prev || []).filter((media) => media.id != mediaId),
            );
        } catch (err: any) {
            setUploadError(err.message);
        } finally {
            if (imageInputRef.current) imageInputRef.current.value = "";
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {};

    const handleRemoveVideo = () => {
        setBasicInfoForm({ ...basicInfoForm, video: [] });

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

    const hasVideo = basicInfoForm.video.length > 0;

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
                <div
                    className="bg-black bg-opacity-50 rounded-lg border-2 border-dashed transition-all  p-4 "
                    style={{
                        borderColor: isDragging ? theme.accent : theme.border,
                        background: isDragging ? theme.bgSecondary : theme.bg,
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
                                            "image",
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
                            ),
                        )}
                        {/* // image upload loding skelepton */}
                        {imageUploading && (
                            <div
                                className="w-full h-full animate-pulse rounded-lg border-2 border-dashed transition-all"
                                style={{ background: theme.bgSecondary }}
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
                    {uploadError && <NotifyUser message={uploadError} />}
                </div>
                {/* VIDEO SECTION */}
                <div>
                    <h4
                        className="text-sm font-semibold mb-3"
                        style={{ color: theme.textSecondary }}
                    >
                        Video
                    </h4>

                    <Tabs
                        tabs={[
                            {
                                id: "iframes",
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <span>iFrame</span>
                                        {/* Badge: green if at least 1 iframe, gray otherwise */}
                                        <span
                                            className={`w-3 h-3 rounded-full ${
                                                basicInfoForm.video.some(
                                                    (v) => v?.media_type === "iframe",
                                                )
                                                    ? "bg-green-500"
                                                    : "bg-gray-400"
                                            }`}
                                        />
                                    </div>
                                ),
                                Icon: Plus,
                                content: (
                                    <div className="space-y-4">
                                        {/* Add iFrame Button — always on top */}
                                        <div className="flex justify-end mb-4">
                                        <Button
                                            onClick={() => setShowIframeModal(true)}
                                            className="px-4 py-2 m-4 rounded-md"
                                        >
                                            Add iFrame
                                        </Button>
                                        </div>

                                        {/* List of iFrames */}
                                        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-4 gap-4">
                                        {basicInfoForm.video
                                            .filter((v) => v?.media_type === "iframe")
                                            .map((v, idx) => (
                                            <div key={idx} className="relative group flex-1 min-w-[250px]">
                                                <iframe
                                                title={`iframe-${idx}`}
                                                src={convertYoutubeToEmbed(v.url ?? "") ?? ""}
                                                className="w-full rounded-lg aspect-video"
                                                allowFullScreen
                                                />
                                                <button
                                                type="button"
                                                onClick={() =>
                                                    setBasicInfoForm((prev) => ({
                                                    ...prev,
                                                    video: prev.video.filter(
                                                        (_, i) => i !== prev.video.findIndex((x) => x === v),
                                                    ),
                                                    }))
                                                }
                                                className="absolute top-2 right-2 p-2 rounded-full shadow-lg  opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                                style={{color :theme.text  , background :theme.error}}
                                                
                                                >
                                                <X className="w-5 h-5 "
                                                style={{color :theme.text }}
                                                
                                                />
                                                </button>
                                            </div>
                                            ))}
                                        </div>

                                        {/* iFrame Modal */}
                                        {showIframeModal && (
                                            <IframeEntryModel
                                                newIframeUrl={newIframeUrl}
                                                onChangeIframeUrl={(newUrl) =>
                                                    setNewIframeUrl(newUrl)
                                                }
                                                onValidateUrl={() => {
                                                    if (newIframeUrl.trim()) {
                                                        const exists = basicInfoForm.video
                                                            .filter(v => v?.media_type !== 'video')
                                                            .find(v => v?.url == convertToYoutubeId(newIframeUrl.trim()))
                                                        if(exists) {
                                                            alert('iframe is already in your list')
                                                            setNewIframeUrl("");
                                                            setShowIframeModal(
                                                                false,
                                                            );
                                                            return ;
                                                        }
                                                        setBasicInfoForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                video: [
                                                                    ...prev.video,
                                                                    {
                                                                        media_type: "iframe",
                                                                        url: convertToYoutubeId(
                                                                            newIframeUrl,
                                                                        ),
                                                                    },
                                                                ],
                                                            }),
                                                        );
                                                        setNewIframeUrl("");
                                                        setShowIframeModal(
                                                            false,
                                                        );
                                                    }
                                                }}
                                                onCancelUrl={() => {
                                                    setShowIframeModal(false);
                                                    setNewIframeUrl("");
                                                }}
                                            />
                                        )}
                                    </div>
                                ),
                            },
                            {
                                id: "device-upload",
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <span>Device Upload</span>
                                        {/* Badge: green if a video exists, gray otherwise */}
                                        <span
                                            className={`w-3 h-3 rounded-full ${
                                                basicInfoForm.video.some(
                                                    (v) =>
                                                        v?.media_type ===
                                                        "video",
                                                )
                                                    ? "bg-green-500"
                                                    : "bg-gray-400"
                                            }`}
                                        />
                                    </div>
                                ),
                                Icon: Upload,
                                content: (
                                    <div className="space-y-4">
                                        {basicInfoForm.video.some(
                                            (v) => v?.media_type === "video",
                                        ) && (
                                            <div className="relative group">
                                                <video
                                                    src={getMediaSrcOrDefault(
                                                        basicInfoForm.video.find(
                                                            (v) =>
                                                                v?.media_type ===
                                                                "video",
                                                        ) ?? null,
                                                        "video",
                                                    )}
                                                    controls
                                                    className="w-full max-w-2xl rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveVideo}
                                                    style={{color :theme.text  , background :theme.error}}
                                                    className="absolute top-2 right-2 p-2 rounded-full shadow-lg  opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            onClick={() =>
                                                videoInputRef.current?.click()
                                            }
                                            className="w-full flex flex-col items-center justify-center p-12 transition-all"
                                            disabled={basicInfoForm.video.some(
                                                (el) =>
                                                    el?.media_type === "video",
                                            )}
                                        >
                                            <Upload className="w-12 h-12 mb-3" />
                                            Upload Video
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </>
    );
};

export default MediaSection;

interface IframeEntryModelProps {
  newIframeUrl: string;
  onChangeIframeUrl: (newUrl: string) => void;
  onValidateUrl: () => void;
  onCancelUrl: () => void;
}

const IframeEntryModel = ({
  newIframeUrl,
  onChangeIframeUrl,
  onValidateUrl,
  onCancelUrl,
}: IframeEntryModelProps) => {
  const {
    state: { currentTheme },
  } = useStoreConfigCtx();

  // Convert YouTube URL to embed URL
  const embedUrl = newIframeUrl ? convertYoutubeToEmbed(newIframeUrl) : '';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: currentTheme.overlay }}
    >
      <div
        className="p-6 rounded-lg w-96"
        style={{
          background: currentTheme.modal,
          boxShadow: currentTheme.shadowMd,
          borderRadius: currentTheme.borderRadius,
        }}
      >
        <h3
          className="text-lg font-semibold mb-3"
          style={{ color: currentTheme.text }}
        >
          Add YouTube URL
        </h3>

        <input
          type="url"
          placeholder="Paste YouTube URL here"
          value={newIframeUrl}
          onChange={(e) => onChangeIframeUrl(e.target.value)}
          className="w-full p-2 mb-4 rounded-lg border"
          style={{
            background: currentTheme.bgSecondary,
            borderColor: currentTheme.border,
            color: currentTheme.text,
            borderRadius: currentTheme.borderRadius,
          }}
        />

        {/* Small live preview */}
        {embedUrl && (
          <div
            className="mb-4"
            style={{
              width: 'calc(100% + 0px)', // full width of modal content (exclude padding)
              marginLeft: '-0px', // remove padding effect
            }}
          >
            <iframe
              title="iframe-preview"
              src={embedUrl}
              className="w-full aspect-video rounded-md"
              allowFullScreen
              style={{
                borderRadius: currentTheme.borderRadius,
              }}
            />
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancelUrl}
            className="px-4 py-2 rounded-md"
            style={{
              background: currentTheme.bgSecondary,
              color: currentTheme.textSecondary,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: currentTheme.borderRadius,
            }}
          >
            Cancel
          </button>

          <button
            onClick={onValidateUrl}
            className="px-4 py-2 rounded-md"
            style={{
              background: currentTheme.primary,
              color: currentTheme.textInverse,
              borderRadius: currentTheme.borderRadius,
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
