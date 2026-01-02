import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { getMediaSrcOrDefault } from "@/functions/getMediaSrcOrDefault";
import { Cover } from "@/types/inventoryTypes";
import { ImagePreviewItem } from "@/types/mediaTypes";
import { Film, Image as ImageIcon, X, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { v4 } from "uuid";

interface MediaSectionProps {
  setVideoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  videoPreview: string | null;
}

const MediaSection = ({ setVideoPreview, videoPreview }: MediaSectionProps) => {
  const { state: { currentTheme } } = useStoreConfigCtx();
  const { basicInfoForm, setBasicInfoForm } = useProductDataCtx();
  const [isOpen, setIsOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleCoversUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newCovers = Array.from(files).map((f) => ({
      id: v4(),
      path: URL.createObjectURL(f),
    }));
    setBasicInfoForm({
      ...basicInfoForm,
      covers: [...(basicInfoForm.covers || []), ...newCovers],
    });
  };

  const handleRemoveCover = (index: number) => {
    const updated = [...(basicInfoForm.covers || [])];
    updated.splice(index, 1);
    setBasicInfoForm({ ...basicInfoForm, covers: updated });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = v4();
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    setBasicInfoForm({ ...basicInfoForm, video: { file, url, id } });
  };

  const handleRemoveVideo = () => {
    setVideoPreview(null);
    setBasicInfoForm({ ...basicInfoForm, video: {} });
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

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length > 0) {
      const newCovers = files.map((f) => ({
        id: v4(),
        path: URL.createObjectURL(f),
      }));
      setBasicInfoForm({
        ...basicInfoForm,
        covers: [...(basicInfoForm.covers || []), ...newCovers],
      });
    }
  };

  const hasImages = basicInfoForm.covers && basicInfoForm.covers.length > 0;
  const hasVideo =
    basicInfoForm.video &&
    Object.keys(basicInfoForm.video).length > 0 &&
    videoPreview !== null;

  const headerActions = (
    <>
      <button
        onClick={() => imageInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-all"
      >
        <ImageIcon className="w-4 h-4" />
        Add Images
      </button>
      <button
        onClick={() => videoInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition-all"
      >
        <Film className="w-4 h-4" />
        Add Video
      </button>
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
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Images</h4>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 rounded-lg border-2 border-dashed transition-all ${
              isDragging
                ? "border-blue-400 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            {(basicInfoForm.covers || ([] as (Cover | ImagePreviewItem)[])).map(
              (c, i) => (
                <div
                  key={i}
                  className="relative aspect-square group animate-in fade-in zoom-in duration-200"
                >
                  <img
                    src={getMediaSrcOrDefault(c, "image")}
                    alt={`cover-${i}`}
                    className="w-full h-full object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  <button
                    onClick={() => handleRemoveCover(i)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white hover:bg-red-50 shadow-md opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )
            )}
            <button
              onClick={() => imageInputRef.current?.click()}
              className="aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs font-medium text-gray-600">
                Add Images
              </p>
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Video</h4>
          <div className="space-y-4">
            {hasVideo && (
              <div className="relative group">
                <video
                  src={
                    videoPreview ??
                    ("url" in basicInfoForm.video
                      ? basicInfoForm.video.url
                      : "path" in basicInfoForm.video
                      ? basicInfoForm.video.path
                      : "/images/ .mp4")
                  }
                  controls
                  className="w-full max-w-2xl rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                <button
                  onClick={handleRemoveVideo}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white hover:bg-red-50 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                  aria-label="Remove video"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
            )}
            <button
              onClick={() => videoInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center p-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 transition-all"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600 mb-1">
                {hasVideo ? "Replace Video" : "Upload Video"}
              </p>
              <p className="text-xs text-gray-400">
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
