import React, { useEffect } from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import {  ProductBackendProps } from "@/types/productsTypes";
import ProductBasicInfo from "./compos/createEditRouterComponent/ProductBasicInfoRouter";
import { ToasterNative } from "@/components/ui/ToasterNative";
import { useToasts } from "@/contextHooks/useToasts";
import ProductDataProvider from "@/contextProvoders/sharedProviders/ProductDataProvider";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";
import ProductUIProvider from "@/contextProvoders/sharedProviders/ProductUIProvider";
import { useProductUICtx } from "@/contextHooks/sharedhooks/useProductUICtx";


export default  function Edit({product , inventoryOptions , tagSuggestions}:ProductBackendProps){

   return (      
                <ProductDataProvider product={product} inventoryOptions={inventoryOptions}  tagSuggestions={tagSuggestions}>
              
                        <ProductUIProvider>
                                    <EditContent/>
                        </ProductUIProvider>
            
                </ProductDataProvider>
                
        
    )
}
Edit.layout = (page: any) => <AdminLayout children={page} />;




function EditContent() {

    const  { productData } = useProductDataCtx()
    const  {hasUnsavedChanges , showToast   , deleteModalOpen, setShowToast , setHasUnsavedChanges   , setDeleteModalOpen  } = useProductUICtx()
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
                        <ProductBasicInfo
                        />

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

                {deleteModalOpen && (
                    <DeleteConfirmationModal
                        name={productData?.name ?? 'x'}
                        isOpen={deleteModalOpen}
                        entityType="product"
                        onConfirm={() => {}}
                        onClose={() => setDeleteModalOpen(false)}
                    />
                )}
            </div>
            </div>
        </>
    );
}

