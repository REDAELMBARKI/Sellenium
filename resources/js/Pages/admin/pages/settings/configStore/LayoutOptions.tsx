import React from "react";

interface LayoutOptionsProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const LayoutOptions: React.FC<LayoutOptionsProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Layout Options</h2>

      <div>
        <label className="block mb-2 font-medium">Layout Type</label>
        <select
          className="w-full border rounded-lg p-2"
          value={config.layoutType}
          onChange={(e) =>
            setConfig((prev: any) => ({ ...prev, layoutType: e.target.value }))
          }
        >
          <option value="grid">Grid</option>
          <option value="stack">Stacked</option>
        </select>
      </div>
    </div>
  );
};

export default LayoutOptions;