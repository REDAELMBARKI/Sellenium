import React, { useEffect } from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import {  ProductBackendProps } from "@/types/productsTypes";
import ProductBasicInfo from "./compos/editPartials/ProductBasicInfo";
import EditProductUIProvider from "@/contextProvoders/editProductProviders/editProductUIProvider";
import { useEditProductUICtx } from "@/contextHooks/editProductCtxHooks/useEditProductUICtx";
import { VariantsSection } from "./compos/SharedPartials/VariantsSection";
import { ToasterNative } from "@/components/ui/ToasterNative";
import { useToasts } from "@/contextHooks/useToasts";
import ProductDataProvider from "@/contextProvoders/sharedProviders/ProductDataProvider";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";


export default  function Edit({product , inventoryOptions , tagSuggestions}:ProductBackendProps){

   return (      
                <ProductDataProvider product={product} inventoryOptions={inventoryOptions}  tagSuggestions={tagSuggestions}>
              
                        <EditProductUIProvider>
                                    <EditContent/>
                        </EditProductUIProvider>
            
                </ProductDataProvider>
                
        
    )
}
Edit.layout = (page: any) => <AdminLayout children={page} />;




function EditContent() {

    const  { productData } = useProductDataCtx()
    const  {hasUnsavedChanges , showToast , isEditingBasicInfo  , deleteModalOpen, setShowToast ,  setIsEditingBasicInfo , setHasUnsavedChanges , setEditingVariantId  , setDeleteModalOpen , } = useEditProductUICtx()
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
            {showToast && hasUnsavedChanges && (
                <ToasterNative />
            )}
            <div ref={toastContainerRef} className="relative min-h-screen bg-slate-50 py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* hehader */}
                    <SectionHeader
                        title="Edit Product"
                        description="Update product details and variants"
                    />
                    <div className="space-y-6">
                        <ProductBasicInfo
                        />

                    <VariantsSection />
                     
                    
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
                        name={"somethong"}
                        isOpen={deleteModalOpen}
                        entityType="variant"
                        onConfirm={() => {}}
                        onClose={() => setDeleteModalOpen(false)}
                    />
                )}
            </div>
        </>
    );
}

