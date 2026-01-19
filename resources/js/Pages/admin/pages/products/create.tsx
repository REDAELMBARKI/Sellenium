import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import ProductDataProvider from "@/contextProvoders/sharedProviders/ProductDataProvider";
import ProductUIProvider from "@/contextProvoders/sharedProviders/ProductUIProvider";
import { ProductBackendProps } from "@/types/productsTypes";
import BasicInfoFormMaster from "./A_sharedForAllNiches/RouterAndMasters/ProductFormMaster";


export default function Create({options , data}: ProductBackendProps) { 
   
    return (      
                <ProductDataProvider  options={options} data={data}>
                        <ProductUIProvider>
                                    <CreateContent  />
                        </ProductUIProvider>
            
                </ProductDataProvider>
                
        
    )
}


Create.layout = (page:any) => <AdminLayout  children={page} />

function CreateContent() {


    // const { setImagesPlaceHolders } = useMedia();
    // const { data, isReadyToSubmit, setData } = useProductForm();
    // const { submitForm } = useFormActions();

    // const isReadyToAdd = Object.entries(currentVariant)
    //     .filter(([key]) => key !== "id" && key !== "covers")
    //     .every(
    //         ([, value]) =>
    //             value !== null &&
    //             value !== "" &&
    //             (!Array.isArray(value) || value.length > 0)
    //     );


    // useTagsInventoryValidation();
    // useFieldAndThumbValidation();
    // useFinalSubmitFormValidationCheck();

    return (
        <>
            <div className="py-8">
                <div className="min-w-[90%] mx-auto">
                    {/* hehader */}
                    <SectionHeader
                        title="add Product"
                        description="add product details and variants"
                    />
                   <BasicInfoFormMaster />
                    
                </div>
            </div>
        </>
    );
}