import { StoreConfigContext } from "@/context/StoreConfigContext";
import { currentThemeExample } from "@/data/currentTheme";
import { StoreConfigAction, StoreConfigType } from "@/types/StoreConfigTypes";
import { useReducer } from "react"



const initialState : StoreConfigType= { 
  currentNiche : "fashion" , 
  currentThemeMode : "dark" ,
  currentThemeStyle : "luxuryNoir" , 
  currentTheme : currentThemeExample.luxuryNoir.dark,
  currentLayoutStyle : 'grid'  , 
  currentCardConf : {
    cardId : 'card-1'  , 
    showPrice : true , 
    showRating : true  , 
    isRounded : true
   
  }

}



const reducer = (state : StoreConfigType , action : StoreConfigAction) : StoreConfigType  => {
   switch(action.type) {
      case "SET_LAYOUT" :
       return {...state , currentLayoutStyle : action.payload }

      case "SET_THEME_STYLE" :
       return {...state , currentThemeStyle : action.payload }
      case "SET_THEME_MODE" :
       return {...state , currentThemeMode : action.payload }

      case "SET_NICHE" : 
       return {...state , currentNiche : action.payload }
      
      case "SET_CARD" : 
       return {...state ,
              currentCardConf : action.payload // this payload is an intaire object isshowprice / isRounded etc
         }

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