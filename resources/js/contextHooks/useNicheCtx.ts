import { NicheContext } from "@/context/NicheContext"
import { useContext } from "react"




export const useNicheCtx = () =>{
   
    const ctx = useContext(NicheContext) 
    if (!ctx) throw new Error("niche contexts should be passed to NicheProvider")

    return ctx ; 
}