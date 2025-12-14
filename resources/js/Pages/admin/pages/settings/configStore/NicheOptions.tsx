import React from "react";

interface NicheOptionsProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const niches = [
  { id: "fashion", label: "Fashion" },
  { id: "perfume", label: "Perfume" },
  { id: "electronics", label: "Electronics" },
];

const NicheOptions: React.FC<NicheOptionsProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Niche</h2>

      <div className="grid grid-cols-2 gap-4">
        {niches.map((niche) => (
          <button
            key={niche.id}
            onClick={() =>
              setConfig((prev: any) => ({ ...prev, niche: niche.id }))
            }
            className={`p-4 rounded-xl border text-left transition-all ${
              config.niche === niche.id
                ? "border-slate-900 bg-slate-100"
                : "border-slate-200"
            }`}
          >
            <div className="font-medium">{niche.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NicheOptions;
