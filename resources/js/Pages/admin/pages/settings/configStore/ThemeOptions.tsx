import React from "react";

interface ThemeOptionsProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const ThemeOptions: React.FC<ThemeOptionsProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Theme Options</h2>

      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded-lg border ${
            config.theme === "light" ? "bg-slate-200" : "bg-white"
          }`}
          onClick={() => setConfig((prev: any) => ({ ...prev, theme: "light" }))}
        >
          Light
        </button>

        <button
          className={`px-4 py-2 rounded-lg border ${
            config.theme === "dark" ? "bg-slate-800 text-white" : "bg-white"
          }`}
          onClick={() => setConfig((prev: any) => ({ ...prev, theme: "dark" }))}
        >
          Dark
        </button>
      </div>
    </div>
  );
};

export default ThemeOptions;