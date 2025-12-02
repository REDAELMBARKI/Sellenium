import React, { createContext } from "react";

export interface NicheItem {
        id : string | number , 
        name : "default" | "fashion" | "parfumes" | "electornics"
}

interface NicheType {
    currentNiche  : NicheItem
     setCurrentNiche : React.Dispatch<React.SetStateAction<NicheItem>>
}



export const NicheContext =  createContext<NicheType>(null!) ;