import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThemePalette } from "@/types/ThemeTypes";
import { Color } from "@/types/inventoryTypes";


interface Media {
  url: string;
  id: string | number;
}

interface MediaGalleryProps {
  media: (Media & {
      variant_id : number 
  })[];
  video?: { url: string; id: string } | null;
  theme?: ThemePalette;
  selectedColor? : Color & {
      variant_id : number 
  };
  maxHeight?: number;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media, video, theme , selectedColor, maxHeight }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const allMedia = [...media];
  // const allMedia = [...media, ...(video ? [{ ...video }] : [])];

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  const goToNext = () =>
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));

  const t = theme;


  useEffect(() => {
    const mediaIndex = allMedia.findIndex(m => m.variant_id === selectedColor?.variant_id);
    setCurrentIndex(mediaIndex) ;
  }, [selectedColor]);


  
  return (
    <div className="flex gap-3" style={{ height: maxHeight ?? 480, maxHeight: maxHeight ?? 480 }}>
      {/* THUMBNAIL STRIP */}
      {allMedia.length > 1 && (
        <div
          ref={stripRef}
          className="flex flex-col gap-2 w-[72px] flex-shrink-0 overflow-y-auto pr-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: `${t?.border ?? "#cbd5e1"} transparent` }}
        >
          {allMedia.map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative flex-shrink-0 w-full overflow-hidden transition-all duration-200"
              style={{ aspectRatio: "1 / 1" }}
            >
              <img
                src={item.url}
                alt={String(item.id)}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div
                className="absolute inset-0 transition-all duration-200"
                style={{
                  boxShadow: index === currentIndex
                    ? `inset 0 0 0 2px ${t?.primary ?? "#0f172a"}`
                    : undefined,
                  background: index === currentIndex ? "transparent" : "rgba(255,255,255,0.15)",
                }}
              />
              {index === currentIndex && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: t?.primary ?? "#0f172a" }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* MAIN IMAGE */}
      <div
        className="relative flex-1 overflow-hidden group"
        style={{
          background: t?.card ?? "#f8fafc",
          borderRadius: t?.borderRadius ?? "16px",
          boxShadow: t?.shadowLg ?? "0 10px 40px rgba(0,0,0,0.12)",
        }}
      >
        {allMedia[currentIndex] && (
          <img
            key={currentIndex}
            src={allMedia[currentIndex].url}
            alt={String(allMedia[currentIndex].id)}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
            style={{ animation: "fadeIn 0.3s ease" }}
          />
        )}

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {allMedia.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{ background: t?.bgSecondary ?? "rgba(255,255,255,0.9)", color: t?.text }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{ background: t?.bgSecondary ?? "rgba(255,255,255,0.9)", color: t?.text }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {allMedia.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: index === currentIndex ? 24 : 6,
                  height: 6,
                  background: index === currentIndex ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {allMedia.length}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0.6; transform: scale(1.02); }
          to   { opacity: 1;   transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MediaGallery;