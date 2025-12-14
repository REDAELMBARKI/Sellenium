import { useColorsCtx } from "@/contextHooks/useColorsCtx";
import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
  Icon: React.ElementType;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || "");
  const {currentTheme} = useColorsCtx()
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200 min-w-max">
          {tabs.map(({Icon , ...tab}) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative `}
                style={{
                  color: activeTab === tab.id ? currentTheme.accentHover : currentTheme.textMuted , 
                  background : activeTab === tab.id ? currentTheme.borderHover : 'transparent',
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background : activeTab === tab.id ? currentTheme.accentHover : 'transparent'}}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-8">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`transition-all duration-300 ease-in-out ${
              activeTab === tab.id
                ? "opacity-100 block animate-fadeIn"
                : "opacity-0 hidden"
            }`}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
