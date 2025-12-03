import React, { createContext } from "react";

export type NicheItem =  "default" | "fashion" | "parfumes" | "electronics"


interface NicheType {
    currentNiche  : NicheItem
     setCurrentNiche : React.Dispatch<React.SetStateAction<NicheItem>>
}



export const NicheContext =  createContext<NicheType>(null!) ;