import React, { useEffect } from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import {  ProductBackendProps } from "@/types/productsTypes";
import ProductBasicInfo from "./compos/createEditRouterComponent/ProductBasicInfoRouter";
import { ToasterNative } from "@/components/ui/ToasterNative";
import { useToasts } from "@/contextHooks/useToasts";
import ProductDataProvider from "@/contextProvoders/sharedProviders/ProductDataProvider";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import ProductUIProvider from "@/contextProvoders/sharedProviders/ProductUIProvider";
import { useProductUICtx } from "@/contextHooks/sharedhooks/useProductUICtx";
import GoCreateProduct from "@/components/partials/GoCreateProduct";


export default  function Edit({product , nicheOptions , tagSuggestions}:ProductBackendProps){

   return (      
                <ProductDataProvider product={product} nicheOptions={nicheOptions}  tagSuggestions={tagSuggestions}>
              
                        <ProductUIProvider>
                                    <EditContent/>
                        </ProductUIProvider>
            
                </ProductDataProvider>
                
        
    )
}
Edit.layout = (page: any) => <AdminLayout children={page} />;




function EditContent() {

    const  { productData = {} } = useProductDataCtx()
    const  {hasUnsavedChanges , showToast , setShowToast , setHasUnsavedChanges  } = useProductUICtx()
    const {toastContainerRef} =  useToasts()
    
    useEffect(() => {
        if (hasUnsavedChanges && !showToast) {
            setShowToast(true);
        }
    }, [hasUnsavedChanges, showToast]);


    const handleSaveAllChanges = () => {
        console.log("Saving all changes:", productData);
        alert("Changes saved successfully!");
        setHasUnsavedChanges(false);
        setShowToast(false);
    };

   
  
    if(!productData || Object.keys(productData).length === 0) return (
        // create mode (making a button to create product page )
        <GoCreateProduct title="No product Found " description="" />)

   
    return (
        <> 
        <div className="min-h-screen overflow-auto p-6 bg-gray-50">
            {showToast && hasUnsavedChanges && (
                <ToasterNative />
            )}
            <div ref={toastContainerRef} className="relative bg-slate-50 py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* hehader */}
                    <SectionHeader
                        title="Edit Product"
                        description="Update product details and variants"
                    />
                    <div className="space-y-6">
                        <ProductBasicInfo />
                        <div className="flex justify-center">
                            <Button 
                                variant="outline"
                                onClick={handleSaveAllChanges}
                            >
                                Save All Changes
                            </Button>
                        </div>
                    </div>
                </div>

                
            </div>
            </div>
        </>
    );
}

