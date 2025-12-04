


interface EmptyListSectionProps {
    Icon : React.ElementType , 
    label : string  ; 
    description : string 
}


const EmptyListSection = ({Icon , label , description}:EmptyListSectionProps) => {
    return (<>
    
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center" 
        >
            <Icon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-gray-500 font-medium text-lg">{label}</div>
            <div className="text-gray-400 text-sm mt-1">{description}</div>
          </div>

    
    </>)
}



export default EmptyListSection ;