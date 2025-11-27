import { Plus } from "lucide-react"
import React from "react";





export const SectionHeader = ({title , description ,  children}:{title:string ; description : string ; children? : React.ReactNode}) => {
    return (
      <>
      
       {/* Header */}
        <div className="flex justify-between items-center mb-6  mt-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          {/* right side dev */}
          <section>
              {children}
          </section>
        </div>

      </>
       
    )
}


 