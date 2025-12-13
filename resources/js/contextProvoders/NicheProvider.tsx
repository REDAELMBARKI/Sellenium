import { NicheContext, NicheItem } from "@/context/NicheContext"
import { useState } from "react"




const NicheProvider = ({children} : {children : React.ReactNode}) => {
       const [currentNiche , setCurrentNiche] = useState<NicheItem>("fashion") ;
       return (
          <NicheContext.Provider value={{currentNiche , setCurrentNiche}} >
             {children}
          </NicheContext.Provider>
       )
}


export default  NicheProvider ; 