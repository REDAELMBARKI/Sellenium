const TogglableCard = ({changeToggledId , option , isPreview , isCurrent , handleOptionToggle}:{handleOptionToggle : (id : string) => void , isPreview : boolean , isCurrent : boolean , changeToggledId : (id : string) => void , option : {id : string , image : string , label : string } }) => {
  return (
    <div
                  onClick={() => changeToggledId(option.id)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col cursor-pointer
                    ${isPreview ? "border-blue-500" : "border-slate-200"}
                  `}
                >
                  <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
                    <h4 className="font-semibold text-slate-900">{option.label}</h4>
                    <button
                      onClick={() => handleOptionToggle(option.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isCurrent ? "bg-blue-500" : "bg-slate-300 hover:bg-slate-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isCurrent ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <img
                    src={option.image}
                    alt={option.label}
                    className="w-full h-32 object-cover cursor-pointer"
                  />

                  {isCurrent && (
                    <div className="absolute inset-0 bg-black/20 flex items-start justify-start p-2 rounded-b-xl">
                      <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
                        <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    </div>
                  )}
                </div>
  )
}

export default TogglableCard ;