





const NewColorSelectorPreview = ({previewColor  ,setPreviewColor, handleAddColor}) => {
    return ( <div className="flex items-center gap-4 mt-6">
                        {previewColor && (
                            <div
                                className="w-12 h-12 rounded-full ring-4 ring-purple-500 shadow-md transition-transform duration-200 hover:scale-110"
                                style={{ backgroundColor: previewColor.hex }}
                                title="Preview color"
                            />
                        )}

                        <div
                            onClick={() => document.getElementById("custom-color-input")?.click()}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center text-white text-xl font-bold ring-2 ring-slate-300 hover:ring-slate-400 shadow-sm transition-all duration-200 hover:scale-110 cursor-pointer"
                        >
                            +
                            <input
                                id="custom-color-input"
                                type="color"
                                className="absolute opacity-0 pointer-events-none"
                                onChange={(e) => {
                                    setPreviewColor({
                                        id: Date.now(),
                                        name: "Custom",
                                        hex: e.target.value,
                                    });
                                }}
                            />
                        </div>

                        {previewColor && (
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="px-3 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 ring-2 ring-orange-300 animate-pulse"
                            >
                                + Add this color
                            </button>
                        )}
                    </div>)
}

export default NewColorSelectorPreview ; 