import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "@inertiajs/react";




const GoCreateProduct = ({title, description} :{title : string , description : string}) => {
    return (
        <>
        
          <div className="flex flex-col items-center justify-center">
             <h1>{title}</h1>
             <p>{description}</p>
             <Link href={"/products/create"}>
             <Button> 
               
                 create product
                <Plus />
             </Button>
             </Link>
          </div>
        </>
    )
}


export  default GoCreateProduct ; 