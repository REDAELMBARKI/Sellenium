




import { ColorsContext } from "@/context/ColorsContext";
import { useContext } from "react"




export const useColorsCtx = () =>{
   
    const ctx = useContext(ColorsContext) 
    if (!ctx) throw new Error("colors contexts should be passed to ColorsProvider")

    return ctx ; 
}