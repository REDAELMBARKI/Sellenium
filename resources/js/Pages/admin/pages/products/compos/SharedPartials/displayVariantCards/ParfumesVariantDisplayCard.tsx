import { Edit2, Trash2, Package, SprayCan } from "lucide-react";
import { useState } from "react";
import { currentTheme } from "@/data/currentTheme";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import { VariantDisplayProps } from "@/types/productsTypes";
import { useVariantsDisplayActions } from "@/functions/useVariantsDisplayActions";
import { useProductUICtx } from "@/contextHooks/sharedhooks/useProductUICtx";

export const ParfumesVariantDisplayCard = ({ variant }: VariantDisplayProps) => {
  const { productData } = useProductDataCtx();
  if (!productData || variant.niche !== "parfumes") return null;

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const { setDeleteModalOpen, deleteModalOpen } = useProductUICtx();
  const { cancelDelete, requestDelete, editVariant } = useVariantsDisplayActions();

  const att = variant.attributes; 

  return (
    <>
      <div
        className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full overflow-hidden flex flex-col md:flex-row md:min-h-[250px] group relative"
        style={{
          backgroundColor: currentTheme.bg,
          border: `2px solid ${currentTheme.border}`,
        }}
      >
        {/* IMAGE SECTION - TOP ON MOBILE, LEFT ON DESKTOP */}
        <div className="w-full md:w-40 h-48 md:h-auto flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
          {att?.covers?.length > 0 ? (
            <img
              src={att.covers[0]}
              alt="parfume-cover"
              className="max-h-32 max-w-full object-contain drop-shadow-lg"
            />
          ) : (
            <div className="text-center space-y-2">
              <div
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: currentTheme.buttonSecondary }}
              >
                <SprayCan className="w-8 h-8" style={{ color: currentTheme.accent }} />
              </div>
              <p className="text-slate-500 text-xs font-semibold">No Image</p>
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="flex-1 p-4 flex flex-col">
          {/* ATTRIBUTES FLEX */}
          <div className="flex flex-row flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
            {/* CONCENTRATION */}
            <div
              className="rounded-xl p-2 md:p-3 shadow-sm border-2 flex-1 min-w-[110px] md:min-w-[130px]"
              style={{
                backgroundColor: currentTheme.buttonSecondary,
                borderColor: currentTheme.border,
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 text-slate-500">
                Concentration
              </h4>
              <div
                className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-white text-xs md:text-sm font-bold shadow-md text-center"
                style={{ backgroundColor: currentTheme.buttonPrimary }}
              >
                {att.concentration}
              </div>
            </div>

            {/* VOLUME ML */}
            <div
              className="rounded-xl p-2 md:p-3 shadow-sm border-2 flex-1 min-w-[110px] md:min-w-[130px]"
              style={{
                backgroundColor: currentTheme.buttonSecondary,
                borderColor: currentTheme.border,
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 text-slate-500">
                Volume
              </h4>
              <div
                className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-bold shadow-md text-xs md:text-sm text-center"
                style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
              >
                {att.volume_ml} ml
              </div>
            </div>

            {/* FRAGRANCE FAMILY */}
            <div
              className="rounded-xl p-2 md:p-3 shadow-sm border-2 flex-1 min-w-[110px] md:min-w-[130px]"
              style={{
                backgroundColor: currentTheme.buttonSecondary,
                borderColor: currentTheme.border,
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 text-slate-500">
                Family
              </h4>
              <div
                className="px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-bold shadow-md text-white text-center"
                style={{ backgroundColor: currentTheme.accent }}
              >
                {att.fragranceFamily}
              </div>
            </div>
          </div>

          {/* NOTES FLEX */}
          <div className="flex flex-row flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
            {["topNotes", "middleNotes", "baseNotes"].map((noteType) => (
              att[noteType]?.length > 0 && (
                <div
                  key={noteType}
                  className="rounded-xl p-2 md:p-3 shadow-sm border-2 flex-1 min-w-[150px] md:min-w-[180px]"
                  style={{
                    backgroundColor: currentTheme.buttonSecondary,
                    borderColor: currentTheme.border,
                  }}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1 md:mb-2 text-slate-500">
                    {noteType.replace("Notes", " Notes")}
                  </h4>

                  <div className="flex flex-wrap gap-1">
                    {att[noteType].map((note: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs rounded-lg font-semibold shadow-sm"
                        style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS - ABSOLUTE AT BOTTOM OF ENTIRE CARD */}
        <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-row gap-3 p-4 bg-black/70 backdrop-blur-lg">
          <button
            onClick={() => {
              editVariant(variant);
              setIsFormModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all font-bold text-sm shadow-lg hover:shadow-xl"
            style={{ backgroundColor: currentTheme.buttonPrimary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = currentTheme.buttonHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = currentTheme.buttonPrimary)}
          >
            <Edit2 className="w-4 h-4" />
            Edit Variant
          </button>

          <button
            onClick={() => requestDelete(Number(variant.id))}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-bold text-sm shadow-lg hover:shadow-xl"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>


      {isFormModalOpen && (
                      <ParfumesEditForm  key={variant.id}    />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        name="variant"
        entityType="variant"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => cancelDelete()}
      />
    </>
  );
};