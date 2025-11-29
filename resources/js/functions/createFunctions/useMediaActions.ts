import { useInventory } from "@/contextHooks/createProductCtxHooks/useInventory";
import { useMedia } from "@/contextHooks/createProductCtxHooks/useMedia";
import { useProductForm } from "@/contextHooks/createProductCtxHooks/useProductForm";

interface CoverImage {
    [key: string]: File;
}

export const useMediaActions = () => {
    const {
        images,
        setImages,
        setFileToPass,
        setIsVariantCoverPreview,
        isVariantCoverPreview,
        imagesPlaceHolders,
        setImagesPlaceHolders,
        setPlaceHolderNotFilled,
        setIsAllCoversDeleted,
    } = useMedia();

    const { currentVariant, setCurrentVariant } = useInventory();
    const { data, setData } = useProductForm();

    const handleImageUpload = (field: string, file: File | null) => {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const base64 = e.target?.result as string;

            setImages((prevImages) => ({
                ...prevImages,
                [field]: base64,
            }));

            if (field === "thumbnail") {
                setData("thumbnail", file as unknown as string);
                setFileToPass(file);

                if (!images.cover_1) {
                    setIsVariantCoverPreview(true);
                }
            } else if (field.startsWith("cover_")) {
                setCurrentVariant((prev) => ({
                    ...prev,
                    covers: [...(prev.covers || []), { [field]: file }],
                }));
                setIsVariantCoverPreview(false);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (field: string) => {
        setImages((prev) => ({
            ...prev,
            [field]: null,
        }));

        if (field === "thumbnail") {
            setData("thumbnail", "");

            if (isVariantCoverPreview) {
                setImages({});
                setIsVariantCoverPreview(false);
            }
        } else {
            const covers = currentVariant.covers.filter(
                (cover: CoverImage) => !Object.prototype.hasOwnProperty.call(cover, field)
            );

            setCurrentVariant((prev) => ({
                ...prev,
                covers,
            }));

            setImages((prev) => ({
                ...prev,
                [field]: null,
            }));

            if (currentVariant.covers.length - 1 === 0) {
                setIsAllCoversDeleted(true);
            }
        }
    };

    const addImagePlaceHolder = () => {
        const coverFieldCount = currentVariant.covers.length;

        if (coverFieldCount === imagesPlaceHolders.length) {
            const newPlaceHolder = imagesPlaceHolders.length + 1;
            setImagesPlaceHolders([...imagesPlaceHolders, newPlaceHolder]);
        } else {
            setPlaceHolderNotFilled(true);

            setTimeout(() => {
                setPlaceHolderNotFilled(false);
            }, 200);
        }
    };
  

    const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
   };


    return {
        fileToDataUrl , 
        handleImageUpload,
        handleRemoveImage,
        addImagePlaceHolder,
    };
};