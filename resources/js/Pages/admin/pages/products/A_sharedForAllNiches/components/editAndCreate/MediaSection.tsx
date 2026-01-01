
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import { getMediaSrcOrDefault } from "@/functions/getMediaSrcOrDefault";
import { Cover } from "@/types/inventoryTypes";
import { ImagePreviewItem } from "@/types/mediaTypes";
import { Upload, X } from "lucide-react";
import { v4 } from "uuid";

interface MediaSectionProps {
    setVideoPreview: React.Dispatch<React.SetStateAction<string | null>>
    videoPreview : string | null;
}

const MediaSection = ({
    setVideoPreview,
    videoPreview,
}: MediaSectionProps) => {
      const {state :{currentTheme}} = useStoreConfigCtx()

    const { basicInfoForm , setBasicInfoForm} = useProductDataCtx()

    const handleCoversUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newCovers = Array.from(files).map((f) => ({id: v4() , path : URL.createObjectURL(f)}));
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
        const id = v4()
        if (!file) return;
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
        setBasicInfoForm({ ...basicInfoForm, video: {file , url , id } });
    };


    return (
        <>
            <div>
                <label
                    className="block text-sm font-bold mb-4 uppercase tracking-wide"
                    style={{ color: currentTheme.text }}
                >
                    Covers
                </label>
                <div className="flex flex-wrap gap-4">
                    {(basicInfoForm.covers || [] as (Cover | ImagePreviewItem)[] ).map((c, i) => (
                        <div key={i} className="relative w-32 h-32 group">
                            <img
                                src={getMediaSrcOrDefault(c , 'image')}
                                alt={`cover-${i}`}
                                className="w-full h-full object-cover rounded-xl shadow-md group-hover:opacity-75 transition-opacity"
                            />
                            <button
                                onClick={() => handleRemoveCover(i)}
                                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4 text-black" />
                            </button>
                        </div>
                    ))}
                    <label
                        className="flex items-center justify-center w-32 h-32 rounded-xl cursor-pointer transition-colors hover:bg-gray-300"
                        style={{
                            backgroundColor: `${currentTheme.bg}88`,
                            borderWidth: "2px",
                            borderColor: currentTheme.border,
                            borderStyle: "dashed",
                        }}
                    >
                        <Upload
                            className="w-6 h-6"
                            style={{ color: currentTheme.text }}
                        />
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoversUpload}
                        />
                    </label>
                </div>
            </div>

            <div>
                <label
                    className="block text-sm font-bold mb-4 uppercase tracking-wide"
                    style={{ color: currentTheme.text }}
                >
                    Video
                </label>
                {(basicInfoForm.video && Object.keys(basicInfoForm.video).length > 0) && videoPreview !== null && (
                    <video
                        src={videoPreview ?? ("url" in basicInfoForm.video ? basicInfoForm.video.url : "path" in basicInfoForm.video ?  basicInfoForm.video.path : '/images/ .mp4') }
                        controls
                        className="w-full max-w-2xl rounded-xl mb-4 shadow-lg"
                    />
                )}
                <label
                    className="flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 shadow-md font-semibold w-fit"
                    style={{
                        backgroundColor: currentTheme.accent,
                        color: currentTheme.text,
                        borderWidth: "2px",
                        borderColor: currentTheme.border,
                    }}
                >
                    <Upload className="w-6 h-6" /> Upload Video
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                    />
                </label>
            </div>
        </>
    );
};

export default MediaSection;
