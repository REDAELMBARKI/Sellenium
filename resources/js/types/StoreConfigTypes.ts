import {  ThemeMode, ThemePalette, ThemeStyle } from "./ThemeTypes";

export type LayoutStyle = "grid" | "list" | "mansonry" | "premium" ;



export type LayoutCardsDataType = {
  style : LayoutStyle 
  label : LayoutStyle 
  image : string 

}

export type ThemeCardsDataType = {
  style : ThemeStyle
  label : ThemeStyle 
  image : string 

}

export type NicheCardsDataType = {
  style : NicheItem 
  label : NicheItem 
  image : string 
  info? : string
}


export type NicheItem = "perfumes" | "fashion" | "electronics"  


export interface StoreConfigType {  
     
    currentThemeStyle : ThemeStyle // is the theme name
    currentNiche : NicheItem
    currentThemeMode : ThemeMode 
    currentTheme  : ThemePalette // this is real theme has colors 
    currentLayoutStyle : LayoutStyle 
    currentCardConf : CardConfig

}

export type StoreConfigAction =
  | { type: "SET_LAYOUT"; payload: LayoutStyle }
  | { type: "SET_THEME_MODE"; payload: ThemeMode }
  | { type: "SET_THEME_STYLE"; payload: ThemeStyle }
  | { type: "SET_NICHE"; payload: NicheItem }
  | { type: "SET_CARD"; payload:  CardConfig};


export type CardOption = "card-1" | "card-2" | "card-3" | "card-4" | "card-5" | "card-6" 
export type CardConfig = {
  cardId : CardOption 
  showPrice : boolean 
  showRating : boolean 
  isRounded : boolean 
  hasBorder : boolean
}

