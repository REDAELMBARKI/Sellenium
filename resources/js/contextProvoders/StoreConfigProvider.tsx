import { StoreConfigContext } from "@/context/StoreConfigContext";
import { currentThemeExample } from "@/data/currentTheme";
import { NicheItem, StoreConfigAction, StoreConfigType } from "@/types/StoreConfigTypes";
import { useReducer, useState } from "react"



const initialState : StoreConfigType= { 
  currentNiche : "fashion" , 
  currentThemeMode : "light" ,
  currentTheme : currentThemeExample.luxuryNoir.dark,
  layoutType : 'grid'  , 
  cardConf : {
    cardId : 'card-1'  , 
    showPrice : true , 
    showRating : true  , 
    isRounded : true
     
  }

}



const reducer = (state : StoreConfigType , action : StoreConfigAction) : StoreConfigType  => {
   switch(action.type) {
      case "SET_LAYOUT" :
      case "SET_NICHE" : 
      case "SET_THEME_MODE" :
      case "SET_CARD" : 
      default : return state ;
      
   }
}
const StoreConfigProvider = ({children} : {children : React.ReactNode}) => {
       const [state , dispatch] = useReducer(reducer , initialState)
       return (
          <StoreConfigContext.Provider value={{state ,  dispatch}} >
             {children}
          </StoreConfigContext.Provider>
       )
}


export default  StoreConfigProvider ; 