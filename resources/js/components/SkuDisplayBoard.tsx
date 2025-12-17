
import React, { useState } from "react";
import { Clipboard, Check } from "lucide-react";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
interface SkuDisplayProps {
  sku? : string;
}

const SkuDisplayBoard: React.FC<SkuDisplayProps> = ({ sku }) => {
       const {state :{currentTheme}} = useStoreConfigCtx()

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!sku) return;

    navigator.clipboard.writeText(sku).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2s
    });
  };

  return (
    <div>
      <label
        className="block text-sm font-bold mb-4 uppercase tracking-wide"
        style={{ color: currentTheme.text }}
      >
        SKU
      </label>

      <div className="flex items-center gap-2 w-full">
        <div
          className="flex-1 px-5 py-4 rounded-xl font-semibold shadow-sm select-all"
          style={{
            backgroundColor: currentTheme.buttonSecondary,
            color: currentTheme.text,
            borderWidth: "2px",
            borderColor: currentTheme.border,
          }}
        >
          {sku || "Not set"}
        </div>

        <button
          onClick={handleCopy}
          disabled={!sku}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          style={{ backgroundColor: currentTheme.buttonSecondary }}
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Clipboard className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SkuDisplayBoard;
