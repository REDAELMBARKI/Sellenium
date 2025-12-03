import React, { useEffect } from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { SectionHeader } from "@/admin/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import {  ProductBackendProps, Variant } from "@/types/productsTypes";
import ProductBasicInfo from "./compos/editPartials/ProductBasicInfo";
import EditProductUIProvider from "@/contextProvoders/editProductProviders/editProductUIProvider";
import { useEditProductUICtx } from "@/contextHooks/editProductCtxHooks/useEditProductUICtx";
import { VariantsSection } from "./compos/SharedPartials/VariantsSection";
import { ToasterNative } from "@/components/ui/ToasterNative";
import { useToasts } from "@/contextHooks/useToasts";
import ProductDataProvider from "@/contextProvoders/sharedProviders/ProductDataProvider";
import { useProductDataCtx } from "@/contextHooks/sharedhooks/useProductDataCtx";


const variants : Variant[] = [
  {
    id: 1,
    colors: [
      { id: 1, name: "Black", hex: "#000000" },
      { id: 2, name: "White", hex: "#FFFFFF" }
    ],
    sizes: [
      { id: 1, name: "S" },
      { id: 2, name: "M" },
      { id: 3, name: "L" }
    ],
    fits: [
      { id: 1, name: "Slim" },
      { id: 2, name: "Regular" }
    ],
    materials: [
      { id: 1, name: "Cotton" },
      { id: 2, name: "Polyester" }
    ],
    quantity: 42,
    covers: [
      "/covers/product1-black.jpg",
      "/covers/product1-white.jpg"
    ]
  },
  {
    id: 2,
    colors: [
      { id: 3, name: "Blue", hex: "#1E90FF" },
      { id: 4, name: "Gray", hex: "#777777" }
    ],
    sizes: [
      { id: 4, name: "M" },
      { id: 5, name: "L" },
      { id: 6, name: "XL" }
    ],
    fits: [
      { id: 3, name: "Oversized" }
    ],
    materials: [
      { id: 3, name: "Denim" }
    ],
    quantity: 18,
    covers: [
      "/covers/product2-blue.jpg",
      "/covers/product2-gray.jpg"
    ]
  },
  {
    id: 3,
    colors: [
      { id: 5, name: "Green", hex: "#4CAF50" }
    ],
    sizes: [
      { id: 7, name: "XS" },
      { id: 8, name: "S" }
    ],
    fits: [
      { id: 4, name: "Relaxed" }
    ],
    materials: [
      { id: 4, name: "Linen" }
    ],
    quantity: 7,
    covers: [
      "/covers/product3-green-1.jpg",
      "/covers/product3-green-2.jpg"
    ]
  }
];

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

                    <VariantsSection  
                     variants={variants}
                  
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

