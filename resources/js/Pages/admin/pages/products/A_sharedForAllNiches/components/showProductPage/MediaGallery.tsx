import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Media {
  path: string;
  id: string;
}

interface MediaGalleryProps {
  media: Media[];
  video?: { path: string; id: string } | null;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media, video }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const allMedia = [...media, ...(video ? [{ ...video, isVideo: true }] : [])];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden group">
        {allMedia[currentIndex] && (
          <img
            src={allMedia[currentIndex].path}
            alt={allMedia[currentIndex].id}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {allMedia.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5 text-slate-900" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5 text-slate-900" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {allMedia.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allMedia.slice(0, 4).map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <img
                src={item.path}
                alt={item.id}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
