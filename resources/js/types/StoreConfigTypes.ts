import { number } from "framer-motion";
import { ThemeId, ThemeMode, ThemePalette } from "./ThemeTypes";

export type LayoutStyle = "grid" | "list" | "mansonry" | "premium" ;

export interface StorePreviewProps {
  previewLayoutId : LayoutStyle 
  config: {
    layoutId: LayoutStyle
    theme: ThemeMode
    cardSettings : {
      cardNameId : string ,
      showPrice: boolean;
      showRating: boolean;
      isRounded : boolean 
    }
  };

}

export interface LayoutConfigProps {
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

export interface LayoutDataType {
  id : LayoutStyle 
  label : LayoutStyle 
  image : string 
}



export type NicheItem = "perfumes" | "fashion" | "electronics"  


export interface StoreConfigType {  
    currentNiche : NicheItem
    currentThemeMode : ThemeMode ,
    currentTheme  : ThemePalette
    layoutType : LayoutStyle 
    cardConf : CardConfig

}

export type StoreConfigAction =
  | { type: "SET_LAYOUT"; payload: LayoutStyle }
  | { type: "SET_THEME_MODE"; payload?: ThemeMode }
  | { type: "SET_THEME_PALETTE"; payload?: ThemeId }
  | { type: "SET_NICHE"; payload: NicheItem }
  | { type: "SET_CARD"; payload:  CardConfig};


export type CardOption = "card-1" | "card-2" | "card-3"
export type CardConfig = {
  cardId : CardOption 
  showPrice : boolean 
  showRating : boolean 
  isRounded : boolean 
}

