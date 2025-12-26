import React, { useEffect, useState } from "react";


import TogglableCard from "@/components/partials/TooglableCard";
import {   LayoutCardsDataType, LayoutStyle, ThemeCardsDataType } from "@/types/StoreConfigTypes";
import { useStoreConfigCtx } from "@/contextHooks/useStoreConfigCtx";
import SkeletonLayout from "@/components/partials/previewSkeletons/SkeletonLayout";
import StorePreview from "../layoutConfig/StorePreview";
import { ThemeMode, ThemePalette, ThemeStyle } from "@/types/ThemeTypes";
import { currentThemeExample } from "@/data/currentTheme";
import { MoonIcon, SunIcon } from "lucide-react";


const themes : ThemeCardsDataType[] = [
  {
    style:  "luxuryNoir", 
    label : "luxuryNoir" ,
    image: "/images/fashionNiche.png",
  },
  {
    style: 'softPastel',
    label: 'softPastel',
    image: "/images/perfumesNiche.png",
  },
 
];


const ThemeConfig = () => {
  const {state : {currentThemeStyle , currentThemeMode ,currentTheme , 
    currentLayoutStyle // this is current Layout that can be used as a preview in the skelepton
  } , dispatch} = useStoreConfigCtx()

  const [previewThemeStyle, setPreviewThemeStyle] = useState<ThemeStyle>(currentThemeStyle);
  const [previewThemeMode, setPreviewThemeMode] = useState<ThemeMode>(currentThemeMode);
  const [previewThemePalette, setPreviewThemePalette] =
      useState<ThemePalette>(currentTheme);
   const [animate, setAnimate] = useState(false);

  // Toggle animation state every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPreviewThemePalette(currentTheme);
  }, [previewThemeStyle, currentTheme]);


  useEffect(() => {
     setPreviewThemePalette(currentThemeExample[previewThemeStyle][previewThemeMode])
  }, [previewThemeMode , previewThemeStyle]);



  useEffect(() => {
     setPreviewThemeMode(currentThemeMode)
  }, [currentThemeMode]);

  const handleThemeToggle = (ThemeStyle: ThemeStyle) => {
    dispatch({type : "SET_THEME_STYLE" , payload : ThemeStyle})
    setPreviewThemeStyle(ThemeStyle);
  };

  const toggleThemeMode = () => {
       setPreviewThemeMode( prev => prev === "dark" ? "light" : 'dark')
       
  }

  return (
    <div>


      <div className="flex gap-6">
        <div className="w-1/4 p-5 overflow-y-auto   w-[70%]">
          <h2 className="text-xl font-semibold mb-4">Themes</h2>
          <div className="grid grid-cols-2  gap-4">
            {themes.map((Theme) => {
              const isCurrent = currentThemeStyle === Theme.style;
              const isPreview = previewThemeStyle === Theme.style;
              return (
                 
                   <TogglableCard  key={Theme.style} 
                     handleOptionToggle={handleThemeToggle} 
                     isCurrent={isCurrent} 
                     isPreview={isPreview}
                     changeToggledStyle={(style:ThemeStyle) => setPreviewThemeStyle(style)}  
                     option={Theme}
                    />
              );
            })}
          </div>
        </div>

      
            <div className="w-2/4 p-4 rounded-lg border "
            style={{borderColor : currentTheme.border }}
            >
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Store Preview</h3>
              <button
                onClick={toggleThemeMode}
                className={`
                  p-2 rounded-md text-sm 
                 
                  transition-transform duration-500
                  ${animate ? " rotate-12" : "rotate-0"}
                `}
                style={{background : animate ? currentTheme.accent : currentTheme.accentHover , 
                      color : currentTheme.textInverse
                }}
              >

                {previewThemeMode === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>

            <StorePreview 
             previewThemePalette={previewThemePalette}
            >
              <SkeletonLayout 
                previewThemePalette={previewThemePalette}
                previewThemeMode={previewThemeMode}
                previewLayoutStyle={currentLayoutStyle}
                previewThemeStyle={previewThemeStyle}
              />
            </StorePreview>
          </div>
      </div>
    </div>
  );
};

export default ThemeConfig;



